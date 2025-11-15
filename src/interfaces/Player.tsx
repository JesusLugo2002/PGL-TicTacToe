export type PlayerStats = {
  connected: boolean
  wins: number
  losses: number
  ratio: number
};

export type PlayerMatchStatus = {
  status: "idle"|"waiting"|"matched"
  match_id?: string
  players?: any
  board_size?: any 
}

export type PlayerSymbol = "X" | "O"

export type Winner = {
  symbol: PlayerSymbol
  line: number[]
}