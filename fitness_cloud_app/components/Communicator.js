import React, { useContext, useEffect } from 'react'
import { Text, StyleSheet, FlatList, View, Modal } from 'react-native'
import { Observer } from 'mobx-react'
import Ionicons from '@expo/vector-icons/Ionicons'


import TrainingStore from '../stores/TrainingStore'
import MessageStore from '../stores/MessageStore'
import ProfileStore from '../stores/ProfileStore'
import { AuthContext } from '../context'
import { COLORS, SHADOWS, SIZES } from '../constants'
import { IconButton } from '../components/Button'
import { MessageInput } from '../components/CustomInput';


const MessageBubble = ({ message, myProfile }) => {

    return (
        <View>
            <View
                style={message.user_id == myProfile.user_id
                    ? styles.myComment
                    : styles.otherComment
                }
            >
                <Text
                    style={message.user_id == myProfile.user_id
                        ? styles.myText
                        : styles.otherText
                    }
                >
                    {message.content}
                </Text>
            </View>

        </View>
    )

}


const Communicator = (props) => {

    const { authData, authFunctions } = useContext(AuthContext);

    useEffect(() => {
        handleRefreshData();
    })

    const handleRefreshData = async () => {
        if (ProfileStore.choosedContact) {
            await ProfileStore.loadCochClient(authData.authTokens.access, ProfileStore.myProfile.id, ProfileStore.choosedContact.id)
            await MessageStore.loadMessages(ProfileStore.coachClient, authData.authTokens.access)
        }
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
                                data={MessageStore.messages}
                                renderItem={(({ item }) =>
                                    <MessageBubble
                                        message={item}
                                        myProfile={props.myProfile}
                                    />
                                )}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={true}
                                ListHeaderComponent={
                                    <MessageInput
                                        value={MessageStore.newMessage}
                                        multiline={true}
                                        onChangeText={props.onChangeText}
                                        placeholder={'Aa'}
                                        textStyle={{ fontSize: SIZES.font, maxWidth: "70%" }}
                                        onSendPress={props.onSendPress}
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
        maxWidth: "70%",
        backgroundColor: COLORS.cyan,
        borderRadius: SIZES.font,
        margin: SIZES.base,
        marginBottom: 0,
        alignSelf: 'flex-end',
        ...SHADOWS.dark,
    },
    otherComment: {
        maxWidth: "70%",
        backgroundColor: COLORS.border,
        borderRadius: SIZES.font,
        marginBottom: 0,
        margin: SIZES.base,
        alignSelf: 'flex-start',
        ...SHADOWS.dark,
    },
    myText: {
        color: COLORS.white,
        padding: SIZES.font,
    },
    otherText: {
        color: COLORS.black,
        padding: SIZES.font,
    },
    title: {
        textAlign: 'center',
        fontSize: SIZES.title,
    },
})

export default Communicator