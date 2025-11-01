import { GlobalStyles } from "@/styles/GlobalStyles";
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
            <Text style={[GlobalStyles.font, styles.title]}>TicTacToe</Text>
            <Text style={[GlobalStyles.font, styles.subtitle]}>Start game</Text>
            <View>
                {AVAILABLE_ROWS_OPTIONS.map((rows: number) => (
                    <Button key={rows} description={intInRoman(rows) + " rows"} onPress={() => startGame(rows)} buttonStyle={styles.button}/>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 64,
        letterSpacing: 2,
        textAlign: "center"
    },
    subtitle: {
        fontSize: 32,
        textAlign: "center",
        margin: 20,
    },
    button: {
        margin: 10
    }
})