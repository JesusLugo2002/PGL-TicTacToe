import { PlayerStats } from "@/interfaces/Player";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { getPlayer } from "@/utils/ApiHandler";
import { intInRoman } from "@/utils/utils";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    playerId: string
    playerName: string
}

export default function OnlineStats({ playerId, playerName }: Props) {
    const [stats, setStats] = useState<PlayerStats|null>(null);

    useEffect(() => {
        getPlayer(playerId).then((playerStats) => setStats(playerStats));
    }, [])

    return stats != null ? (
        <View style={[styles.container]}>
            <Text style={GlobalStyles.font}>Wins: {intInRoman(stats.wins)}</Text>
            <Text style={GlobalStyles.font}>Welcome, {playerName}</Text>
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