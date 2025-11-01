import { PlayerSymbol } from "@/containers/GameContainer"
import { GlobalStyles } from "@/styles/GlobalStyles"
import { intInRoman } from "@/utils/utils"
import { StyleSheet, Text, View } from "react-native"

type Props = {
    history: Record<PlayerSymbol, number>
}

export default function GameHistory({history}: Props) {
    return (
    <View>
        <Text style={GlobalStyles.font}>{intInRoman(history.X)} --- Player X | Player O --- {intInRoman(history.O)}</Text>
    </View>
    )
}