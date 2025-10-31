import { intInRoman } from "@/utils/utils";
import { StyleSheet, Text, View } from "react-native";
import Button from "./Button";

type Props = {
    startGame: (boardCols: number) => void;
}

export default function Menu({startGame}: Props) {
    const AVAILABLE_ROWS_OPTIONS = [3, 4, 5, 6, 7];

    return (
        <View>
            <Text style={styles.title}>TicTacToe</Text>
            <Text style={styles.subtitle}>Start game</Text>
            <View style={styles.rowsOptions}>
                {AVAILABLE_ROWS_OPTIONS.map((rows: number) => (
                    <Button description={intInRoman(rows) + " rows"} onPress={() => startGame(rows)}/>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontFamily: "Handodle",
        color: "#fff",
        fontSize: 64,
        letterSpacing: 2,
        textAlign: "center"
    },
    subtitle: {
        fontFamily: "Handodle",
        color: "#fff",
        fontSize: 48,
        textAlign: "center",
        marginTop: 20,
        textDecorationLine: "underline"
    },
    rowsOptions: {
        margin: 20,
        flexDirection: "row",
        gap: 50
    },
})