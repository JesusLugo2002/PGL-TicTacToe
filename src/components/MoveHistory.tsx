import { intInRoman } from "@/utils/utils";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "./Button";
import { GlobalStyles } from "@/styles/GlobalStyles";

type Props = {
    history: Array<String[]>
    jumpTo: (moveIndex: number) => void;
}

export default function MoveHistory({history, jumpTo}: Props) {
    const moves = history.map((_, index) => {
        let description = index > 0 ? "Go to move " + intInRoman(index) : "Go to game start";
        return (
            <Button index={index} description={description} onPress={() => jumpTo(index)}/>
        )
    })

    return (
        <View style={styles.container}>
            <Text style={[GlobalStyles.font]}>History</Text>   
            <ScrollView>{moves}</ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        width: "100%",
        backgroundColor: "#0000003d",
    },
})