import Menu from "@/components/Menu";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import BoardContainer from "./BoardContainer";

export default function GameContainer() {
    const [inGame, setInGame] = useState(false);
    const [boardCols, setBoardCols] = useState(10);
    const [xIsNext, setXIsNext] = useState(true);
    const [history, setHistory] = useState([Array(boardCols * boardCols).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    let currentSquares = history[currentMove];

    /**
     * Reinicia el juego a su estado inicial
     * @returns {void}
     */
    function resetGame(): void {
        setInGame(false);
        setHistory([Array(boardCols * boardCols).fill(null)]);
        setCurrentMove(0);
        currentSquares = history[currentMove];
    }

    /**
     * Gestiona el click sobre un cuadro, actualizando el historial y configurando el siguiente movimiento
     * @param {Array<string>} nextSquares Grid resultante de haber dibujado un cuadro 
     * @returns {void}
     */
    function handlePlay(nextSquares: Array<string>): void {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setXIsNext(!xIsNext);
    }

    /**
     * Gestiona el inicio de una partida al seleccionar dificultad en el menu
     * @param {number} boardCols Numero de filas y columnas del grid
     * @returns {void}
     */
    function handleStartGame(boardCols: number): void {
        setBoardCols(boardCols);
        setInGame(true);
    }

    /**
     * Configura como movimiento actual el movimiento seleccionado del historial
     * @param {number} nextMove Indice del movimiento
     * @returns {void}
     */
    function jumpTo(nextMove: number): void {
        setCurrentMove(nextMove);
        setXIsNext(nextMove % 2 === 0);
    }

    return inGame ? (
        <View style={styles.container}>
            <BoardContainer xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} onReset={resetGame} boardCols={boardCols}/>
            {/* <History history={history} jumpTo={jumpTo}/> */}
        </View>
    ) : (
        <Menu startGame={handleStartGame}/> 
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
})