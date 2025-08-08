import { useReactFlow } from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react'; // or any icons

const CustomControls = () => {
    const reactFlowInstance = useReactFlow();
    if (!reactFlowInstance) return null
  const { zoomIn, zoomOut, fitView } = reactFlowInstance;

  return (
    <div className="absolute z-50 pointer-events-auto  left-4 bottom-4 flex flex-col gap-1 p-2 bg-stone-800 rounded-lg shadow-lg [&>*]:bg-yellow-700">
      <button onClick={() =>  zoomIn()} 
        className="p-2 rounded hover:bg-amber-600">
        <ZoomIn className="w-4 h-4 text-white" />
      </button>
      <button onClick={()=>zoomOut()} className="p-2 rounded hover:bg-amber-600">
        <ZoomOut className="w-4 h-4 text-white" />
      </button>
      <button onClick={()=>fitView()} className="p-2 rounded hover:bg-amber-600">
        <Maximize className="w-4 h-4 text-white"  />
      </button>
    </div>
  );
};
export default CustomControls