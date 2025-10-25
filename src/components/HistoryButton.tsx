import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
    index: number;
    description: string;
    jumpTo: (index: number) => void;
}

export default function HistoryButton({index, description, jumpTo}: Props) {
    const [hovered, setHovered] = useState(false);

    return (
        <Pressable style={styles.button} key={index} onPress={() => jumpTo(index)} onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}>
            <Text style={[styles.label, hovered && styles.hoveredLabel]}>{description}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        margin: 10
    },
    label: {
        fontSize: 24,
        letterSpacing: 0.5,
        borderRadius: 10,
        textAlign: "right",
        fontFamily: "Handodle",
        color: "#fff"
    },
    hoveredLabel: {
        textDecorationLine: "underline",
    }
})