export type PlayerStats = {
  connected: boolean
  wins: number
  losses: number
  ratio: number
};

export type PlayerSymbol = "X" | "O"

export type Winner = {
    symbol: PlayerSymbol
    line: number[]
}