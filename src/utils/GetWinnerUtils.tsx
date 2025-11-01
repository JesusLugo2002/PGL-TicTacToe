import { generateEmptyGrid } from "./utils";

function getHorizontalLines(boardCols: number) {
    let result = generateEmptyGrid(boardCols);
    result.forEach((row, rowIndex) => {
        result[rowIndex] = row.map((_, colIndex) => {
            return colIndex + rowIndex * boardCols;
        })
    })
    return result;
}

function getVerticalLines(boardCols: number) {
    let result = generateEmptyGrid(boardCols);
    result.forEach((row, rowIndex) => {
        result[rowIndex] = row.map((_, colIndex) => {
            return rowIndex + colIndex * boardCols;
        })
    })
    return result;
}

function getDiagonalLines(boardCols: number) {
    let result = Array(2).fill(Array(boardCols).fill(null));
    result.forEach((diagonal, diagonalIndex) => {
        result[diagonalIndex] = diagonal.map((_: any, rowIndex: number) => {
            if (diagonalIndex == 0) {
                return boardCols * rowIndex + rowIndex;
            } 
            return (rowIndex + 1) * (boardCols - 1) 
        })
    })
    return result;
}

export function getCombinationsLine(boardCols: number) {
    return [...getHorizontalLines(boardCols), ...getVerticalLines(boardCols), ...getDiagonalLines(boardCols)];
}
