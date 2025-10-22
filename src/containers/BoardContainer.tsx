import Board from "@/components/Board";
import { useState } from "react";

export default function BoardContainer() {
    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState<Array<string>>(Array(9).fill(null));
        
    const handleClick = (index: number) => {
        const nextSquares = squares.slice();
        nextSquares[index] = xIsNext ? "X" : "O";
        setSquares(nextSquares);
        setXIsNext(!xIsNext);
    }

    return (
        <Board squares={squares} onHandleClick={handleClick}/>
    )
}