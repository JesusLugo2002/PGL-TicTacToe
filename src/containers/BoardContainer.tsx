import Board from "@/components/Board";
import { PlayerSymbol, Winner } from "./GameContainer";

type Props = {
    xIsNext: boolean
    squares: string[]
    winner: Winner|null
    isTie: boolean
    checkWinner: (nextSquares: string[]) => boolean
    onPlay: (nextSquares: string[]) => void
    giveVictory: (symbol: PlayerSymbol) => void
    boardCols: number
}

export default function BoardContainer({xIsNext, squares, winner, isTie, checkWinner, onPlay, boardCols}: Props) {
    const getNextPlayer = () => {
        return xIsNext ? "X" : "O";
    }
    
    const handleClick = (index: number) => {
        if (squares[index] || winner) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[index] = getNextPlayer();
        onPlay(nextSquares);
        checkWinner(nextSquares);
    }
    
    return (
        <Board squares={squares} 
        onHandleClick={handleClick} 
        isTie={isTie}
        winner={winner} 
        nextPlayer={getNextPlayer()} 
        boardCols={boardCols} />
    )
}