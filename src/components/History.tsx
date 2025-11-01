import { intInRoman } from "@/utils/utils";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "./Button";

type Props = {
    history: Array<String[]>
    jumpTo: (moveIndex: number) => void;
}

export default function History({history, jumpTo}: Props) {
    const moves = history.map((_, index) => {
        let description = index > 0 ? "Go to move " + intInRoman(index) : "Go to game start";
        return (
            <Button index={index} description={description} onPress={() => jumpTo(index)}/>
        )
    })

    return (
        <View style={styles.container}>
            <Text style={styles.title}>History</Text>   
            <ScrollView style={styles.scroll}>
                {moves}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        maxHeight: "50%"
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "right",
        fontFamily: "Handodle",
        textDecorationLine: "underline",
        color: "#fff"
    },
    scroll: {
        paddingRight: 20,
        marginTop: 20
    }
})