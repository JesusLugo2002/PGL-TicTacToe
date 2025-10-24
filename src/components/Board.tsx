import { StyleSheet, Text, View } from "react-native";
import Square from "./Square";

type Props = {
    squares: Array<string>
    onHandleClick: (index: number) => void;
    winner: string|null
    nextPlayer: string
}

export default function Board({squares, onHandleClick, winner, nextPlayer}: Props) {
    const grid = [
        [
            {index: 0, borderStyle: { borderTopColor: "transparent", borderLeftColor: "transparent"}},
            {index: 1, borderStyle: { borderTopColor: "transparent" }},
            {index: 2, borderStyle: { borderTopColor: "transparent", borderRightColor: "transparent"}}
        ],
        [
            {index: 3, borderStyle: { borderLeftColor: "transparent"}},
            {index: 4, borderStyle: {}},
            {index: 5, borderStyle: { borderRightColor: "transparent"}},
        ],
        [
            {index: 6, borderStyle: { borderBottomColor: "transparent", borderLeftColor: "transparent"}},
            {index: 7, borderStyle: { borderBottomColor: "transparent" }},
            {index: 8, borderStyle: { borderBottomColor: "transparent", borderRightColor: "transparent"}},
        ]
    ]
    
    const getStatus = () => {
        return winner ? `Winner: ${winner}` : `Next player: ${nextPlayer}`
    }

    return (
        <View>
            <View>
                <Text style={styles.status}>{getStatus()}</Text>
            </View>

            {grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((square) => (
                        <Square value={squares[square.index]} handleClick={() => onHandleClick(square.index)} borderStyle={square.borderStyle}/>
                    ))}
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
    },
    status: {
        textAlign: "center",
        fontSize: 24,
        marginBottom: 20
    }
})