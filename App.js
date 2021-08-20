import React, { useEffect, useState } from 'react';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    Modal,
    TouchableHighlight,
    TextInput,
    Alert,
} from 'react-native';
import {
    useFonts,
    Jost_400Regular,
    Jost_600SemiBold,
} from '@expo-google-fonts/jost';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

export default function App() {
    
    const image = require('./src/assets/bg.jpg');
    
    const [ tasks, setTasks ] = useState([]);
    
    const [ modalVisible, setModalVisible ] = useState(false);
    
    const [ currentTask, setCurrentTask ] = useState('');

    let [ fontsLoaded ] = useFonts({
        Jost_400Regular,
        Jost_600SemiBold,
    });

    useEffect(()=> {
        (async ()=> {
            try {
                let currentTasks = await AsyncStorage.getItem('tasks');
                if(currentTasks == null)
                    setTasks([]);
                else
                    setTasks(JSON.parse(currentTasks));
                } catch(error){}
        })();
    }, [])

    if(!fontsLoaded)
        return <AppLoading/>

    function deleteTask(id){
        let newTask = tasks.filter(function(val){
            return val.id != id;
        });

        setTasks(newTask);

        (async ()=> {
            try {
                await AsyncStorage.setItem('tasks', JSON.stringify(newTask));

            } catch(error){}
        })();
    }

    function handleDelete(id){
        Alert.alert("Deletar", 'Deseja mesmo deletar a tarefa?',[
            {
                text: 'Não',
                style: 'cancel',
            },
            {
                text: 'Sim',
                onPress: async ()=> {
                    try {
                        deleteTask(id);
                    } catch(error){
                        Alert.alert("Não foi possível deletar!");
                    }
                }
            }
        ])
    }

    function addTask() {

        if(!tasks)
            return Alert.alert('Por favor digite uma tarefa');

        setModalVisible(!modalVisible);

        let id = 0;
        if(tasks.length > 0){
            id = tasks[tasks.length-1].id + 1;
        }

        let task = {id:id, task:currentTask};

        setTasks([...tasks, task]);

        (async ()=> {
        
            try {
                await AsyncStorage.setItem('tasks', JSON.stringify([...tasks, task]));
            } catch(error){}
            
        })();
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <StatusBar hidden/>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setCurrentTask(text)}
                            placeholder="Nova Tarefa"
                        />

                        <View style={{flexDirection: 'row'}}>
                            <TouchableHighlight
                                style={styles.cancelButton}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableHighlight>

                            <TouchableHighlight
                                style={styles.saveButton}
                                onPress={() => addTask() }
                            >
                                <Text style={styles.saveText}>Adicionar</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>

            <ImageBackground source={image} style={styles.image}>
                <View style={styles.coverView}>
                <Text style={styles.textImage}>LISTA DE TAREFAS</Text>
                </View>
            </ImageBackground>

            {
                tasks.map(function(val) {
                    return(
                        <View style={styles.tarefaSingle} key={val.id} >

                            <View style={{flex:1, width: '100%'}}>
                                <Text style={{fontFamily: 'Jost_400Regular'}}>{val.task}</Text>
                            </View>

                            <View style={{alignItems: 'flex-end', flex: 1}} >

                                <TouchableOpacity
                                    onPress={()=>
                                        handleDelete(val.id)
                                    }
                                >
                                    <AntDesign
                                        name='delete'
                                        size={20}
                                        color='#E83F5B'
                                    />
                                </TouchableOpacity>
                            </View>

                        </View>
                    );
                })
            }

            <TouchableOpacity
                onPress={()=>
                    setModalVisible(true)}
                style={styles.buttonAddTarefa}
            >
                <Text style={{textAlign: 'center',color:'white', fontFamily: 'Jost_400Regular', fontSize: 25}}>+</Text>
            </TouchableOpacity>
        
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 110,
        resizeMode: 'cover',
    },
    input: {
        borderBottomWidth: 1,
        width: '100%',
        fontSize: 18,
        marginBottom: 10,
        padding: 5,
        fontFamily: 'Jost_400Regular',
        textAlign: 'center',
    },
    buttonAddTarefa: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3D7199',
        marginTop: 20,
        alignSelf: 'flex-end',
        marginRight: 20,
        borderRadius: 25,
    },
    coverView: {
        width: '100%',
        height: 110,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
    },
    textImage: {
        textAlign: 'center',
        color: '#FFFF',
        fontSize: 20,
        fontFamily: 'Jost_600SemiBold',
    },
    tarefaSingle: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        flexDirection: 'row',
        padding: 15
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        elevation: 5,
        zIndex: 5,
        width: 250,
        height: 150,
    },
    cancelButton: {
        backgroundColor: '#F0F0F0',
        width: 96,
        height: 48,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        marginLeft: 5,
    },
    cancelText: {
        fontFamily: 'Jost_400Regular',
        fontSize: 15,
    },
    saveButton: {
        backgroundColor: '#F0F0F0',
        width: 96,
        height: 48,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        marginLeft: 5,
    },
    saveText: {
        fontFamily: 'Jost_400Regular',
        fontSize: 15,
        color: '#3D7199',
    },
});
