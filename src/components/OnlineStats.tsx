import { PlayerStats } from "@/interfaces/Player";
import { Session } from "@/interfaces/Session";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { intInRoman } from "@/utils/utils";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    session: Session
    stats: PlayerStats|null
}

export default function OnlineStats({ session,stats }: Props) {
    return stats != null ? (
        <View style={[styles.container]}>
            <Text style={GlobalStyles.font}>Wins: {intInRoman(stats.wins)}</Text>
            <Text style={GlobalStyles.font}>Welcome, {session.playerName}</Text>
            <Text style={GlobalStyles.font}>Losses: {intInRoman(stats.losses)}</Text>
        </View>
    ) : (
        <Text style={GlobalStyles.font}>Loading stats...</Text>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
    },
})