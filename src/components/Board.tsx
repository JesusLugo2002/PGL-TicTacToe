import { StyleSheet, Text, View, ViewStyle } from "react-native";
import Square from "./Square";

type Props = {
    squares: Array<string>
    onHandleClick: (index: number) => void;
    winner: string|null
    nextPlayer: string
}

export default function Board({squares, onHandleClick, winner, nextPlayer}: Props) {
    function generateBorderStyle(top: boolean, right: boolean, bottom: boolean, left: boolean): ViewStyle {
        return {
            borderTopColor: top ? "#fff" : "transparent",
            borderRightColor: right ? "#fff" : "transparent",
            borderBottomColor: bottom ? "#fff" : "transparent",
            borderLeftColor: left ? "#fff" : "transparent",
        }
    }

    const grid = [
        [
            {index: 0, borderStyle: generateBorderStyle(false, true, true, false)},
            {index: 1, borderStyle: generateBorderStyle(false, true, true, true)},
            {index: 2, borderStyle: generateBorderStyle(false, false, true, true)}
        ],
        [
            {index: 3, borderStyle: generateBorderStyle(true, true, true, false)},
            {index: 4, borderStyle: generateBorderStyle(true, true, true, true)},
            {index: 5, borderStyle: generateBorderStyle(true, false, true, true)},
        ],
        [
            {index: 6, borderStyle: generateBorderStyle(true, true, false, false)},
            {index: 7, borderStyle: generateBorderStyle(true, true, false, true)},
            {index: 8, borderStyle: generateBorderStyle(true, false, false, true)},
        ]
    ]
    
    const getStatus = () => {
        return winner ? `Player ${winner} wins` : ` Is ${nextPlayer} turn...`
    }

    return (
        <View>
            <View>
                <Text style={styles.title}>TicTacToe</Text>
            </View>
            {grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((square) => (
                        <Square value={squares[square.index]} handleClick={() => onHandleClick(square.index)} borderStyle={square.borderStyle}/>
                    ))}
                </View>
            ))}
            <View>
                <Text style={styles.status}>{getStatus()}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
    },
    title: {
        fontFamily: "Handodle",
        fontSize: 64,
        letterSpacing: 2,
        marginBottom: 20,
        color: "#fff"
    },
    status: {
        fontFamily: "Handodle",
        textAlign: "center",
        fontSize: 32,
        marginTop: 20,  
        color: "#fff"
    }
})