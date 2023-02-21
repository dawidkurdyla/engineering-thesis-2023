import React, { useContext, useEffect, useState} from 'react'
import { Text, StyleSheet, FlatList, View, Modal, Image, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Observer } from 'mobx-react'
import Ionicons from '@expo/vector-icons/Ionicons'

import { SIZES, FONTS, SHADOWS, COLORS, assets } from '../constants'
import TrainingStore from '../stores/TrainingStore'
import CommentStore from '../stores/CommentStore'
import ProfileStore from '../stores/ProfileStore'
import { AuthContext } from '../context'
import { IconButton } from '../components/Button'
import { MessageInput } from '../components/CustomInput';
import { Video } from 'expo-av';



const CommentFile = ({comment}) => {
    let fileContent;

    if (comment.files.length > 0) {
        const file = comment.files[0]?.file;
        const fileFormat = file.split('.').pop();
        const video = React.useRef(null);
        const [status, setStatus] = useState({});
    
        fileContent = fileFormat != 'mp4'
            ?
             <Image
                source={{ uri: `http://192.168.0.39:8000${file}` }}
                style={{ width: 230, height: 230, borderRadius: 10 }}
                resizeMode='cover'
            />
            : <Video source={{ uri: `http://192.168.0.39:8000${file}` }} 
                style={{ width: 230, height: 230, borderRadius: 10 }}
                useNativeControls
                resizeMode='contain'                    
                ref={video}
                onPlaybackStatusUpdate={setStatus}
            />
    }

    return(
        <View style={{ backgroundColor: 'black', margin: 10, borderRadius: 10 }}>
            {fileContent}
        </View>
    )
}

const CommentBubble = ({comment, myProfile}) => {
    return(
        <View style={comment.user_id == myProfile.user_id
                ? styles.myComment
                : styles.otherComment}
        >
                {comment.files.length > 0 && <CommentFile comment={comment}/>}
                <Text
                    style={comment.user_id == myProfile.user_id
                        ? styles.myText
                        : styles.otherText
                    }
                >
                    {comment.content}
                </Text>

        </View>
    )

}


const CommentSection = (props) => {

    const { authData, authFunctions } = useContext(AuthContext);

    useEffect(() => {
        CommentStore.loadCommentList(TrainingStore.chosedTraining, authData.authTokens.access)
    })

    const addingFileAlert = () => {
        Alert.alert(
            'Adding file','',
            [
                {text: 'Close', onPress: () => {}},
                {text: 'Open Camera', onPress: () => takePhoto()},
                {text: 'Open Gallery', onPress: () => pickFile()}
            ]
        )
    }
    

    const pickFile = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            CommentStore.setCommentMediaFile(result.assets[0])
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            CommentStore.setCommentMediaFile(result.assets[0])
        }
    };

    const handleSend = () => {
        CommentStore.sendComment(
            ProfileStore.myProfile.user_id, TrainingStore.chosedTraining, authData.authTokens.access)
    }

    return (


    <Modal
        transparent={true}
        visible={props.visible}
        animationType="slide"
    >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View
                style={styles.addContactMenu}
            >
                <View style={{ width: '100%', height: "100%", flex: 1, }}>
                    <IconButton
                        icon={<Ionicons name='close-outline' color={'black'} size={40} />}
                        style={{ alignSelf: 'flex-end', padding: 5 }}
                        onPress={() => props.handleClose()}
                    />
                    <Observer>{() =>
                        <FlatList
                            inverted
                            data={CommentStore.commentList}
                            renderItem={(({ item }) =>
                                <CommentBubble
                                    comment={item}
                                    myProfile={props.myProfile}
                                />
                            )}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={true}
                            ListHeaderComponent={
                                <MessageInput
                                    value={CommentStore.newComment}
                                    multiline={true}
                                    onChangeText={props.onChangeText}
                                    placeholder={'Aa'}
                                    textStyle={{fontSize: SIZES.font, maxWidth:"70%"}}
                                    onSendPress={handleSend} 
                                    onImagePress={addingFileAlert}
                                    onLongImagePress={() => CommentStore.setCommentMediaFile(null)}
                                    image={CommentStore.commentMediaFile?.uri}
                                />
                            }
                            
                        />
                    }</Observer>
                </View>
            </View>  
        </View>
    </Modal>
    
  )
}

const styles = StyleSheet.create({
    addContactMenu: {
        flex: 1,
        width: "100%",
        height: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    myComment: {
        maxWidth: "75%",
        backgroundColor: COLORS.cyan,
        borderRadius: SIZES.font,
        margin: SIZES.base,
        marginBottom: 0,
        alignSelf:'flex-end',
        justifyContent: 'flex-end',
        ...SHADOWS.dark,
    },
    otherComment: {
        maxWidth: "75%",
        backgroundColor: COLORS.border,
        borderRadius: SIZES.font,
        marginBottom: 0,
        margin: SIZES.base,
        alignSelf: 'flex-start',
        ...SHADOWS.dark,
    },
    myText: {
        textAlign: 'right',
        color: COLORS.white,
        padding: SIZES.font,
    },
    otherText: {
        color: COLORS.black,
        padding: SIZES.font,
        alignSelf: 'flex-start',
    },
    title: {
        textAlign: 'center',
        fontSize: SIZES.title,
    },
    CommentFile: {
        width: "70%",
        height: "70%",
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
})

export default CommentSection