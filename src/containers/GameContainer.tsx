import History from "@/components/History";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import BoardContainer from "./BoardContainer";

export default function GameContainer() {
    const [xIsNext, setXIsNext] = useState(true);
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const currentSquares = history[currentMove];

    const handlePlay = (nextSquares: Array<string>) => {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setXIsNext(!xIsNext);
    } 

    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove);
        setXIsNext(nextMove % 2 === 0);
    }

    return (
        <View style={styles.container}>
            <BoardContainer xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            <History history={history} jumpTo={jumpTo}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        gap: 40,
    },
})