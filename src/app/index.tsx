import SessionContainer from "@/containers/SessionContainer";
import { useFonts } from "expo-font";
import { ImageBackground, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loaded, error] = useFonts({
    Handodle: require("../assets/fonts/Handodle.ttf"),
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require("../assets/images/background.jpg")}
          style={styles.background}
          resizeMode="repeat"
        >
          <SessionContainer/>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
});
