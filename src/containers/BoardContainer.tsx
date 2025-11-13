import Board from "@/components/Board";
import { GridSquares } from "@/interfaces/Board";
import { PlayerSymbol } from "@/interfaces/Player";
import { Winner } from "./GameContainer";

type Props = {
    xIsNext: boolean
    squares: GridSquares
    winner: Winner|null
    isTie: boolean
    checkWinner: (nextSquares: GridSquares) => boolean
    onPlay: (nextSquares: GridSquares) => void
    giveVictory: (symbol: PlayerSymbol) => void
    boardCols: number
}

export default function BoardContainer({xIsNext, squares, winner, isTie, checkWinner, onPlay, boardCols}: Props) {
    
    /**
     * Devuelve el `PlayerSymbol` equivalente al jugador actual.
     * @returns {PlayerSymbol}
     */
    function getNextPlayer(): PlayerSymbol {
        return xIsNext ? "X" : "O";
    }
    
    /**
     * Gestiona la accion con un cuadrado del grid dependiendo del indice.
     * Si se intenta interactuar con un cuadrado mientras ya tiene un valor
     * o se haya determinado un ganador, se ignora.
     * Si no actualiza el grid registrando el movimiento nuevo y se comprueba
     * que exista una victoria o empate.
     * @param {number} index indice del cuadrado con el que se interactua
     */
    function handleClick(index: number): void {
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