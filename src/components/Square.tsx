import { GlobalStyles } from "@/styles/GlobalStyles";
import { getRandomNumber } from "@/utils/utils";
import { Dimensions, Pressable, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";

type Props = {
    value: String
    handleClick: () => void
    borderStyle: ViewStyle
    isWinner?: boolean
    boardCols: number
}

export default function Square({value, handleClick, borderStyle, isWinner, boardCols}: Props) {
    function getResponsiveSize(percentage: number = 35): number {
        const screenHeight = Dimensions.get("screen").height;
        return (screenHeight * (percentage / 100)) / boardCols;
    }
    const responsiveSize = getResponsiveSize();
    const maxFontSize = responsiveSize;
    const minFontSize = responsiveSize - 10;
    
    const squareSize: ViewStyle = { width: responsiveSize, height: responsiveSize };
    const randomFontSize: TextStyle = {
        fontSize: getRandomNumber(minFontSize, maxFontSize),
    }
    
    return <Pressable style={[squareSize, borderStyle, styles.button]} onPress={handleClick}>
        <Text style={[GlobalStyles.font, randomFontSize, isWinner && styles.winnerSymbol]}>{value}</Text>
    </Pressable>
}

const styles = StyleSheet.create({
    button: {
        borderBlockColor: "#fff",
        borderWidth: 1,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    winnerSymbol: {
        color: "rgba(20, 214, 26, 1)"
    }
})