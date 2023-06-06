import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity,TextInput } from 'react-native';
import { theme } from './color';
import { SetStateAction, useState } from 'react';

export default function App() {
  const [working, setWorking] = useState(true)
  const [text, setText] = useState("")
  const onPressLife = () => setWorking(false)
  const onPressWork = () => setWorking(true) 
  const onChangeText = (payload: SetStateAction<string>) => setText(payload)

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onPressWork}>
        <Text style={{...styles.btnText, color: working ? "white": theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressLife}>
        <Text style={{...styles.btnText, color: working ? theme.grey : "white"}}>Life</Text>
        </TouchableOpacity>
      </View>
        <TextInput onChangeText={onChangeText} value={text} returnKeyType="send" placeholder={"Add a Todo"} style={styles.input}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  theme.background,
    paddingHorizontal: 20
  },
  header: {
    justifyContent: "space-between",
    flexDirection: 'row',
    marginTop: 100,
  },
  btnText: {
    fontSize: 35,
    fontWeight: "600"
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15, 
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 16
  }
})
