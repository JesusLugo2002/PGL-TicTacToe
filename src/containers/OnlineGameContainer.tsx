import Button from "@/components/Button";
import Menu from "@/components/Menu";
import OnlineStats from "@/components/OnlineStats";
import Title from "@/components/Title";
import { GridSquares } from "@/interfaces/Board";
import { MatchCallback, MatchStatus } from "@/interfaces/Match";
import { PlayerMatchStatus, PlayerSymbol, Winner } from "@/interfaces/Player";
import { Session } from "@/interfaces/Session";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { createMatch, getMatch, getPlayerStatus, makeMove } from "@/utils/ApiHandler";
import { getCombinationsLine } from "@/utils/GetWinnerUtils";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import BoardContainer from "./BoardContainer";

type Props = {
    session: Session
    logout: () => void
}

export default function OnlineGameContainer({ session, logout }: Props) {
    const [inGame, setInGame] = useState(false);
    const [boardCols, setBoardCols] = useState(3);
    const [playerOnlineStatus, setPlayerOnlineStatus] = useState<PlayerMatchStatus|null>(null);
    const [matchData, setMatchData] = useState<MatchStatus|null>(null)
    const [currentMatch, setCurrentMatch] = useState<MatchCallback|null>(null)
    const [winner, setWinner] = useState<Winner|null>(null);
    const [tie, setTie] = useState(false);


    /**
     * Polling para la busqueda de match. Cada segundo, (tiempo determinado en `TIME_IN_MS`),
     * se obtiene el estado del jugador del servidor y, si se determina que hay un match
     * para una partida con la configuracion deseada, se establece como estado actual. Solo se
     * activa cuando el jugador esta en una lista de espera para partida.
     */
    function searchMatchPolling() {
        const TIME_IN_MS = 1000;
        if (!session.isOnline || playerOnlineStatus?.status != "waiting") {
            return;
        }
        const intervalId = setInterval(async () => {
            if (!session.deviceId) {
                return;
            }
            setPlayerOnlineStatus(await getPlayerStatus(session.deviceId))
        }, TIME_IN_MS);           
        return intervalId
    }

    useEffect(() => {
        const searchPollingId = searchMatchPolling()
        return () => {
            clearInterval(searchPollingId)
        }
    }, [playerOnlineStatus?.status]);

    /**
     * Polling que actualiza el tablero con el guardado en servidor. Cada 2 segundos, (tiempo
     * determinado en `TIME_IN_MS`), se obtiene el estado del match y se actualiza el tablero con 
     * el guardado en servidor.
     */
    function updateBoardPolling() {
        const TIME_IN_MS = 2000;
        if (!session.isOnline || !playerOnlineStatus?.match_id) {
            return;
        }
        const intervalId = setInterval(async () => {
            if (!playerOnlineStatus.match_id) {
                return;
            }
            const match = await getMatch(playerOnlineStatus.match_id)
            setMatchData(match);
            setCurrentMatch({ board: match.board, next_turn: match.turn, winner: match.winner })
        }, TIME_IN_MS);
        return intervalId
    }

    useEffect(() => {
        const updatePollingId = updateBoardPolling()
        return () => {
            clearInterval(updatePollingId)
        }
    }, [playerOnlineStatus?.match_id])

    /**
     * Gestiona el inicio de una partida configurando el tamaño del grid.
     * @param {number} boardCols numero de filas/columnas del grid.
     */
    async function handleStartGame(boardCols: number): Promise<void> {
        if (!session.deviceId) {
            console.error("Device ID not found in the current session")
            return;
        }
        await createMatch(session.deviceId, boardCols);
        setPlayerOnlineStatus(await getPlayerStatus(session.deviceId))
        setBoardCols(boardCols);
        setInGame(true);
    }

    function showPlayerWaitingStatus() {
        switch (playerOnlineStatus?.status) {
            case "idle":
                return <Text style={GlobalStyles.font}>Player is in Idle status</Text>
            case "waiting":
                return <Text style={GlobalStyles.font}>Player waiting for match...</Text>
            case "matched":
                return <Text style={GlobalStyles.font}>Match found.</Text>
            default:
                return <></>
        }
    }

    function indexToXY(index: number) {
        const x = index % boardCols;
        const y = Math.floor(index / boardCols);
        return { x, y };
    }

    async function handlePlay(index: number) {
        if (!playerOnlineStatus?.match_id || !session.deviceId) {
            return;
        }
        const coordinates = indexToXY(index);
        const newMatch = await makeMove(playerOnlineStatus?.match_id, session.deviceId, coordinates.x, coordinates.y)
        setCurrentMatch(newMatch)
    }

    function updateBoardContainer() {
        if (!matchData || !currentMatch) {
            return;
        }
        const xIsNext = matchData.players[currentMatch.next_turn] == "X";
        const squares = currentMatch.board;
        return <BoardContainer xIsNext={xIsNext} squares={squares} boardCols={boardCols} winner={winner} isTie={tie} checkWinner={checkWinner} onRemotePlay={handlePlay}  />
    }

    /**
     * Comprueba si el juego ha sido ganado mirando las combinaciones posibles y chequeando
     * que se cumpla alguna, otorgando la victoria al jugador que lo logre.
     * @param {GridSquares} nextSquares el grid actual para comprobar.
     * @returns {boolean} `true` si se ha encontrado un ganador, `false` si no o si hay empate.
     */
    function checkWinner(nextSquares: GridSquares): boolean {
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
                return true;
            }
        }
        setTie(nextSquares.every(value => value != null));
        setWinner(null);
        return false;
    }
    
    return (
        <View style={styles.container}>
            <Title/>
            <OnlineStats session={session}/>
            <View style={styles.container}>
                {!inGame ? (
                    <>
                        <Menu startGame={handleStartGame} />
                        <View style={styles.bottomBar}>
                            <Button description="Logout" onPress={() => logout()} />
                        </View>                     
                    </>
                ) : (
                    playerOnlineStatus?.match_id ? (
                        updateBoardContainer()
                    ) : (
                        showPlayerWaitingStatus()
                    )
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        gap: 10,
        justifyContent: "space-between",
        paddingBottom: 10
    },
    bottomBar: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-evenly"
    }
})