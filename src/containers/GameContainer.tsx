import { useState } from "react";
import { Pressable, View } from "react-native";
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

    const moves = history.map((squares, move) => {
        let description = move > 0 ? "Go to move #" + move : "Go to game start";
        return (
            <Pressable key={move} onPress={() => jumpTo(move)}>{description}</Pressable>
        )
    })

    return (
        <View>
            <BoardContainer xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            {moves}
        </View>
    );
}