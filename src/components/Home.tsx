import DataLoader from "./DataLoader";
import FlowchartDisplay from "./FlowchartDisplay";
import { ReactFlowProvider } from "@xyflow/react";

const Home = () => {
    return (
        <div className="w-full h-full">
            <DataLoader>
                {({ frameData, challengeData }) => (
                    <ReactFlowProvider>
                        <FlowchartDisplay 
                        frameData={frameData}
                        challengeData={challengeData}
                        />
                    </ReactFlowProvider>
                )}
            </DataLoader>
            
        </div>
    )
};
export default Home