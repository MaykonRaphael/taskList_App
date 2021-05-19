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

    let [ fontsLoaded ] = useFonts({
        Jost_400Regular,
        Jost_600SemiBold,
    });

    const image = require('./src/assets/bg.jpg');

    const [ tarefas, setTarefas ] = useState([]);

    const [ modal, setModal ] = useState(false);

    const [ tarefaAtual, setTarefaAtual ] = useState('');

    useEffect(()=> {
        (async ()=> {
            try{
                let tarefasAtual = await AsyncStorage.getItem('tarefas');
                if(tarefasAtual == null)
                    setTarefas([]);
                else
                    setTarefas(JSON.parse(tarefasAtual));
            }catch(error){}
        })();
    }, [])

    function deletarTarefa(id){

        let newTarefas = tarefas.filter(function(val){
            return val.id != id;
        });

        setTarefas(newTarefas);

        (async ()=> {
            try{
                await AsyncStorage.setItem('tarefas', JSON.stringify(newTarefas));

            } catch(error){}
        })();
    }

    function handleDelete(id){

        Alert.alert("Deletar", 'Deseja mesmo deletar essa tarefa?',[
            {
                text: 'Não',
                style: 'cancel',
            },
            {
                text: 'Sim',
                onPress: async ()=> {
                    try {
                        deletarTarefa(id);
                    } catch(error){
                        Alert.alert("Não foi possível deletar!");
                    }
                }
            }
        ])
    }

    function addTarefa() {

        if(!tarefas)
            return Alert.alert('Por favor digite uma tarefa');

        setModal(!modal);

        let id = 0;
        if(tarefas.length > 0){
            id = tarefas[tarefas.length-1].id + 1;
        }

        let tarefa = {id:id,tarefa:tarefaAtual};

        setTarefas([...tarefas, tarefa]);

        (async ()=> {
        
            try {
                await AsyncStorage.setItem('tarefas', JSON.stringify([...tarefas, tarefa]));
            } catch(error){}
            
        })();
    }

    if(!fontsLoaded)
        return <AppLoading/>

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <StatusBar hidden/>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modal}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed!");
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setTarefaAtual(text)}
                            placeholder="Nova Tarefa"
                        />

                        <View style={{flexDirection: 'row'}}>
                            <TouchableHighlight
                                style={styles.cancelButton}
                                onPress={() => {
                                    setModal(!modal);
                                }}
                            >
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableHighlight>

                            <TouchableHighlight
                                style={styles.saveButton}
                                onPress={() => addTarefa() }
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
            tarefas.map(function(val){
                return(
                    <View style={styles.tarefaSingle}>

                        <View style={{flex:1, width: '100%'}}>
                            <Text style={{fontFamily: 'Jost_400Regular'}}>{val.tarefa}</Text>
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
                    setModal(true)}
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
        color: '#2B7A4B',
    },
});
