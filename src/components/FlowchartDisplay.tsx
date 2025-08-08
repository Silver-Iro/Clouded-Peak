import { useState, useCallback, useRef, useMemo } from 'react';
import { type Node,useReactFlow,ReactFlow, Background, applyEdgeChanges, applyNodeChanges, addEdge,type Connection, type Edge, type ConnectionState,} from '@xyflow/react';
import MoveNodeCard from './MoveNodeCard';
import ChallengeNodeCard from './ChallengeNodeCard';



// import type {MoveNodeData} from './MoveNodeCard'

import '@xyflow/react/dist/style.css';
import CustomControls from './CustomControls';
import {AdvantageEdge} from './CustomEdges';


type FlowchartDisplayProps = {
  frameData:any;
  challengeData: any;
}

const FlowchartDisplay = ({ frameData, challengeData }: FlowchartDisplayProps) => {


  const [matchedMove, setMatchedMove] = useState<number>(7);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const {getEdges,screenToFlowPosition} = useReactFlow<Node,Edge>()

  const id = useRef(0);
  const getID = () => `${id.current++}`;


  const updateNodeData = useCallback((nodeId: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: newData.data} : node
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
          // data: { label: `Node ${id}` },
          data: challengeData[0].data,
          origin: [0.5, 0.0],
        };
        
        const {newAdvEdge,filteredEdges} = calculateNewAdvEdge(connectionState.fromNode?.id as string,id,connectionState.fromHandle?.id as string,"in");
        
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

  const addSelectedNode = (e:any,num:number) => {
    e.preventDefault()
    console.log("adding move no:",num)
    if (!num){
      alert("invalid move selection")
      return
    }
    
    setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        selected: false,
      }))
    );

    const newNode = {
      id : getID(),
      type:"moveCard",
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      selected:true,
      data: frameData?.[num]?.data,
    };
    reactFlowInstance.addNodes(newNode);
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

  const calculateNewAdvEdge = (source:string,target:string,sourceHandle:string,targetHandle:string) => {
    const newEdgeID:string = `${source}-${target}`
      // Filter existing edges between same 2 Nodes
      const filteredEdges = getEdges().filter<Edge>(edg => edg.id !== newEdgeID)
        const newAdvEdge: Edge = {
          
          id: newEdgeID,
          source:source,
          target:target,
          sourceHandle:sourceHandle,
          targetHandle:targetHandle,
          type: 'adv',
          label: 'dynamic', // use for generated nodes
          animated: true,
          style: { stroke: '#888' },
        };
        return {newAdvEdge,filteredEdges}
  }

  return (
    <div className='ml-auto mr-auto mt-2 justify-center  rounded-[1rem] font-[Bebas_Neue] overflow-hidden' style={{ height: '80%', width: '80%' }}>
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
        <div className=' w-48 flex justify-evenly absolute top-4 left-4 z-20 px-2 py-2 rounded bg-stone-800'>
          <form onSubmit={(e)=>addSelectedNode(e,matchedMove)}>
            <button type="submit"
            className="w-30 h-8  rounded-md bg-yellow-700 hover:bg-amber-600 text-blac cursor-pointer text-white font-thin text-lg">
              Add Move
            </button>
            <input type="number" min={1} max={frameData?.length-1 || 1} 
            onChange={(e) =>{validateMatchingMove(e)}} value={matchedMove}
            className='w-12 bg-stone-700 text-white rounded-md pl-2' />
          </form>
        </div>
        
      
        <CustomControls />
      </ReactFlow>

  
      
    </div>
  );
}

export default FlowchartDisplay