export enum SessionType {
    OFFLINE, ONLINE
}

export type Session = {
  isOnline: SessionType
  playerName: string
  deviceId?: string
}

