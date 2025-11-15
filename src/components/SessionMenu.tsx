import { SessionType } from "@/interfaces/Session";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "./Button";
import Title from "./Title";

type Props = {
    setSession: (sessionType: SessionType, playerName: string) => void
}

export default function SessionMenu({ setSession }: Props) {
    const [playerName, setPlayerName] = useState("Guest");

    return (
        <View style={styles.container}>
            <Title />
            <Text style={GlobalStyles.font}>Write your name, player...</Text>
            <TextInput value={playerName} onChangeText={setPlayerName} style={[GlobalStyles.font, styles.playerNameInput]}/>
            <Button description="Play offline" onPress={() => setSession(SessionType.OFFLINE, playerName)}/>
            <Button description="Play online" onPress={() => setSession(SessionType.ONLINE, playerName)}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center"
    },
    playerNameInput: {
        alignSelf: "center",
        width: "25%",
        backgroundColor: "#0000005b",
        borderColor: "#fff",
        borderWidth: 1,
        textAlign: "center",
        marginBottom: 20,
        textDecorationLine: "underline"
    }
})