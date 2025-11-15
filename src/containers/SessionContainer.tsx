import SessionMenu from "@/components/SessionMenu";
import { Session, SessionType } from "@/interfaces/Session";
import { registerPlayerDevice } from "@/utils/ApiHandler";
import { Suspense, useState } from "react";
import { Text } from "react-native";
import OfflineGameContainer from "./OfflineGameContainer";
import OnlineGameContainer from "./OnlineGameContainer";


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
    if (session.isOnline) {
        return <Suspense>
            <OnlineGameContainer session={session} logout={logout}/>
        </Suspense>
    }
    return <OfflineGameContainer session={session} logout={logout}/>
}