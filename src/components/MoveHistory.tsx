import { GlobalStyles } from "@/styles/GlobalStyles";
import { intInRoman } from "@/utils/utils";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "./Button";

type Props = {
    history: Array<String[]>
    jumpTo: (moveIndex: number) => void;
}

export default function MoveHistory({history, jumpTo}: Props) {
    const moves = history.map((_, index) => {
        let description = index > 0 ? "Go to move " + intInRoman(index) : "Game starts";
        return (
            <Button 
            key={index}
            index={index} 
            description={description} 
            onPress={() => jumpTo(index)} 
            buttonStyle={styles.button} 
            labelStyle={styles.buttonLabel}/>
        )
    })

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[GlobalStyles.font]}>Moves</Text>  
            </View>
            <ScrollView style={styles.scroll}>{moves}</ScrollView>
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
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    scroll: {
        flex: 1,
        marginTop: 10
    },
    button: {
        margin: 5
    },
    buttonLabel: {
        textAlign: "left"
    }
})