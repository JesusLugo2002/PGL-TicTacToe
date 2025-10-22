import { StyleSheet, View } from "react-native";
import Square from "./Square";

type Props = {
    squares: Array<string>
    onHandleClick: (index: number) => void;
}

export default function Board({squares, onHandleClick}: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Square value={squares[0]} handleClick={() => onHandleClick(0)}/>
                <Square value={squares[1]} handleClick={() => onHandleClick(1)}/>
                <Square value={squares[2]} handleClick={() => onHandleClick(2)}/>
            </View>
            <View style={styles.row}>
                <Square value={squares[3]} handleClick={() => onHandleClick(3)}/>
                <Square value={squares[4]} handleClick={() => onHandleClick(4)}/>
                <Square value={squares[5]} handleClick={() => onHandleClick(5)}/>
            </View>
            <View style={styles.row}>
                <Square value={squares[6]} handleClick={() => onHandleClick(6)}/>
                <Square value={squares[7]} handleClick={() => onHandleClick(7)}/>
                <Square value={squares[8]} handleClick={() => onHandleClick(8)}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderBlockColor: "#080606ff",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10
    },
    row: {
        flexDirection: "row",
        gap: 10,
        margin: 10
    }
})