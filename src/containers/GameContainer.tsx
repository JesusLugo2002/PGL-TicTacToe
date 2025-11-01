import Actions from "@/components/Actions";
import Button from "@/components/Button";
import GameHistory from "@/components/GameHistory";
import Menu from "@/components/Menu";
import MoveHistory from "@/components/MoveHistory";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { getCombinationsLine } from "@/utils/GetWinnerUtils";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import BoardContainer from "./BoardContainer";

export type PlayerSymbol = "X" | "O"

export type GridSquares = Array<PlayerSymbol|null>

export type Winner = {
    symbol: PlayerSymbol
    line: Array<number>
}

export default function GameContainer() {
    const INITIAL_GAME_HISTORY: Record<PlayerSymbol, number> = {"X": 0, "O": 0};

    const [inGame, setInGame] = useState(false);
    const [boardCols, setBoardCols] = useState(3);
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState<Winner|null>(null);
    const [tie, setTie] = useState(false);
    const [moveHistory, setMoveHistory] = useState<Array<GridSquares>>(generateInitialHistory());
    const [gameHistory, setGameHistory] = useState<Record<PlayerSymbol, number>>(INITIAL_GAME_HISTORY);
    const [currentMove, setCurrentMove] = useState(0);

    let currentSquares: GridSquares = moveHistory[currentMove];

    /**
     * Genera el valor inicial del MoveHistory (historial de movimientos)
     * @returns {Array<GridSquares>}
     */
    function generateInitialHistory(): Array<GridSquares> {
        return [Array(boardCols * boardCols).fill(null)];
    }

    /**
     * Reinicia el juego a su estado inicial y, si fue reiniciado mientras
     * estaba en curso una partida, se le da un punto al jugador contrario
     * a ejecutar el reinicio.
     * @param {boolean} goingToMenu `true` si desea que el jugador sea enviado al menu principal, si no, `false`.
     */
    function resetGame(goingToMenu: boolean): void {
        if (goingToMenu) {
            setInGame(false);
        }
        setMoveHistory(generateInitialHistory());
        setCurrentMove(0);
        currentSquares = moveHistory[currentMove];
        setXIsNext(winner == null ? !xIsNext : xIsNext);
        if (winner == null && !tie) {
            giveVictory(xIsNext ? "O" : "X");
        }
        setWinner(null)
        setTie(false);
    }

    /**
     * Actualiza el historial y el turno del siguiente jugador haciendo uso de un nuevo
     * grid de cuadrados. 
     * @param {GridSquares} nextSquares array de cuadrados nuevos.
     */
    function handlePlay(nextSquares: GridSquares): void {
        const nextHistory = [...moveHistory.slice(0, currentMove + 1), nextSquares];
        setMoveHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setXIsNext(!xIsNext);
    }
    
    /**
     * Gestiona el inicio de una partida configurando el tamaño del grid.
     * @param {number} boardCols numero de filas/columnas del grid.
     */
    function handleStartGame(boardCols: number): void {
        setBoardCols(boardCols);
        setInGame(true);
    }

    /**
     * Envia al jugador al movimiento elegido del historial de movimientos.
     * @param {number} nextMove numero de turno/movimiento
     */
    function jumpToMove(nextMove: number) {
        setCurrentMove(nextMove);
        setXIsNext(nextMove % 2 === 0);
    }

    /**
     * Aumenta en uno la puntuacion del jugador determinado.
     * @param {PlayerSymbol} symbol simbolo del jugador
     */
    function giveVictory(symbol: PlayerSymbol): void {
        const newScore = gameHistory[symbol] + 1;
        gameHistory[symbol] = newScore;
        setGameHistory(gameHistory);
    } 

    /**
     * Reinicia el contador de victorias.
     */
    function resetGameHistory(): void {
        setGameHistory(INITIAL_GAME_HISTORY);
    }

    /**
     * Comprueba si el juego ha sido ganado mirando las combinaciones posibles y chequeando
     * que se cumpla alguna, otorgando la victoria al jugador que lo logre.
     * @param {GridSquares} nextSquares el grid actual para comprobar.
     * @returns {boolean} `true` si se ha encontrado un ganador, `false` si no o si hay empate.
     */
    function checkWinner(nextSquares: GridSquares): boolean {
        const lines = getCombinationsLine(boardCols);
        for (let i = 0; i < lines.length; i++) {
            const currentLine = lines[i];
            const firstLineIndex = currentLine[0];
            const firstSym = nextSquares[firstLineIndex];
            if (!firstSym) {
                continue;
            }
            const matches = currentLine.map((index: number) => {
                return nextSquares[index] === firstSym;
            })
            if (matches.every((match: boolean) => match)) {
                setWinner({symbol: firstSym as PlayerSymbol, line: currentLine});
                giveVictory(firstSym as PlayerSymbol);
                return true;
            }
        }
        setTie(nextSquares.every(value => value != null));
        setWinner(null);
        return false;
    }

    return (
        <View style={styles.container}>
            <Text style={[GlobalStyles.font, styles.title]}>TicTacToe</Text>
            <GameHistory history={gameHistory}/>
            {!inGame ? (
                <View style={styles.container}>
                    <Menu startGame={handleStartGame}/>
                    <Button description="Reset victories stats" onPress={() => resetGameHistory()}/>
                </View>
            ) : (
                <View style={styles.container}>
                    <BoardContainer xIsNext={xIsNext} 
                    winner={winner}
                    isTie={tie}
                    checkWinner={checkWinner}
                    squares={currentSquares} 
                    onPlay={handlePlay} 
                    giveVictory={giveVictory}
                    boardCols={boardCols}/>
                    <Actions onReset={resetGame}/>
                    <MoveHistory history={moveHistory} jumpTo={jumpToMove}/>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        gap: 10,
        justifyContent: "space-between",
        paddingBottom: 10
    },
    title: {
        textAlign: "center",
        fontSize: 64,
        letterSpacing: 2,
    },
})