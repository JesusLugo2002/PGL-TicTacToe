import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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

    const moves = history.map((_, moveIndex) => {
        let description = moveIndex > 0 ? "Go to move #" + moveIndex : "Go to game start";
        return (
            <Pressable style={styles.historyButton} key={moveIndex} onPress={() => jumpTo(moveIndex)}>
                <Text style={styles.historyLabel}>{description}</Text>
            </Pressable>
        )
    })

    return (
        <View style={styles.container}>
            <BoardContainer xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            <View>
                <Text style={styles.historyTitle}>History</Text>
                {moves}
            </View>
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
    historyTitle: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    historyButton: {
        backgroundColor: "#ffcfa8ff",
        margin: 10,
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 10
    },
    historyLabel: {
        fontSize: 16,
        borderRadius: 10,
        textAlign: "center"
    }
})