import { Target } from "lucide-react";
import { useState,useEffect, type JSX } from "react";

 type MoveList = {
        moveNumber: number;
        data: Record<string, unknown>;
    };

    type DataLoaderProps = {
        children: (data: { frameData: MoveList[]; challengeData: MoveList[] }) => JSX.Element;
    };

const DataLoader = ({ children }: DataLoaderProps) => {
    const [frameData, setFrameData] = useState<MoveList[] | null>(null);
    const [challengeData, setChallengeData] = useState<MoveList[] | null>(null);
    const [loading, setLoading] = useState(true);

    const cleanMovesetByMove = (move: any, moveNum: number) => {
        const cleanNumeric = (value: any) => {
        const num = parseInt(String(value).replace(/[^\d\-+.]/g, ""));
        return isNaN(num) ? 0 : num;
        };

        // split and clean startup value
        let startupValue = typeof move.startup === "string"
        ? move.startup.split(",")[0].trim().replace("i", "")
        : move.startup;

        // handle cases where ducking/FC moves recover FC but not written in dataset.
        if ( move.target === "l" && move.crush==="" && move.recovery==="FC"){
            move.crush = "cs0~"
        }
        
        // prepare values for crushing calculations
        let crushTarget = ""
        let crushValue = ""
        if (move.crush.length>=2){
            const split =move.crush.split("~")[0].trim()
            crushTarget = split.slice(0,2);
            crushValue = split.slice(2) || 0;
        }
        
        
        if (move.on_ch === "") move.on_ch = move.on_hit;

        return {
        moveNumber: moveNum + 1,
        data: {
            ...move,
            crushTarget,
            crushValue,
            moveTarget: move.target.slice(0,1).toLowerCase(),
            startupValue: cleanNumeric(startupValue),
            on_hitValue: cleanNumeric(move.on_hit),
            on_blockValue: cleanNumeric(move.on_block),
            on_chValue: cleanNumeric(move.on_ch)
        },
        };
    };

    useEffect(() => {
        Promise.all([
        fetch("/data/xiaoyu.json")
            .then((res) => res.json())
            .then((json) => json.map((move: any, i: number) => cleanMovesetByMove(move, i))),
        fetch("/data/challenge.json")
            .then((res) => res.json())
            .then((json) => json.map((move: any, i: number) => cleanMovesetByMove(move, i)))
        ])
        .then(([frameList, challengeList]) => {
            setFrameData(frameList);
            setChallengeData(challengeList);
            setLoading(false);
            console.log(frameList);
        })
        .catch((err) => {
            console.error("Error loading data:", err);
        });
        
    }, []);

    if (loading) {
        return (
        <div className="flex justify-center items-center h-screen text-white">
            Loading...
        </div>
        );
    }

    
   return children({ frameData: frameData!, challengeData: challengeData! });
};
export default DataLoader ;