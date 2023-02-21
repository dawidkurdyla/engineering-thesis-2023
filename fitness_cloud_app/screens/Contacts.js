import React, { useContext, useEffect, useState, useCallback } from 'react'
import { Alert, SafeAreaView, StyleSheet, FlatList, View, Modal, Dimensions, TouchableWithoutFeedback, RefreshControl } from 'react-native'
import { Observer } from 'mobx-react'
import Ionicons from '@expo/vector-icons/Ionicons'


import TrainingStore from '../stores/TrainingStore'
import MessageStore from '../stores/MessageStore'
import { AuthContext } from '../context'
import { assets, COLORS, NFTData, SHADOWS } from '../constants'
import { ExerciseCard, FocusedStatusBar, ContactsHeader, ProfileCard, FlatProfileCard, Communicator } from '../components'
import { WideButton, CircleButton, IconButton } from '../components/Button'
import { CustomSearchBox } from '../components/CustomInput'
import ProfileStore from '../stores/ProfileStore'
import { LineDivider } from '../components/utils'


const { width, height } = Dimensions.get('screen');


const AddContactMenu = ({visible, style, handleClose}) => {

    const { authData, authFunctions } = useContext(AuthContext);
    const [searchText, setSearchText] = useState();

    useEffect(() => {
        return () => {
            ProfileStore.clearProfiles();
        };
    }, [ProfileStore.profiles]);

    const handleSearch = () => {
        if (searchText.length) {
            ProfileStore.loadProfiles(authData.authTokens.access, searchText);
        }
    }

    const handleTextChange = (value) => {
        setSearchText(value);
        if (value.length < 1) {
            ProfileStore.setProfiles([]);
        }
    }


    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            // style={{flex: 1}}
            // onRequestClose={() => handleClose() }
        >
            <TouchableWithoutFeedback 
                // style={styles.container}
                activeOpacity={1}
                onPress={() => handleClose()}
            >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <TouchableWithoutFeedback
                    // style={styles.container}
                    activeOpacity={1}
                >
                    <View
                        style={styles.addContactMenu}
                    >
                        <View style={{width:300, height:"100%"}}>
                            <View style={{ height: 60 }}>
                                <CustomSearchBox
                                    placeholder={'Search new contacts'}
                                    onChangeText={handleTextChange}
                                    onPress={handleSearch}                  
                                />
                            </View>

                            <Observer>{() =>
                                <FlatList
                                    data={ProfileStore.profiles}
                                    renderItem={(({ item }) =>
                                        <FlatProfileCard
                                            data={item}
                                            onPress={() => ProfileStore.addContact(authData.authTokens.access,
                                                        ProfileStore.myProfile.id, item.id)}
                                            isContact={ProfileStore.isContact(item)}
                                        />
                                    )}
                                    keyExtractor={(item) => item.id}
                                    showsVerticalScrollIndicator={false}                     
                                />
                            }</Observer>
                            <LineDivider style={{ width: '100%', marginBottom: 10 }} />
                            <WideButton
                                style={{marginBottom: 10,}}
                                onPress={() => handleClose()}
                                text={'Done'}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            </TouchableWithoutFeedback >

        </Modal>
    )
}


const Contacts = ({navigation}) => {

    const { authData, authFunctions } = useContext(AuthContext);
    const [isAddMenuVisible, setIsAddMenuVisible] = useState(false);
    const [isCommunicatorVisible, setIsCommunicatorVisible] = useState(false);

    useEffect(() => {
        handleRefreshData();
    }, [navigation])

    const handleRefreshData = () => {
        ProfileStore.loadContacts(authData.authTokens.access, ProfileStore.myProfile.id);
    }

    const handleLongPress = (user) => {
        Alert.alert(
            'Removing contact',
            `Are you sure you want to remove "${user.username}" from your contacts?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes', onPress: () => {
                        ProfileStore.deleteContact(authData.authTokens.access,
                        ProfileStore.myProfile.id, user.id)
                    }
                }
            ]
        )
    }

    const handleMessagePress = (user) => {
        ProfileStore.setChoosedContact(user)
        setIsCommunicatorVisible(true)
    }


    return (
        <SafeAreaView
            style={{ flex: 1 }}
        >
            <FocusedStatusBar backgroundColor={COLORS.primary} barStyle='light-content' />

            <CircleButton
                icon={<Ionicons name='person-add-outline' color={'white'} size={22} />}
                color={COLORS.cyan}
                onPress={() => setIsAddMenuVisible(!isAddMenuVisible)}
                style={styles.addContactButton}
            />

            <AddContactMenu
                visible={isAddMenuVisible}
                handleClose={() => setIsAddMenuVisible(false)}
            />

            <Communicator
                visible={isCommunicatorVisible}
                handleClose={() => setIsCommunicatorVisible(false)}
                myProfile={ProfileStore.myProfile}
                onChangeText={(v) => MessageStore.setNewMessage(v)}
                onSendPress={(() => MessageStore.sendMessage(ProfileStore.coachClient, authData.authTokens.access))}
            />

            <Observer>{() =>
                <View style={{ width: '100%', height: "100%", flex: 1, }}>
                    <FlatList
                        data={ProfileStore.contacts}
                        renderItem={(({ item }) =>
                            <ProfileCard
                                data={item}
                                onPress={() => navigation.navigate("UserTrainings", { data: item })}
                                onLongPress={() => handleLongPress(item)}
                                onMessagePress={() => handleMessagePress(item)}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={TrainingStore.refreshing} onRefresh={handleRefreshData} />}
                        ListHeaderComponent={
                            <ContactsHeader
                                trainingTitle={ProfileStore.myProfile.is_coach ? "Clients" : "Coaches"}
                                onAvatarPress={() => navigation.openDrawer()}
                            />
                        }
                    />
                </View>
            }</Observer>

            <View style={styles.background}>
                <View style={{ height: 250, backgroundColor: COLORS.primary }} />
                <View style={{ flex: 1, backgroundColor: COLORS.border }} />
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    background: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: -1,
    },
    addContactMenu: {
        flex: 1,
        width: "90%",
        maxHeight: '80%',
        // margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        // padding: 62,
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
    addContactButton: {
        height: 75, 
        width: 75, 
        borderRadius: 75, 
        zIndex: 10, 
        position: "absolute",
        alignSelf: 'flex-end',
        bottom: 15,
        right:15,
        ...SHADOWS.dark
    },
    addMenuOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 11,
    }
})

export default Contacts