import CustomNavBar from "./CustomNavBar";
import DataLoader from "./DataLoader";
import FlowchartDisplay from "./FlowchartDisplay";
import { ReactFlowProvider } from "@xyflow/react";

const Home = () => {
    return (
        <>
        <div className='box-border w-screen h-screen bg-neutral-900'>
            <CustomNavBar/>
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
        </>
    )
};
export default Home