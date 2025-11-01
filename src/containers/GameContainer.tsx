import History from "@/components/History";
import Menu from "@/components/Menu";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import BoardContainer from "./BoardContainer";

export default function GameContainer() {
    const [inGame, setInGame] = useState(false);
    const [boardCols, setBoardCols] = useState(10);
    const [xIsNext, setXIsNext] = useState(true);
    const [history, setHistory] = useState(generateInitialHistory());
    const [currentMove, setCurrentMove] = useState(0);
    let currentSquares = history[currentMove];

    function generateInitialHistory() {
        return [Array(boardCols * boardCols).fill(null)];
    }

    const leaveGame = () => {
        setInGame(false);
        resetGame();
    }

    function resetGame(): void {
        setHistory(generateInitialHistory());
        setCurrentMove(0);
        currentSquares = history[currentMove];
        setXIsNext(!xIsNext);
    }

    const handlePlay = (nextSquares: Array<string>) => {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setXIsNext(!xIsNext);
    } 

    const handleStartGame = (boardCols: number) => {
        setBoardCols(boardCols);
        setInGame(true);
    }

    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove);
        setXIsNext(nextMove % 2 === 0);
    }

    return inGame ? (
        <View style={styles.container}>
            <BoardContainer xIsNext={xIsNext} 
            squares={currentSquares} 
            onPlay={handlePlay} 
            onLeave={leaveGame}
            onReset={resetGame}
            boardCols={boardCols}/>
            <History history={history} jumpTo={jumpTo}/>
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
        flexDirection: "row",
        gap: 40,
    },
})