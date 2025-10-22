import Board from "@/components/Board";
import { useState } from "react";

export default function BoardContainer() {
    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState<Array<string>>(Array(9).fill(null));

    const getNextPlayer = () => {
        return xIsNext ? "X" : "O";
    }
        
    const handleClick = (index: number) => {
        if (squares[index] || getWinner()) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[index] = getNextPlayer();
        setSquares(nextSquares);
        setXIsNext(!xIsNext);
    }

    const getWinner = () => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],  
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }

    return (
        <Board squares={squares} onHandleClick={handleClick} winner={getWinner()} nextPlayer={getNextPlayer()}/>
    )
}