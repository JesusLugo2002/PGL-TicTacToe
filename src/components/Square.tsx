import { Pressable, StyleSheet } from "react-native";

type Props = {
    value: String
    handleClick: () => void
    borderStyle: Object
}

export default function Square({value, handleClick, borderStyle}: Props) {
    const borderStyleSheet = StyleSheet.create({borders: borderStyle})
    return <Pressable style={[styles.button, borderStyleSheet.borders]} onPress={handleClick}>{value}</Pressable>
}

const styles = StyleSheet.create({
    button: {
        width: 64,
        height: 64,
        borderBlockColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        fontSize: 32,
    }
})