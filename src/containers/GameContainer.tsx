import Actions from "@/components/Actions";
import GameHistory from "@/components/GameHistory";
import Menu from "@/components/Menu";
import MoveHistory from "@/components/MoveHistory";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { getCombinationsLine } from "@/utils/GetWinnerUtils";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import BoardContainer from "./BoardContainer";

export type PlayerSymbol = "X" | "O"

export type Winner = {
    symbol: PlayerSymbol
    line: Array<number>
}

export default function GameContainer() {
    const INITIAL_GAME_HISTORY: Record<PlayerSymbol, number> = {"X": 0, "O": 0};

    const [inGame, setInGame] = useState(false);
    const [boardCols, setBoardCols] = useState(3);
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState<Winner|null>(null);
    const [tie, setTie] = useState(false);
    const [moveHistory, setMoveHistory] = useState(generateInitialHistory());
    const [gameHistory, setGameHistory] = useState<Record<PlayerSymbol, number>>(INITIAL_GAME_HISTORY);
    const [currentMove, setCurrentMove] = useState(0);

    let currentSquares = moveHistory[currentMove];

    function generateInitialHistory() {
        return [Array(boardCols * boardCols).fill(null)];
    }

    function resetGame(goingToMenu: boolean): void {
        if (goingToMenu) {
            setInGame(false);
        }
        setMoveHistory(generateInitialHistory());
        setCurrentMove(0);
        currentSquares = moveHistory[currentMove];
        setXIsNext(winner == null ? !xIsNext : xIsNext);
        if (winner == null && !tie) {
            giveVictory(xIsNext ? "O" : "X");
        }
        setWinner(null)
        setTie(false);
    }

    function handlePlay(nextSquares: Array<string>): void {
        const nextHistory = [...moveHistory.slice(0, currentMove + 1), nextSquares];
        setMoveHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setXIsNext(!xIsNext);
    }
    
    function handleStartGame(boardCols: number): void {
        setBoardCols(boardCols);
        setInGame(true);
    }

    function jumpToMove(nextMove: number) {
        setCurrentMove(nextMove);
        setXIsNext(nextMove % 2 === 0);
    }

    function giveVictory(symbol: PlayerSymbol): void {
        const newScore = gameHistory[symbol] + 1;
        gameHistory[symbol] = newScore;
        setGameHistory(gameHistory);
    } 

    function resetGameHistory(): void {
        setGameHistory(INITIAL_GAME_HISTORY);
    }

    function checkWinner(nextSquares: Array<string>): boolean {
        const lines = getCombinationsLine(boardCols);
        for (let i = 0; i < lines.length; i++) {
            const currentLine = lines[i];
            const firstLineIndex = currentLine[0];
            const firstSym = nextSquares[firstLineIndex];
            if (!firstSym) {
                continue;
            }
            const matches = currentLine.map((index: number) => {
                return nextSquares[index] === firstSym;
            })
            if (matches.every((match: boolean) => match)) {
                setWinner({symbol: firstSym as PlayerSymbol, line: currentLine});
                giveVictory(firstSym as PlayerSymbol);
                return true;
            }
        }
        setTie(nextSquares.every(value => value != null));
        setWinner(null);
        return false;
    }

    return inGame ? (
        <View style={styles.container}>
            <Text style={[GlobalStyles.font, styles.title]}>TicTacToe</Text>
            <GameHistory history={gameHistory}/>
            <BoardContainer xIsNext={xIsNext} 
            winner={winner}
            isTie={tie}
            checkWinner={checkWinner}
            squares={currentSquares} 
            onPlay={handlePlay} 
            giveVictory={giveVictory}
            boardCols={boardCols}/>
            <Actions onReset={resetGame}/>
            <MoveHistory history={moveHistory} jumpTo={jumpToMove} resetGameHistory={resetGameHistory}/>
        </View>
    ) : (
        <Menu startGame={handleStartGame}/> 
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        gap: 10,
    },
    title: {
        textAlign: "center",
        fontSize: 64,
        letterSpacing: 2,
    },
})