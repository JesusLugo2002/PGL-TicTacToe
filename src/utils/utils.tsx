export function generateEmptyGrid(boardCols: number): Array<Array<any>> {
    return Array(boardCols).fill(Array(boardCols).fill(null));
}

export function intInRoman(num: number): string {
    const values = [
        1000, 900, 500, 400,
        100, 90, 50, 40,
        10, 9, 5, 4, 1
    ];
    const symbols = [
        "M", "CM", "D", "CD",
        "C", "XC", "L", "XL",
        "X", "IX", "V", "IV", "I"
    ]
    let result = ""
    for (let index = 0; index < values.length; index++) {
        const count = Math.floor(num / values[index]);
        result += symbols[index].repeat(count);
        num -= values[index] * count;
    }
    return result;
}

export function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (min - max + 1)) + min;
}