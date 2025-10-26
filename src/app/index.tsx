import GameContainer from '@/containers/GameContainer';
import { useFonts } from 'expo-font';
import { ImageBackground, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const [loaded, error] = useFonts({
    'Handodle': require('../assets/fonts/Handodle.ttf')
  });
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require("../assets/images/background.jpg")} style={styles.background} resizeMode='repeat'>
          <GameContainer/>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    height: "100%"
  },  
  container: {
    flex: 1,
  }
})
