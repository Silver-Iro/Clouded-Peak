import React, { useState } from 'react';

type MoveNumAddProps = {
    matchedMove: number;
    frameData: any[];
    onAddMove: (e: React.FormEvent, move: number) => void;
    onValidateMove: (e: React.ChangeEvent<HTMLInputElement>) => void;
    };


type MoveSearchAddProps = {
    searchTerm:string;
    onSearchChange:(e:React.ChangeEvent<HTMLInputElement>) =>void;
    onSearchSubmit:(e:React.FormEvent) =>void;
    results:any[];
    onSelectResult:(move:any) =>void;

}

export const MoveNumAdd: React.FC<MoveNumAddProps> = ({
    matchedMove,
    frameData,
    onAddMove,
    onValidateMove
}) => {


    return (
        <div className='w-48 absolute top-4 left-4 z-20 px-2 py-2  bg-stone-800 rounded-md border-2 border-stone-700'>
            <form
                onSubmit={(e) => onAddMove(e, matchedMove)}
                className='flex justify-evenly gap-2'
            >
                <button
                    type="submit"
                    className="w-30 h-8 rounded-md bg-yellow-700 hover:bg-amber-600 text-blac cursor-pointer text-white font-thin text-lg"
                >
                    Add Move
                </button>
                <input
                    type="number"
                    min={1}
                    max={frameData?.length - 1 || 1}
                    onChange={onValidateMove}
                    value={matchedMove}
                    className='w-12 bg-stone-700 text-white rounded-md pl-2'
                />
            </form>
        </div>
    );
};

export const MoveSearchAdd: React.FC<MoveSearchAddProps> = ({
    searchTerm,
    onSearchChange,
    onSearchSubmit,
    results,
    onSelectResult,

}) => {

    return (
        <div className='w-48 relative top-18 left-4 z-20 px-2 py-2 bg-stone-800 rounded-md border-2 border-stone-700'>
            <form
                onSubmit={onSearchSubmit}
                className='flex flex-col items-center justify-center gap-2'
            >
                <input
                    type="text"
                    placeholder='Search Moves'
                    onChange={onSearchChange}
                    value={searchTerm}
                    className='w-full text-center h-8 m-auto bg-stone-700 text-white rounded-md pl-2'
                />
                <button
                    type="submit"
                    className="w-30 h-8 rounded-md bg-yellow-700 hover:bg-amber-600 text-blac cursor-pointer text-white font-thin text-lg"
                >
                    Add Move
                </button>
            </form>
            {results.length>0 &&(
                <ul className='absolute w-full mt-1 max-h-48 overflow-y-auto bg-stone-700 rounded shadow-lg z-20'>
                    {results.map((move, index) => (
                        <li 
                            key={index}
                            onClick={()=> onSelectResult(move)}
                            className='px-2 py-1 hover:bg-yellow-600 cursor-pointer text-white'
                        >
                            {move.data.input}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};