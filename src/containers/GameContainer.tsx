import History from "@/components/MoveHistory";
import Menu from "@/components/Menu";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import BoardContainer from "./BoardContainer";
import GameHistory from "@/components/GameHistory";
import { GlobalStyles } from "@/styles/GlobalStyles";
import Actions from "@/components/Actions";
import MoveHistory from "@/components/MoveHistory";

export type PlayerSymbol = "X" | "O"

export default function GameContainer() {
    const [inGame, setInGame] = useState(false);
    const [boardCols, setBoardCols] = useState(10);
    const [xIsNext, setXIsNext] = useState(true);
    const [moveHistory, setMoveHistory] = useState(generateInitialHistory());
    const [gameHistory, setGameHistory] = useState<Record<PlayerSymbol, number>>({"X": 0, "O": 0});
    const [currentMove, setCurrentMove] = useState(0);
    let currentSquares = moveHistory[currentMove];

    function generateInitialHistory() {
        return [Array(boardCols * boardCols).fill(null)];
    }

    function resetGame(goingToMenu: boolean): void {
        if (goingToMenu) {
            setInGame(false);
        }
        setMoveHistory(generateInitialHistory());
        setCurrentMove(0);
        currentSquares = moveHistory[currentMove];
        setXIsNext(!xIsNext);
    }

    function handlePlay(nextSquares: Array<string>): void {
        const nextHistory = [...moveHistory.slice(0, currentMove + 1), nextSquares];
        setMoveHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setXIsNext(!xIsNext);
    }

    function handleStartGame(boardCols: number): void {
        setBoardCols(boardCols);
        setInGame(true);
    }

    function jumpToMove(nextMove: number) {
        setCurrentMove(nextMove);
        setXIsNext(nextMove % 2 === 0);
    }

    function giveVictory(symbol: PlayerSymbol): void {
        const newScore = gameHistory[symbol] + 1;
        gameHistory[symbol] = newScore;
        setGameHistory(gameHistory);
    } 

    return inGame ? (
        <View style={styles.container}>
            <Text style={[GlobalStyles.font, styles.title]}>TicTacToe</Text>
            <GameHistory history={gameHistory}/>
            <BoardContainer xIsNext={xIsNext} 
            squares={currentSquares} 
            onPlay={handlePlay} 
            giveVictory={giveVictory}
            boardCols={boardCols}/>
            <Actions onReset={resetGame}/>
            <MoveHistory history={moveHistory} jumpTo={jumpToMove}/>
        </View>
    ) : (
        <Menu startGame={handleStartGame}/> 
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        gap: 10,
    },
    title: {
        textAlign: "center",
        fontSize: 64,
        letterSpacing: 2,
    },
})