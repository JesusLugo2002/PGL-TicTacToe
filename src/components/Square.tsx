import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";

type Props = {
    value: String
    handleClick: () => void
    borderStyle: ViewStyle
}

export default function Square({value, handleClick, borderStyle}: Props) {
    const maxFontSize = 50;
    const minFontSize = 30;

    const getRandomNumber = (min: number, max: number) => {
        return Math.floor(Math.random() * (maxFontSize - minFontSize + 1)) + minFontSize
    }

    const randomFontStyle: TextStyle = {
        fontFamily: "Handodle",
        color: "#fff",
        fontSize: getRandomNumber(minFontSize, maxFontSize),
    }
    
    return <Pressable style={[borderStyle, styles.button]} onPress={handleClick}>
        <Text style={randomFontStyle}>{value}</Text>
    </Pressable>
}

const styles = StyleSheet.create({
    button: {
        width: 56,
        height: 56,
        borderBlockColor: "#fff",
        borderWidth: 1,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        color: "#fff"
    }
})