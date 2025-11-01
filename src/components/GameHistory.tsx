import { PlayerSymbol } from "@/containers/GameContainer"
import { GlobalStyles } from "@/styles/GlobalStyles"
import { intInRoman } from "@/utils/utils"
import { StyleSheet, Text, View } from "react-native"

type Props = {
    history: Record<PlayerSymbol, number>
}

export default function GameHistory({history}: Props) {
    return (
    <View style={[styles.container]}>
        <Text style={GlobalStyles.font}>
            <Text style={styles.scoreLabel}>{intInRoman(history.X)}</Text> - Player X</Text>
        <Text style={GlobalStyles.font}>Victories</Text>
        <Text style={GlobalStyles.font}>
            Player O - <Text style={styles.scoreLabel}>{intInRoman(history.O)}</Text>
        </Text>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    scoreLabel: {
        textDecorationLine: "underline"
    }
})