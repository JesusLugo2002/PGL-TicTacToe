import Board from "@/components/Board";
import { generateEmptyGrid } from "@/utils/utils";

type Props = {
    xIsNext: boolean,
    squares: string[],
    onPlay: (nextSquares: string[]) => void,
    onReset: () => void;
    boardCols: number
}

export type Winner = {
    symbol: String
    line: Array<number>
}

export default function BoardContainer({xIsNext, squares, onPlay, onReset, boardCols}: Props) {
    const lines = [...getHorizontalLines(), ...getVerticalLines(), ...getDiagonalLines()];

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

    function getHorizontalLines() {
        let result = generateEmptyGrid(boardCols);
        result.forEach((row, rowIndex) => {
            result[rowIndex] = row.map((_, colIndex) => {
                return colIndex + rowIndex * boardCols;
            })
        })
        return result;
    }

    function getVerticalLines() {
        let result = generateEmptyGrid(boardCols);
        result.forEach((row, rowIndex) => {
            result[rowIndex] = row.map((_, colIndex) => {
                return rowIndex + colIndex * boardCols;
            })
        })
        return result;
    }

    function getDiagonalLines() {
        let result = Array(2).fill(Array(boardCols).fill(null));
        result.forEach((diagonal, diagonalIndex) => {
            result[diagonalIndex] = diagonal.map((_: any, rowIndex: number) => {
                if (diagonalIndex == 0) {
                    return boardCols * rowIndex + rowIndex;
                } 
                return (rowIndex + 1) * (boardCols - 1) 
            })
        })
        return result;
    }

    function getWinner(): Winner|null {
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
                return {symbol: firstSym, line: currentLine};
            }
        }
        return null;
    }

    return (
        <Board squares={squares} onHandleClick={handleClick} winner={getWinner()} nextPlayer={getNextPlayer()} boardCols={boardCols} onReset={onReset}/>
    )
}