import Board from "@/components/Board";
import { MatchCallback, MatchStatus } from "@/interfaces/Match";
import { PlayerSymbol, Winner } from "@/interfaces/Player";
import { Session } from "@/interfaces/Session";

type Props = {
    match: MatchStatus
    currentStatus: MatchCallback
    boardCols: number
    session: Session
}

export default function OnlineBoardContainer({match, currentStatus, boardCols, session}: Props) {
    function handleClick() {
        alert("Haz elegido un cuadro")
    }

    function getWinner(): Winner|null {
        if (currentStatus.winner) {
            return { symbol: currentStatus.winner as PlayerSymbol, line: [] }
        }
        return null;
    }

    function getTurnLabel() {
        return session.deviceId == currentStatus.next_turn ? "your" : "the opponent";
    }

    return <Board squares={currentStatus.board} onHandleClick={handleClick} winner={getWinner()} nextPlayer={getTurnLabel()} boardCols={boardCols}/>
}