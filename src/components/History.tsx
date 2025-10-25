import { StyleSheet, Text, View } from "react-native";
import HistoryButton from "./HistoryButton";

type Props = {
    history: Array<String[]>
    jumpTo: (moveIndex: number) => void;
}

export default function History({history, jumpTo}: Props) {
    function intInRoman(num: number): string {
        const values = [
            1000, 900, 500, 400,
            100, 90, 50, 40,
            10, 9, 5, 4, 1
        ];
        const symbols = [
            "M", "CM", "D", "CD",
            "C", "XC", "L", "XL",
            "X", "IX", "V", "IV", "I"
        ]
        let result = ""
        for (let index = 0; index < values.length; index++) {
            const count = Math.floor(num / values[index]);
            result += symbols[index].repeat(count);
            num -= values[index] * count;
        }
        return result;
    }

    const moves = history.map((_, index) => {
        let description = index > 0 ? "Go to move " + intInRoman(index) : "Go to game start";
        return (
            <HistoryButton index={index} description={description} jumpTo={jumpTo}/>
        )
    })

    return (
        <View>
            <Text style={styles.title}>History</Text>
            {moves}
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "right",
        fontFamily: "Handodle",
        textDecorationLine: "underline",
        color: "#fff"
    }
})