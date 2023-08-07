import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity,TextInput, ScrollView, Alert } from 'react-native';
import { theme } from './color';
import { SetStateAction, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const STORAGE_KEY = '@toDos'
type ToDo = {
  text: string
  working: boolean
  completed: boolean
}
const MENU_KEY = '@menu'
    
type M = string | number
export default function App() {
  const [working, setWorking] = useState(true)
  const [text, setText] = useState("")
  const [toDos, setTodos] = useState<{ [key: string]: ToDo} | undefined>(undefined)
  const [completed, setCompleted] = useState(false)

  const onPressLife = () => {
    saveToMenu(false)
    setWorking(false)
  }

  const onPressWork = () => {
    saveToMenu(true)
    setWorking(true)
  }

  const onChangeText = (payload: SetStateAction<string>) => setText(payload)

  const saveToDos = async (toSave: any) => {
    try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch(error) {
      console.error('save error', error)
    }
  }

  const saveToMenu = async(workingValue:boolean) => {
 try {
    await AsyncStorage.setItem(MENU_KEY, JSON.stringify(workingValue))
    } catch(error) {
      console.error('save menu error', error)
    }
  }

  const loadToDos = async () => {
   try {
    const data: any  =  await AsyncStorage.getItem(STORAGE_KEY)
    setTodos(JSON.parse(data))
   } catch(error) {
    console.error('load error', error)
    }
  }

  const loadMenu = async () => {
    try {
     const menu:any = await AsyncStorage.getItem(MENU_KEY)
     setWorking(JSON.parse(menu))
    } catch(error) {
      console.error('load menu error', error)
    }
  }


  const addTodo = async () => {
    if(text === '') return
    const newTodos = {...toDos, [Date.now()]: {text, working, completed: false} }
    setTodos(newTodos) 
    await saveToDos(newTodos)
    setText('')
  }

  const deleteTodo = (id:string) => {
    Alert.alert("Delte To Do", "Are your sure?", [
      { text: 'Cancel' },
      {
        text: 'Okay',
        style: "destructive",
        onPress: async () => {
        const newTodos = {
          ...toDos,
        }
        delete newTodos[id]
        setTodos(newTodos)
        await saveToDos(newTodos)
      }}
    ])
  } 

  const completeTodo = async(id: string, isChecked: boolean) => {
    setCompleted(isChecked)
    if (!toDos) return
    const newTodos = {
      ...toDos,
    }
    if (id && newTodos.hasOwnProperty(id)) {
      newTodos[id] = { ...toDos[id], completed: isChecked };
    }
    setTodos(newTodos) 
    await saveToDos(newTodos)
  }

  useEffect(() => {
    loadToDos()
    loadMenu()
  },[])

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
        <TextInput onSubmitEditing={addTodo} onChangeText={onChangeText} value={text} returnKeyType="done"  placeholder={"Add a Todo"} style={styles.input}/>
        <ScrollView>{ toDos && Object.keys(toDos).map(key => 
        toDos[key].working === working ? (
          <View style={styles.toDo} key={key}>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
            <View  style={styles.toDoActions} key={key}>
            <BouncyCheckbox size={20} onPress={() => completeTodo(key, !toDos[key].completed)} isChecked={toDos[key].completed} />
           <TouchableOpacity onPress={() => deleteTodo(key)}>
           <Feather name="trash-2" size={20} color="white" />
            </TouchableOpacity>
            </View>
          </View>) : null
        )}</ScrollView>
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
    marginVertical: 20,
    fontSize: 16
  },
  toDo: {
    backgroundColor: theme.toDoBackground,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: "row",
    alignItem: "center",
    justifyContent: "space-between"
  },
  toDoActions: {
    flexDirection: "row",
    alignItem: "center",
    justifyContent: "flex-end"
  },
  toDoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: "500"
  }
})
