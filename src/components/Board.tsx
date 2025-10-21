import { View } from "react-native";

type Props = {
    xIsNext: boolean,
    onHandleClick: () => void;
}

export default function Board({
    onHandleClick
}: Props) {
    return (
        <View>
            <div className="status"></div>
            <div className="board-row">
                
            </div>
        </View>
    )
}