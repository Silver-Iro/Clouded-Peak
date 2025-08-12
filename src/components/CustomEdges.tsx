import { BaseEdge, type EdgeProps,useReactFlow } from '@xyflow/react';
import { type Node, EdgeLabelRenderer, getStraightPath, useStore } from '@xyflow/react';
import { X } from 'lucide-react';
import { useReactFlowUtils } from './hooks/useCustomReactFlowUtils';
import { useEffect, useRef, useState } from 'react';

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
          className={`nodrag nopan text-white bg-yellow-900 w-20 h-auto text-center rounded-md ${
            selected ? 'border-2 border-white' : ''
          }`}
        >
          ST: {newStartup}
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
  const {getEdges} = useReactFlow()
  const { removeEdge } = useReactFlowUtils();

  // Subscribe to live node objects so this component re-renders on node data changes
  // nodeInternals was renamed to nodeLookup in React Flow v12
  const sourceNode = useStore((s) => s.nodeLookup.get(source));
  const targetNode = useStore((s) => s.nodeLookup.get(target));
  console.log(sourceNode, " with ", targetNode)

  let advantage = 0;
  let pastAdvantage = 0;
  

  // re calculate advantage of previous mode to judge the interaction.
  const advantageEdges = getEdges().filter(edge=>(edge.target===source));
  if (advantageEdges.length>0){
    const edge=advantageEdges.at(-1);
    const pastHandleID = edge?.sourceHandle;
    const sourceNode = useStore((s) => s.nodeLookup.get(edge.source));
    const hit = parseInt(sourceNode?.data?.on_hitValue);
    const block = parseInt(sourceNode?.data?.on_blockValue);
    const ch = parseInt(sourceNode?.data?.on_chValue);
    ;
    if (pastHandleID === 'hit') {
      pastAdvantage = hit;
    } else if (pastHandleID === 'block') {
      pastAdvantage = block;
    } else if (pastHandleID === 'chall') {
      pastAdvantage = ch};
  }

  // Helper to safely parse numeric values
  const parseNum = (value: any): number => {
    const num = parseInt(String(value));
    return Number.isFinite(num) ? num : 0;
  };


  // we already established that move is faster than crusher
  const moveACrushedByB = (move,crusher) => {
    if (crusher.crush ===""){
      return false
    }
    let startupFrames = parseNum(move.startupValue)-pastAdvantage;
    const target = move.moveTarget;
    const crusherFrames = parseNum(crusher.startupValue)
    const crushValue = parseNum(crusher.crushValue);
    const crushType = crusher.crushTarget;
  
    // const hit = parseNum(sourceNode?.data?.on_hitValue);
    // const block = parseNum(sourceNode?.data?.on_blockValue);
    // const ch = parseNum(sourceNode?.data?.on_chValue);
    const losesTo:Record<string,string[]> = {
      "h":["cs","ps","pc","ra"],
      "m":["ps","pc","ra"],
      "s":["js","pc","ra"],
      "l":["js","ra"],
      "":[],
    };
    console.log(target," and ", crushType);
    if (losesTo[target as string]?.includes(crushType as string) && startupFrames>crushValue){
          console.log("included")
          return true;
        } else return false;


  }


  // Calculate the new advantage based on source handle
  const ChallengeWon = ():boolean => {
    if (moveACrushedByB(sourceNode?.data,targetNode?.data)) {
      console.log("source got ceushed by target")
      return false
    } else if (moveACrushedByB(targetNode?.data,sourceNode?.data)) {
      console.log("Target got ceushed by source")
      return true
    } else if (sourceNode?.data.startupValue<targetNode?.data.startupValue){
      return true
      }

    return false
    }
  
  let outcome = "N/A";
  let strokeColor = "#ababab";

  if (ChallengeWon){
    outcome = ChallengeWon()?"Won":"Lost";
    strokeColor = ChallengeWon()?'#4ade80': "#ff5151";

  }

  // Calculate label position
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

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
          className={`nodrag nopan pl-2 text-left text-white bg-yellow-900 w-22 h-auto rounded-md ${
            selected ? 'border-2 border-white' : ''}`
          }>
           {outcome} @{pastAdvantage<0?"":"+"}{pastAdvantage}
          <X size={16}
            onClick={() => removeEdge(id)}
            className="absolute right-1 top-0.5 cursor-pointer"
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}