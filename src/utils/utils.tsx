export function generateEmptyGrid(boardCols: number): Array<Array<any>> {
    return Array(boardCols).fill(Array(boardCols).fill(null));
}