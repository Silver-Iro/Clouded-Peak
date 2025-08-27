import { useState, useCallback, useRef, useMemo } from 'react';
import Fuse from 'fuse.js';
import { type Node,useReactFlow,ReactFlow, Background, applyEdgeChanges, applyNodeChanges, addEdge,type Connection, type Edge, type ConnectionState,} from '@xyflow/react';
import MoveNodeCard from './MoveNodeCard';
import ChallengeNodeCard from './ChallengeNodeCard';
import { invertNumericValues } from '../utils/customUtils';



// import type {MoveNodeData} from './MoveNodeCard'

import '@xyflow/react/dist/style.css';
import CustomControls from './CustomControls';
import {AdvantageEdge,ChallengeEdge} from './CustomEdges';
import { MoveNumAdd, MoveSearchAdd } from './CustomOverlays';


type FlowchartDisplayProps = {
  frameData:any;
  challengeData: any;
}

const FlowchartDisplay = ({ frameData, challengeData }: FlowchartDisplayProps) => {


  const [matchedMove, setMatchedMove] = useState<number>(27);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const {getEdges,screenToFlowPosition} = useReactFlow<Node,Edge>();

  // fuzzy search helper.
  const normalizeMove = (str: string) =>{
    return str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }

  // fuse with normalized names to allow loose searching.
  const fuse = useMemo(() => {
    const normalizedData = frameData.map((move) => ({
      ...move,
      normalizedName: normalizeMove(move.data.input),
    }));
    return new Fuse(normalizedData, {
      keys: ['normalizedName'],
      threshold: 0.3,
      ignoreLocation: true,
      distance: 100,  
      minMatchCharLength: 1,
    });
  }, [frameData]);

  const id = useRef(0);
  const getID = () => `${id.current++}`;


  const updateNodeData = useCallback((nodeId: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data:{...node.data, ...newData.data}} : node
        )
      );
    },[])

  const nodeTypes = useMemo (() => ( {
    moveCard:MoveNodeCard,
    challengeCard: (nodeProps)=>(
      <ChallengeNodeCard 
        {...nodeProps}
        challengeData={challengeData}
        onChangeMove={updateNodeData}
      />
     ) ,
  }),[challengeData,updateNodeData]);

  const edgeTypes ={
    adv:AdvantageEdge,
    chall:ChallengeEdge,
  }
    const rfStyle = {
    backgroundColor: '#101010',
  };  

    
    

        const onNodesChange = useCallback(
      (changes:any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
      [],
    );
    const onEdgesChange = useCallback(
      (changes:any) => setEdges((edgesSnapshot:any) => applyEdgeChanges(changes, edgesSnapshot)),
      [],
    );

    const onConnect = useCallback((params: Connection) => {
      const { source, sourceHandle, target, targetHandle } = params;
        const {newAdvEdge,filteredEdges} = calculateNewAdvEdge(source,target,sourceHandle as string,targetHandle as string);
        setEdges(() => addEdge(newAdvEdge, filteredEdges));
    },[setEdges]);

  
  // Add challenge Node on edge drop over blank area
  const onConnectEnd = useCallback(
    (event:any, connectionState:ConnectionState) => {
      // when a connection is dropped on the pane it's not valid
      if ((connectionState.fromHandle?.id !== "chall") ||(typeof challengeData === "undefined")) return;
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getID();
        const { clientX, clientY } =
          'changedTouches' in event ? event.changedTouches[0] : event;
        const newNode:Node<any> = {
          id,
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          type: "challengeCard",
          data:{ ...challengeData[5].data,
          on_ch: invertNumericValues(challengeData[5].data.on_ch) || 0,
          on_chValue: invertNumericValues(challengeData[5].data.on_chValue) || 0,
          },
          origin: [0.5, 0.0],
        };
        
        const {newAdvEdge,filteredEdges} = calculateNewAdvEdge(connectionState.fromNode?.id as string,id,connectionState.fromHandle?.id as string,"in","chall");
        
        setNodes((nds) => nds.concat(newNode));
        // setEdges((eds) =>
        //   eds.concat({ id,type:"adv", sourceHandle:connectionState.fromHandle?.id, source: connectionState.fromNode?.id, target: id }),
        // );
        setEdges(() =>
          filteredEdges.concat(newAdvEdge),
        );
      }
    },
    [screenToFlowPosition],
  );
    // adding new nodes
  const reactFlowInstance = useReactFlow();

  const addSelectedMoveByNumber = (e:React.FormEvent,num:number) => {
    e.preventDefault();
    if (!num) {
      alert("invalid move selection");
      return;
    }

    setNodes((prev) => [
      ...prev.map((node) => ({ ...node, selected: false })), // deselect existing
      {
        id: getID(),
        type: "moveCard",
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        selected: true,
        data: frameData?.[num]?.data,
      },
    ]);
  };

  const validateMatchingMove = (e:any) => {
    const min=1;
    const max=frameData?.length-1 || 10;
    let num= e.target.value as unknown as number;
    if (num<min){
      num="";
    }else if (num>max){
      num=max;
    } else num=num
    setMatchedMove(num);
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    const normalizedTerm = normalizeMove(term);
    const results = fuse.search(normalizedTerm).map((r) => r.item)

    setSearchResults(results.slice(0, 10));
  };

  
  const addSelectedMoveBySearch = (move:any) => {
    if (!move) return;
    setNodes((prev) => [
    ...prev.map((n) => ({ ...n, selected: false })), // deselect others
    {
      id: getID(),
      type: 'moveCard',
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      selected: true,
      data: move.data,
    },
  ]);

  setSearchTerm('');
  setSearchResults([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchResults.length) return;
    addSelectedMoveBySearch(searchResults[0]); // take top result
  }

  const calculateNewAdvEdge = (source:string,target:string,sourceHandle:string,targetHandle:string,type = 'adv') => {
    const newEdgeID:string = `${source}-${target}`
      // Filter existing edges between same 2 Nodes
      const filteredEdges = getEdges().filter<Edge>(edg => edg.id !== newEdgeID)
        const newAdvEdge: Edge = {
          
          id: newEdgeID,
          source:source,
          target:target,
          sourceHandle:sourceHandle,
          targetHandle:targetHandle,
          type: type,
          label: 'dynamic', // use for generated nodes
          animated: true,
          style: { stroke: '#888' },
        };
        return {newAdvEdge,filteredEdges}
  }

  

  return (
    <div className='ml-auto mr-auto mt-2 justify-center  rounded-[1rem] font-[Bebas_Neue] overflow-hidden' style={{ height: '90%', width: '90%' }}>
      <p></p>
      <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      style={rfStyle}
      fitView
      
      zoomOnScroll
      zoomOnPinch
      proOptions={{hideAttribution: true}}
      >
        <Background color="#777766"/>
        <MoveNumAdd 
          matchedMove={matchedMove}
          frameData={frameData}
          onAddMove={addSelectedMoveByNumber}
          onValidateMove={validateMatchingMove}
        />

        <MoveSearchAdd 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          results={searchResults}
          onSelectResult={addSelectedMoveBySearch}
        />

        <CustomControls />
      </ReactFlow>

  
      
    </div>
  );
}

export default FlowchartDisplay