import Board from "@/components/Board";
import { PlayerSymbol } from "./GameContainer";
import { getCombinationsLine } from "@/utils/GetWinnerUtils";

type Props = {
    xIsNext: boolean
    squares: string[]
    onPlay: (nextSquares: string[]) => void
    giveVictory: (symbol: PlayerSymbol) => void
    boardCols: number
}

export type Winner = {
    symbol: String
    line: Array<number>
}

export default function BoardContainer({xIsNext, squares, onPlay, giveVictory, boardCols}: Props) {
    
    const getNextPlayer = () => {
        return xIsNext ? "X" : "O";
    }
    
    const handleClick = (index: number) => {
        if (squares[index] || getWinner()) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[index] = getNextPlayer();
        onPlay(nextSquares);
    }
    
    function getWinner(): Winner|null {
    const lines = getCombinationsLine(boardCols);
        for (let i = 0; i < lines.length; i++) {
            const currentLine = lines[i];
            const firstLineIndex = currentLine[0];
            const firstSym = squares[firstLineIndex];
            if (!firstSym) {
                continue;
            }
            const matches = currentLine.map((index: number) => {
                return squares[index] === firstSym;
            })
            if (matches.every((match: boolean) => match)) {
                giveVictory(firstSym as PlayerSymbol);
                return {symbol: firstSym, line: currentLine};
            }
        }
        return null;
    }

    return (
        <Board squares={squares} 
        onHandleClick={handleClick} 
        winner={getWinner()} 
        nextPlayer={getNextPlayer()} 
        boardCols={boardCols} />
    )
}