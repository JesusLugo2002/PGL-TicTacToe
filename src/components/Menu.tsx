import { StyleSheet, Text, View } from "react-native";
import Button from "./Button";

type Props = {
    startGame: (boardCols: number) => void;
}

export default function Menu({startGame}: Props) {
    return (
        <View>
            <Text style={styles.title}>TicTacToe</Text>
            <Text style={styles.subtitle}>Start game</Text>
            <View style={styles.difficultyOptions}>
                <Button description="III Rows" onPress={() => startGame(3)}/>
                <Button description="V Rows" onPress={() => startGame(5)}/>
                <Button description="VII Rows" onPress={() => startGame(7)}/>
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
    difficultyOptions: {
        margin: 20,
        flexDirection: "row",
        gap: 50
    },
})