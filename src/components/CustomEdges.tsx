import { BaseEdge, type EdgeProps } from '@xyflow/react';
import { type Node, EdgeLabelRenderer, getStraightPath, useStore } from '@xyflow/react';
import { X } from 'lucide-react';
import { useReactFlowUtils } from './hooks/useCustomReactFlowUtils';

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
  const { removeEdge } = useReactFlowUtils();

  // Subscribe to live node objects so this component re-renders on node data changes
  const sourceNode = useStore((s) => s.nodeLookup.get(source));
  const targetNode = useStore((s) => s.nodeLookup.get(target));

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
  const strokeColor = newStartup < 10 ? '#4ade80' : newStartup > 15 ? '#ff5151' : '#efefef';

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
          {newStartup}
          <X
            size={16}
            onClick={() => removeEdge(id)}
            className="absolute right-1 top-0.5 cursor-pointer"
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
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
  const { removeEdge } = useReactFlowUtils();

  // Subscribe to live node objects so this component re-renders on node data changes
  // nodeInternals was renamed to nodeLookup in React Flow v12
  const sourceNode = useStore((s) => s.nodeLookup.get(source));
  const targetNode = useStore((s) => s.nodeLookup.get(target));

  // Helper to safely parse numeric values
  const parseNum = (value: any): number => {
    const num = parseInt(String(value));
    return Number.isFinite(num) ? num : 0;
  };

  // Calculate the new advantage based on source handle
  const calculateChallengeOutcome = () => {
    let startupFrames = parseNum(targetNode?.data?.startupValue);
    const crushValue = parseNum(targetNode?.data?.crushValue);
    const crushType = targetNode?.data?.crushType;
    const target = sourceNode?.data?.tsrget;
    // const hit = parseNum(sourceNode?.data?.on_hitValue);
    // const block = parseNum(sourceNode?.data?.on_blockValue);
    const ch = parseNum(sourceNode?.data?.on_chValue);
   
      if ((crushType === target) && crushValue<startupFrames) 
        startupFrames = 100 ////////////////////////////////////////////////
      if ((targetNode?.data?crush.startsWth("pc;;")) && crushValue<startupFrames )
        startupFrames = 100 /////////////////////////////////////////////////
      return startupFrames - ch;
    }
   

  const calculateStrokeColor = () => {
    if (sourceHandleId !== 'chall')
      return newStartup < 10 ? '#4ade80' : newStartup > 15 ? '#ff5151' : '#efefef';
    else return newStartup
  }

  const newStartup = calculateChallengeOutcome();
  const strokeColor = calculateStrokeColor() 

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
          {newStartup}
          <X
            size={16}
            onClick={() => removeEdge(id)}
            className="absolute right-1 top-0.5 cursor-pointer"
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}