import { Pressable, StyleSheet } from "react-native";

type Props = {
    value: String
    handleClick: () => void;
}

export default function Square({
    value,
    handleClick
}: Props) {
    return <Pressable style={styles.button} onPress={handleClick}>{value}</Pressable>
}

const styles = StyleSheet.create({
    button: {
        width: 64,
        height: 64,
        borderBlockColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
        borderRadius: 10,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        fontSize: 32,
    }
})