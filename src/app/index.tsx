import GameContainer from '@/containers/GameContainer';
import { useFonts } from 'expo-font';
import { ImageBackground, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { registerPlayerDevice } from '@/utils/ApiHandler';
import { useEffect } from 'react';

export default function Index() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loaded, error] = useFonts({
    'Handodle': require('../assets/fonts/Handodle.ttf')
  });

  useEffect(() => {
    registerPlayerDevice("Pepito").then((value) => console.log(value));
  }, [])
  
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
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  }
})
