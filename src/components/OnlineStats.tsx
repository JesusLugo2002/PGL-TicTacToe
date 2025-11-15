import { PlayerStats } from "@/interfaces/Player";
import { Session } from "@/interfaces/Session";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { getPlayer } from "@/utils/ApiHandler";
import { intInRoman } from "@/utils/utils";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    session: Session
}

export default function OnlineStats({ session }: Props) {
    const [stats, setStats] = useState<PlayerStats|null>(null);

    useEffect(() => {
        if (!session.deviceId) {
            return;
        } 
        getPlayer(session.deviceId).then((playerStats) => setStats(playerStats));
    }, [])

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