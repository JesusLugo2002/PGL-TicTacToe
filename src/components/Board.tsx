import { GridSquares, Winner } from "@/containers/GameContainer";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { generateEmptyGrid } from "@/utils/utils";
import { StyleSheet, Text, View } from "react-native";
import Square from "./Square";

type Props = {
    squares: GridSquares
    onHandleClick: (index: number) => void;
    winner: Winner|null
    nextPlayer: string
    boardCols: number
    isTie: boolean
}

type BorderStyle = {
    borderTopColor: string
    borderRightColor: string 
    borderBottomColor: string
    borderLeftColor: string
}

type SquareObject = {
    index: number
    borderStyle: BorderStyle
}

export default function Board({squares, onHandleClick, winner, nextPlayer, boardCols, isTie}: Props) {

    /**
     * Genera un `BorderStyle` dependiendo de los bordes que se desean dibujar.
     * @param {boolean} top borde superior.
     * @param {boolean} right borde de la derecha.
     * @param {boolean} bottom borde inferior.
     * @param {boolean} left borde de la izquierda
     * @returns {BorderStyle} Si un borde se ha marcado como `true`, se devuelve en color blanco, si no, sera transparente.
     */
    function generateBorderStyle(top: boolean, right: boolean, bottom: boolean, left: boolean): BorderStyle {
        return {
            borderTopColor: top ? "#fff" : "transparent",
            borderRightColor: right ? "#fff" : "transparent",
            borderBottomColor: bottom ? "#fff" : "transparent",
            borderLeftColor: left ? "#fff" : "transparent",
        }
    }

    const topLeftSquare: BorderStyle = generateBorderStyle(false, true, true, false);
    const topSquare: BorderStyle = generateBorderStyle(false, true, true, true);
    const topRightSquare: BorderStyle = generateBorderStyle(false, false, true, true);
    const leftSquare: BorderStyle = generateBorderStyle(true, true, true, false);
    const middleSquare: BorderStyle = generateBorderStyle(true, true, true, true);
    const rightSquare: BorderStyle = generateBorderStyle(true, false, true, true);
    const bottomLeftSquare: BorderStyle = generateBorderStyle(true, true, false, false);
    const bottomSquare: BorderStyle = generateBorderStyle(true, true, false, true);
    const bottomRightSquare: BorderStyle = generateBorderStyle(true, false, false, true);

    /**
     * Devuelve el borde predefinido dependiendo de la posicion en fila y columna, tomando
     * en cuenta el numero de las mismas.
     * @param {number} row indice de la fila
     * @param {number} col indice de la columna
     * @param {number} boardCols numero de filas/columnas
     * @returns {BorderStyle} el borde predefinido segun la posicion del cuadrado en el grid.
     */
    function getBordersByPosition(row: number, col: number, boardCols: number): BorderStyle {
        const lastIndex = boardCols - 1;
        if (row == 0) {
            if (col == 0) {
                return topLeftSquare;
            }
            if (col == lastIndex) {
                return topRightSquare;
            }
            return topSquare;
        }
        if (row == lastIndex) {
            if (col == 0) {
                return bottomLeftSquare;
            }
            if (col == lastIndex) {
                return bottomRightSquare;
            }
            return bottomSquare;
        }
        if (col == 0) {
            return leftSquare;
        }
        if (col == lastIndex) {
            return rightSquare;
        }
        return middleSquare
    }

    const grid = generateEmptyGrid(boardCols);
    grid.forEach((row: Array<any>, rowIndex) => {
        grid[rowIndex] = row.map((col, colIndex) => {
            return {index: colIndex + boardCols * rowIndex, borderStyle: getBordersByPosition(rowIndex, colIndex, boardCols)}
        })
    });

    /**
     * Devuelve el mensaje de estado dependiendo de si la partida esta en curso,
     * si existe una victoria o si se encuentra en empate.
     * @returns {string} el mensaje de estado.
     */
    function getStatus(): string {
        if (isTie) {
            return "Tie"
        }
        return winner ? `Player ${winner.symbol} wins` : ` Is ${nextPlayer} turn...`
    }

    return (
        <View>
            {grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((square: SquareObject) => (
                        <Square 
                        key={square.index}
                        value={squares[square.index]} 
                        handleClick={() => onHandleClick(square.index)} 
                        borderStyle={square.borderStyle}
                        isWinner={winner?.line.includes(square.index)}
                        boardCols={boardCols}/>
                    ))}
                </View>
            ))}
            <Text style={[GlobalStyles.font, styles.status]}>{getStatus()}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    board: {
        flexGrow: 1,
        justifyContent: "center"
    },
    row: {
        flexDirection: "row",
    },
    status: {
        textAlign: "center",
        fontSize: 32,
        marginTop: 20,  
    }
})