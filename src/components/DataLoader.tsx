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

        let startupValue = typeof move.startup === "string"
        ? move.startup.split(",")[0].trim().replace("i", "")
        : move.startup;

        if (move.on_ch === "") move.on_ch = move.on_hit;

        return {
        moveNumber: moveNum + 1,
        data: {
            ...move,
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