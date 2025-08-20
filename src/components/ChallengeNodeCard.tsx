import { X } from 'lucide-react';
import { CustomHandleOnHit, CustomHandleOnBlock, CustomHandleOnChallenge, CustomHandleIn } from './CustomHandles';
import { Position,type Node, } from "@xyflow/react";
import { useReactFlowUtils } from './hooks/useCustomReactFlowUtils';
import { useState, useEffect, useMemo } from 'react';
import { invertNumericValues, formatAdvantage } from '../utils/customUtils';


type MoveList = {
  moveNumber:Number,
  data:Record<string,unknown>,
};

type ChallengeNodeCardProps = {
  data:Record<string,unknown>;
  id: string;
  selected: boolean;
  challengeData: MoveList[]; // Passing full array only to build dropdown options .. does this need refacatoring?
  onChangeMove: (nodeId: string, move: MoveList) => void;
};

const ChallengeNodeCard = ({data,id,selected,challengeData,onChangeMove}:ChallengeNodeCardProps) =>{
  const {removeNode}= useReactFlowUtils();
  // console.log("from inside card node: "+data.challengeOutcome)
  
  // Find the index of the current data in challengeData array
  const currentIndex = useMemo(() => {
    const index = challengeData.findIndex(move => 
      move.data.name === data.name || 
      JSON.stringify(move.data) === JSON.stringify(data)
    );
    return index >= 0 ? index : 0;
  }, [data, challengeData]);

  const [selectedIndex, setSelectedIndex] = useState(currentIndex);

  // Update selectedIndex when data or challengeData changes
  useEffect(() => {
    setSelectedIndex(currentIndex);
  }, [currentIndex]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newIndex = parseInt(e.target.value);
    setSelectedIndex(newIndex);
    
    const inverted:any = {
      ...challengeData[newIndex].data,
      on_ch: invertNumericValues(challengeData[newIndex].data.on_ch) || 0,
      on_chValue: invertNumericValues(challengeData[newIndex].data.on_chValue) || 0,
    };
    onChangeMove(id, { moveNumber: challengeData[newIndex].moveNumber,data:inverted });
  };

  return (
    <div className={`flex flex-col relative text-updater-node h-36 w-48 text-white bg-yellow-950  border-2 rounded-lg border-stone-700
                    ${selected?"w-50 h-38 border-2 border-yellow-600":"" }`}>
      <div className="w-full h-6 rounded-t-md bg-yellow-900">
        <p className="text-lg text-center m-auto">Challenge Move</p>
        <X size={20} onClick={()=> removeNode(id)} className='absolute right-1 top-1'></X>
      </div>
      <form className='flex flex-col'>
        {//<label className='self-center'> choose a challenge move</label>//
          }
        <select value={selectedIndex} onChange={handleChange} className='mx-2 border-2 border-white bg-stone-800 rounded-sm'>
          {challengeData.map((move:MoveList,index:number) => 
            <option key={index} value={index}>{move.data.name as string}</option>
          )}
        </select>
      </form>
      <div className="relative flex-1 grid grid-cols-2 grid-rows-3 children-overflow-hidden whitespace-nowrap font-sans font-medium text-ellipsi">
        <p className="text-left ml-2">{data.startup}</p>
        <p className="text-right mr-2">{data.challengeOutcome || "Unknown Outcome"}</p>
        <p className="text-left ml-2"> {data.crush}</p>
        <p className="text-right mr-2">{(data.challengeOutcome ==="Won")?formatAdvantage(data.outcomeFrames): data.on_ch}</p>
        <p className="text-left ml-2">{data.name}</p>
        <p className="text-right mr-2"></p>
      </div>
     
      <div className="relative -translate-y-23">
        <CustomHandleOnChallenge type="source" position={Position.Right} id="chall"/>
      </div>
      <div className="">
        <CustomHandleIn type="target" position={Position.Left} id="in"/>
      </div>
    </div>
  );
}

export default ChallengeNodeCard