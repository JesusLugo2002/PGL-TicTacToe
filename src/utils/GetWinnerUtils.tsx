import { generateEmptyGrid } from "./utils";

type Combination = Array<number>

/**
 * Devuelve las posibles combinaciones horizontales de victorias,
 * tomando en cuenta el numero de filas/columnas del grid.
 * @param {number} boardCols numero de filas/columnas.
 * @returns {Array<Combination>} un array que contiene las combinaciones.
 */
function getHorizontalLines(boardCols: number): Array<Combination> {
    let result: Array<Array<number>> = generateEmptyGrid(boardCols);
    result.forEach((row, rowIndex) => {
        result[rowIndex] = row.map((_, colIndex) => {
            return colIndex + rowIndex * boardCols;
        })
    })
    return result;
}

/**
 * Devuelve las posibles combinaciones verticales de victorias,
 * tomando en cuenta el numero de filas/columnas del grid.
 * @param {number} boardCols numero de filas/columnas.
 * @returns {Array<Combination>} un array que contiene las combinaciones.
 */
function getVerticalLines(boardCols: number): Array<Combination> {
    let result = generateEmptyGrid(boardCols);
    result.forEach((row, rowIndex) => {
        result[rowIndex] = row.map((_, colIndex) => {
            return rowIndex + colIndex * boardCols;
        })
    })
    return result;
}

/**
 * Devuelve las posibles combinaciones diagonales de victorias,
 * tomando en cuenta el numero de filas/columnas del grid.
 * @param {number} boardCols numero de filas/columnas.
 * @returns {Array<Combination>} un array que contiene las combinaciones.
 */
function getDiagonalLines(boardCols: number): Array<Combination> {
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


/**
 * Devuelve una lista con todas las combinaciones de indices que indican
 * posibles victorias, en horizontal, vertical y diagonal, tomando en cuenta
 * el numero de filas/columnas del grid.
 * @param {number} boardCols numero de filas/columnas del grid
 * @returns {Array<Combination>} un array con todas las combinaciones posibles.
 */
export function getCombinationsLine(boardCols: number): Array<Combination> {
    return [...getHorizontalLines(boardCols), ...getVerticalLines(boardCols), ...getDiagonalLines(boardCols)];
}
