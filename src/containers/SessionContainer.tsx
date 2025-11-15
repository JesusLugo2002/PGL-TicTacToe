import SessionMenu from "@/components/SessionMenu";
import { Session, SessionType } from "@/interfaces/Session";
import { registerPlayerDevice } from "@/utils/ApiHandler";
import { Suspense, useState } from "react";
import { Text } from "react-native";
import GameContainer from "./GameContainer";


export default function SessionContainer() {
    const [session, setSession] = useState<Session|null>(null);
    
    async function setupSession(sessionType: SessionType, playerName: string): Promise<void> {
        let deviceId = undefined;
        if (sessionType == SessionType.ONLINE) {
            const response = await registerPlayerDevice(playerName);
            deviceId = response.device_id;
        }
        const sessionData: Session = {
            isOnline: sessionType,
            playerName: playerName,
            deviceId: deviceId
        }
        setSession(sessionData);
    }

    function logout() {
        setSession(null);
    }
    
    if (!session) {
        return <Suspense fallback={<Text>Loading session menu...</Text>}>
            <SessionMenu setSession={setupSession}/>
        </Suspense>
    }
    return <Suspense>
        <GameContainer session={session} logout={logout}/>
    </Suspense>
    
}