import { Winner } from "@/containers/BoardContainer";
import { generateEmptyGrid } from "@/utils/utils";
import { StyleSheet, Text, View } from "react-native";
import Button from "./Button";
import Square from "./Square";

type Props = {
    squares: Array<string>
    onHandleClick: (index: number) => void;
    winner: Winner|null
    nextPlayer: string
    boardCols: number
    onReset: () => void;
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

export default function Board({squares, onHandleClick, winner, nextPlayer, boardCols, onReset}: Props) {
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

    function getBordersByPosition(row: number, col: number, boardCols: number) {
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


    const getStatus = () => {
        return winner ? `Player ${winner.symbol} wins` : ` Is ${nextPlayer} turn...`
    }

    return (
        <View>
            <View>
                <Text style={styles.title}>TicTacToe</Text>
            </View>
            {grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((square: SquareObject) => (
                        <Square value={squares[square.index]} 
                        handleClick={() => onHandleClick(square.index)} 
                        borderStyle={square.borderStyle}
                        isWinner={winner?.line.includes(square.index)}/>
                    ))}
                </View>
            ))}
            <View>
                <Text style={styles.status}>{getStatus()}</Text>
            </View>
            <View style={styles.resetButtonContainer}>
                <Button description="Leave game" onPress={() => onReset()} textAlign={{textAlign: "center"}}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
    },
    title: {
        textAlign: "center",
        fontFamily: "Handodle",
        fontSize: 64,
        letterSpacing: 2,
        marginBottom: 20,
        color: "#fff"
    },
    status: {
        fontFamily: "Handodle",
        textAlign: "center",
        fontSize: 32,
        marginTop: 20,  
        color: "#fff"
    },
    resetButtonContainer: {
        marginTop: 20,
        textAlign: "center"
    }
})