import React, { Component } from 'react'
import { View, Text, FlatList, TouchbleOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import RNFS from 'react-native-fs'
import FileViewer from 'react-native-file-viewer'
import ImagePicker from 'react-native-image-picker'
import socket from 'socket.io-client'

import pt from 'date-fns/locale/pt'
import Icon from 'react-native-vector-icons/MaterialIcons'

import api from '../../services/api'

import { distanceInWords } from  'date-fns'

import styles from './styeles'

export default class Box extends Component {
    state = {
        box: {}
    }

    async ComponentDidMount() {
        
        const box = await AsyncStorage.getItem("@MiniDropbox:box")
        this.subscribeToNewFiles(box)
        const response = await api.get(`box/${box}`)

        this.setState({box: response.data   })
    }

    subcribeToNewFiles = (box) => {
        const box = this.props.match.params.id
        const io = socket('https://minidrop-backend.herokuapp.com/')
        
        // 'router' from backend
        io.emit('connectRoom', box)

        io.on('file', data => {
            //Study this syntax
            this.setState({
                 box: { ... this.state.box, files: [data, ... this.state.box.files] } 
            })
        })
    }
    openFile = async file => {
        try {

            const filePath = `${RNFS.DocumentDirectoryPath}/${file.title}`
            await RNFS.downloadFile({
                fromUrl: file.url,
                toFile: filePath
            })

            await FileViewer.open(filePath)

        } catch (err) {

        }

    }

    renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => this.openFile(item)}
            style={styles.file}
        >
        <View style={styles.fileInfo}>
            <Icon name="insert-drive-file" size={24} color="¨#A5CFFF"/>
            <Text style={styles.fileTitle}>{item.title}</Text>
        </View>

        <Text style={styles.fileDate}>
            há {DistanceInWords(item.createdAte, new Date(), {
                locale: pt
            })} 
        </Text>


        </TouchableOpacity>
    )

    handleUpload = () => {
        ImagePicker.launchImageLibrary({}, async upload => {
            if(upload.error) {
                
            } else if (upload.didCancel) {

            } else {
                const data = new FormData()

                const [prefix, suffix] = upload.fileName.split('.')
                const ext = suffix.toLowerCase() === 'heic' ? 'jpg' : suffix
            
                data.append('file', {
                    uri: upload.uri,
                    type: uplpad.type,
                    name: `${prefix}.${ext}`
                })

                api.post(`boxes/${this.state.box._id}/files`, data)
            }
        })

    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.boxTile}>{this.state.box.title}</Text>

                <FlatList
                    style={styles.list}
                    data={this.state.box.files}
                    keyExtractor={file => file._id}
                    itemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={this.renderItem}
                />

                <TouchableOpacity style={styles.fab} onPress={this.handleUpload}> 
                <Icon name="cloud-upload" size={24} color="¨#FFF"/>
                </TouchableOpacity>
            </View>
        )
    }
}