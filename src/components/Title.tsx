import { GlobalStyles } from "@/styles/GlobalStyles";
import { StyleSheet, Text } from "react-native";

export default function Title() {
    return <Text style={[GlobalStyles.font, styles.title]}>TicTacToe</Text>
}

const styles = StyleSheet.create({
    title: {
        textAlign: "center",
        fontSize: 64,
        letterSpacing: 2,
    }
});