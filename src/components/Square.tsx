import { GlobalStyles } from "@/styles/GlobalStyles";
import { getRandomNumber } from "@/utils/utils";
import { Dimensions, Pressable, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";

type Props = {
    value: String|null
    handleClick: () => void
    borderStyle: ViewStyle
    isWinner?: boolean
    boardCols: number
}

export default function Square({value, handleClick, borderStyle, isWinner, boardCols}: Props) {

    /**
     * Devuelve un valor para asignar como tamaño del cuadrado, tomando en cuenta
     * un porcentaje determinado en `percentage` de la altura del dispositivo y
     * el numero de filas/columnas del grid para hacerlo responsivo.
     * @param {number} percentage porcentaje de la altura del dispositivo a tomar en cuenta.
     * @returns {number} valor determinado por la altura del dispositivo y el numero de filas/columnas.
     */
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