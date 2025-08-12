// import { useCallback } from "react";
import { X } from 'lucide-react';
import { CustomHandleOnHit, CustomHandleOnBlock, CustomHandleOnChallenge, CustomHandleIn } from './CustomHandles';
import { Position,type Node, } from "@xyflow/react";
import { useReactFlowUtils } from './hooks/useCustomReactFlowUtils';



const MoveNodeCard = ({data,id,selected}:Node<Record<string,any>>) =>{
  const {removeNode}= useReactFlowUtils()

  return (
    <div className={`flex flex-col text-updater-node h-26 w-48 text-white bg-stone-800  border-2 rounded-lg border-stone-700
                    ${selected?"w-50 h-28 border-2 border-yellow-600":"" }`}>
      <div className="w-full h-6 rounded-t-md bg-stone-700">
        <p className="text-lg text-center m-auto">{data.input}</p>
        <X size={20} onClick={()=> removeNode(id)} className='absolute right-1 top-1'></X>
      </div>
      <div className="relative flex-1 grid grid-cols-2 grid-rows-3 children-overflow-hidden whitespace-nowrap text-ellipsi">
        <p className="text-left ml-2">{`${data.startup}\u00A0\u00A0( ${data.target} )`}</p>
        <p className="text-right mr-2">{data.on_hit}</p>
        <p className="text-left ml-2">&ensp; &gt; {data.crush}</p>
        <p className="text-right mr-2">{data.on_block}</p>
        <p className="text-left ml-2">{data.name}</p>
        <p className="text-right mr-2">{`Chlng for(${data.on_ch})`}</p>
      </div>
      <div className="">
        <CustomHandleOnHit type="source" position={Position.Right} id="hit"/>
        </div>
      <div className="">
        <CustomHandleOnBlock type="source" position={Position.Right} id="block"/>
      </div>
      <div className="">
        <CustomHandleOnChallenge type="source" position={Position.Right} id="chall"/>
      </div>
      <div className="">
        <CustomHandleIn type="target" position={Position.Left} id="in"/>
      </div>
    </div>
  );
}

export default MoveNodeCard
