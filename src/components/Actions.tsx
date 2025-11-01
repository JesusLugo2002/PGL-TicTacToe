import { StyleSheet, View } from "react-native";
import Button from "./Button";

type Props = {
    onReset: (goingToMenu: boolean) => void;
}

export default function Actions({onReset}: Props) {
    return (
        <View style={styles.container}>
            <Button description="Reset" onPress={() => onReset(false)}/>
            <Button description="Leave" onPress={() => onReset(true)}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around"
    }
});