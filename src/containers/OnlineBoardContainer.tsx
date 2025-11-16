import Board from "@/components/Board";
import { MatchCallback } from "@/interfaces/Match";
import { PlayerSymbol, Winner } from "@/interfaces/Player";
import { Session } from "@/interfaces/Session";

type Props = {
    currentStatus: MatchCallback
    boardCols: number
    session: Session
    handleClick: (index: number) => void
}

export default function OnlineBoardContainer({currentStatus, boardCols, session, handleClick}: Props) {
    console.log(currentStatus)

    function isMyTurn(): boolean {
        return session.deviceId == currentStatus.next_turn
    }

    function getWinner(): Winner|null {
        if (currentStatus.winner) {
            return { symbol: currentStatus.winner as PlayerSymbol, line: [] }
        }
        return null;
    }

    function handlePlay(index: number) {
        if (!isMyTurn()) {
            return;
        }
        handleClick(index);
    }

    function getTurnLabel() {
        return isMyTurn() ? "your" : "the opponent";
    }

    return <Board squares={currentStatus.board} onHandleClick={handlePlay} winner={getWinner()} nextPlayer={getTurnLabel()} boardCols={boardCols}/>
}