import { useState } from "react";

export default function GameContainer() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    const handlePlay = (nextSquares: any) => {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    const jumpTo = (nextMove: number) => {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let description = move > 0 ? 'Go to move #' + move : 'Go to game start';

        return (
        <li key={move}>
            <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">

            </div>
            <div className="game-info">
                
            </div>
        </div>
    )
}