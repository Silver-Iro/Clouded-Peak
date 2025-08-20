import { BaseEdge, type EdgeProps,useReactFlow } from '@xyflow/react';
import { type Node, EdgeLabelRenderer, getStraightPath, useStore } from '@xyflow/react';
import { X } from 'lucide-react';
import { useReactFlowUtils } from './hooks/useCustomReactFlowUtils';
import { useEffect, useRef, useState } from 'react';
import {getEffectiveStartup} from '../utils/customUtils';

export function AdvantageEdge({
  id,
  source,
  sourceHandleId,
  selected,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY
}: EdgeProps) {
  const { setNodes } = useReactFlow();
  const { removeEdge, } = useReactFlowUtils();
  const sourceNode = useStore((s) => s.nodeLookup.get(source));
  const targetNode = useStore((s) => s.nodeLookup.get(target));

  // Subscribe to live node objects so this component re-renders on node data changes
  
  // Helper to safely parse numeric values
  const parseNum = (value: any): number => {
    const num = parseInt(String(value));
    return Number.isFinite(num) ? num : 0;
  };

  

  // Calculate the new advantage based on source handle
  const calculateNewAdvantage = () => {
    let startupFrames = parseNum(targetNode?.data?.startupValue);
    const hit = parseNum(sourceNode?.data?.on_hitValue);
    const block = parseNum(sourceNode?.data?.on_blockValue);
    const ch = parseNum(sourceNode?.data?.on_chValue);
    ;
    if (sourceNode?.type==="challengeCard"){
      return startupFrames = startupFrames - sourceNode?.data?.outcomeFrames;
    }
    
    if (sourceHandleId === 'hit') {
      return startupFrames - hit;
    } else if (sourceHandleId === 'block') {
      return startupFrames - block;
    } else if (sourceHandleId === 'chall') {
      return startupFrames - ch;
    }
    return startupFrames;
  };

  
  const newStartup = calculateNewAdvantage();
  const strokeColor = newStartup < 10 ? '#4ade80' : newStartup> 15 ? '#ff5151' : '#efefef';

  
  // Calculate label position
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  
  // useEffect(() => {
  //   if (!targetNode) return;

  //   setNodes((nds) =>
  //     nds.map((n) =>
  //       n.id === target
  //         ? {
  //             ...n,
  //             data: {
  //               ...n.data,
  //               effectiveStartup: newStartup, // store effective startup here
  //             },
  //           }
  //         : n
  //     )
  //   );
  // }, [newStartup]);


  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: selected ? 4 : 2,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className={`p-1 nodrag nopan text-white bg-yellow-900 w-20 h-auto text-sm font-sans text-left pl-2 rounded-md ${
            selected ? 'border-2 border-white' : ''
          }`}
        >
          Startup frames: {newStartup>0?newStartup:0}
          <X
            size={16}
            onClick={() => removeEdge(id)}
            className="absolute right-1 top-0.5 cursor-pointer"
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
  // END of advantage edge
}


