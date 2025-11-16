import Board from "@/components/Board";
import { MatchCallback } from "@/interfaces/Match";
import { PlayerSymbol, Winner } from "@/interfaces/Player";
import { Session } from "@/interfaces/Session";
import { getCombinationsLine } from "@/utils/GetWinnerUtils";

type Props = {
    currentStatus: MatchCallback
    boardCols: number
    session: Session
    handleClick: (index: number) => void
}

export default function OnlineBoardContainer({currentStatus, boardCols, session, handleClick}: Props) {
    function isMyTurn(): boolean {
        return session.deviceId == currentStatus.next_turn
    }

    function getWinner(): Winner|null {
        const squares = getSquares()
        if (currentStatus.winner) {
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
                    return { symbol: currentStatus.winner as PlayerSymbol, line: currentLine }
                }
            }
        }
        return null;
    }

    function handlePlay(index: number) {
        if (!isMyTurn()) {
            alert("You can't play, is not your turn!")
            return;
        }
        if (getWinner() || getSquares()[index] ) {
            return;
        }
        handleClick(index);
    }

    function getTurnLabel() {
        return isMyTurn() ? "your" : "the opponent";
    }

    function getSquares() {
        const grid = currentStatus.board;
        const result = grid[0].map((_: any, colIndex: number) => {
            return grid.map((row: any) => {return row[colIndex]})
        })
        return result.flat();
    }

    function isTie() {
        return getWinner() == null && getSquares().every((square: string) => square != "");
    }

    return <Board squares={getSquares()} onHandleClick={handlePlay} winner={getWinner()} nextPlayer={getTurnLabel()} boardCols={boardCols} isTie={isTie()}/>
}