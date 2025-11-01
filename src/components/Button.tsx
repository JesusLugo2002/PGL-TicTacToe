import { GlobalStyles } from "@/styles/GlobalStyles";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextStyle } from "react-native";

type Props = {
    index?: number;
    description: string;
    onPress: () => void;
    textAlign?: TextStyle
}

export default function Button({index, description, onPress, textAlign}: Props) {
    const [hovered, setHovered] = useState(false);

    return (
        <Pressable style={[styles.button]} key={index} onPress={onPress} onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}>
            <Text style={[GlobalStyles.font, styles.label, textAlign ?? {textAlign: "center"}, hovered && styles.hoveredLabel]}>{description}</Text>
        </Pressable>
    )   
}

const styles = StyleSheet.create({
    button: {
        margin: 10
    },
    label: {
        letterSpacing: 0.5,
        borderRadius: 10,
        textDecorationLine: "underline"
    },
    hoveredLabel: {
        textDecorationLine: "none",
    }
})