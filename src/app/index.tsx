import Square from "@/components/Square";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View>
      <Text>Hello world!</Text>
      <Square value={"A"} onSquareClick={() => alert("A")}></Square>
    </View>
  );
}
