import { GridSquares } from "./Board"
import { PlayerSymbol } from "./Player"

type PlayersMap = Record<PlayerSymbol, string>

export type Match = {
    match_id: string
    players: PlayersMap
    board_size: number
}

export type MatchStatus = {
    board: GridSquares
    turn: PlayerSymbol
    winner: PlayerSymbol
    size: number
    players: PlayersMap
}

export type MatchCallback = {
    board: GridSquares
    next_turn: PlayerSymbol
    winner: string
}