export function ChallengeEdge({
  id,
  source,
  sourceHandleId,
  selected,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY
}: EdgeProps) {
  const {setNodes,getNode, getEdges} = useReactFlow()
  const { removeEdge } = useReactFlowUtils();

  // Subscribe to live node objects so this component re-renders on node data changes
  const sourceNode = useStore((s) => s.nodeLookup.get(source));
  const targetNode = useStore((s) => s.nodeLookup.get(target));
  console.log(sourceNode, " with ", targetNode)
  
  // Helper to safely parse numeric values
  const parseNum = (value: any) => {
    const num = parseInt(String(value));
    return Number.isFinite(num) ? num : 0;
  };

  // find effective startup
  const effectiveStartup = getEffectiveStartup(sourceNode, getEdges(), getNode);
  const sourceStartup = parseNum(effectiveStartup ?? sourceNode?.data?.startupValue);
  // target doesn't have effective startup but let it be for now...
  const targetStartup = parseNum(targetNode?.data?.effectiveStartup ?? targetNode?.data?.startupValue);

  // re calculate advantage of previous mode to judge the interaction.
  // const advantageEdges = useStore(s =>
  //   Array.from(s.edgeLookup.values()).filter(e => e.target === source && e.type === 'adv')
  // );
  // const lastAdvEdge = advantageEdges.at(-1); // last advantage edge to this node

  

  let pastAdvantage = 0;
//   if (lastAdvEdge) {
//   const lastSourceNode = useStore(s => s.nodeLookup.get(lastAdvEdge.source));
//   const hit = parseInt(lastSourceNode?.data?.on_hitValue) || 0;
//   const block = parseInt(lastSourceNode?.data?.on_blockValue) || 0;
//   const ch = parseInt(lastSourceNode?.data?.on_chValue) || 0;
  
//   pastAdvantage = lastAdvEdge.sourceHandle === 'hit' ? hit
//                  : lastAdvEdge.sourceHandle === 'block' ? block
//                  : lastAdvEdge.sourceHandle === 'chall' ? ch
//                  : 0;
// }

  // we already established that move is faster than crusher
  const moveACrushedByB = (move,crusher) => {
    console.log(crusher.crush)
    if (!crusher?.crush){
      return false
    }
    let moveStartup = parseNum(move.startupValue);
    const target = move.moveTarget;
    const crusherStartup = parseNum(crusher.startupValue)
    const crushValue = parseNum(crusher.crushValue);
    const crushType = crusher.crushTarget;
  
    // const hit = parseNum(sourceNode?.data?.on_hitValue);
    // const block = parseNum(sourceNode?.data?.on_blockValue);
    // const ch = parseNum(sourceNode?.data?.on_chValue);

    // check if move A target loses to move B crush state and the startupframes are slower than crush start.
    const losesTo:Record<string,string[]> = {
      "h":["cs","ps","pc","ra"],
      "m":["ps","pc","ra"],
      "s":["js","pc","ra"],
      "l":["js","ra"],
      "t":["cs","js","ra"],
      "":[],
    };
    console.log(target," and ", crushType);
    if (losesTo[target as string]?.includes(crushType as string) && moveStartup>crushValue){
          console.log("included")
          return true;
        } else return false;


  }


  // Calculate the new advantage based on source handle
  const didSourceWin = ():boolean => {
    if (!sourceNode || !targetNode) return false;
    if (moveACrushedByB(sourceNode?.data,targetNode?.data)) {
      console.log("source got ceushed by target")
      return false
    } else if (moveACrushedByB(targetNode?.data,sourceNode?.data)) {
      console.log("Target got ceushed by source")
      return true
    } else if (sourceStartup < targetStartup) {
      console.log("No crushing happened, Won by frames")
      return true
      }
    console.log("No crushing happened, Lost by frames")
    console.log(sourceStartup)
    return false
    }
  
  const outcome = didSourceWin() ? "Won" : "Lost";
  console.log(didSourceWin());


  // let strokeColor = "#ababab";

  // if (ChallengeWon){
  //   outcome = ChallengeWon()?"Won":"Lost";
  //   strokeColor = ChallengeWon()?'#4ade80': "#ff5151";

  // }

    // Push outcome into target node data
  useEffect(() => {
    if (!targetNode) return;

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== target) return n;

        const newData = {
          ...n.data,
          challengeOutcome: outcome,
          outcomeFrames: didSourceWin()
            ? parseNum(sourceNode?.data?.on_chValue)
            : parseNum(targetNode?.data?.on_chValue),
        };

        // prevent infinite loop: skip update if no change
        if (
          n.data.challengeOutcome === newData.challengeOutcome &&
          n.data.outcomeFrames === newData.outcomeFrames
        ) {
          return n;
        }

        return { ...n, data: newData };
      })
    );
  }, [outcome, sourceStartup, targetStartup,]);
  // Calculate label position
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
   const strokeColor = outcome === "Won" ? "#4ade80" : "#ff5151";

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: selected ? 4 : 2,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className={`p-1 nodrag nopan pl-2 text-left text-white bg-yellow-900 w-24 h-auto text-sm font-sans text-left pl-2 rounded-md ${
            selected ? 'border-2 border-white' : ''}`
          }>
           challenge <b>{outcome} </b>with effective startup of <br /><b>{sourceStartup } frames</b>.
          <X size={16}
            onClick={() => removeEdge(id)}
            className="absolute right-1 top-0.5 cursor-pointer"
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );

  // END of Challenge Edge.
}