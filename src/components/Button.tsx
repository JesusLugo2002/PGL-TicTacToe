import { GlobalStyles } from "@/styles/GlobalStyles";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";

type Props = {
    index?: number
    description: string
    onPress: () => void
    labelStyle?: TextStyle
    buttonStyle?: ViewStyle
}

export default function Button({index, description, onPress, labelStyle, buttonStyle}: Props) {
    const [hovered, setHovered] = useState(false);

    return (
        <Pressable style={buttonStyle && buttonStyle} key={index} onPress={onPress} onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}>
            <Text style={[GlobalStyles.font, styles.label, labelStyle && labelStyle, hovered && styles.hoveredLabel]}>{description}</Text>
        </Pressable>
    )   
}

const styles = StyleSheet.create({
    label: {
        letterSpacing: 0.5,
        borderRadius: 10,
        textDecorationLine: "underline",
        textAlign: "center"
    },
    hoveredLabel: {
        textDecorationLine: "none",
    }
})