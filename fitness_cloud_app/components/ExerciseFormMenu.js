import React, { useContext, useEffect, useState, useCallback } from 'react'
import { Text, Image, SafeAreaView, StyleSheet, FlatList, View, Modal, ScrollView, TouchableWithoutFeedback } from 'react-native'
import { Observer } from 'mobx-react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useForm, Controller } from 'react-hook-form'


import TrainingStore from '../stores/TrainingStore'
import { AuthContext } from '../context'
import { assets, COLORS, NFTData, SHADOWS, SIZES } from '../constants'
import { ExerciseCard, FocusedStatusBar, ContactsHeader, ProfileCard, FlatProfileCard } from '../components'
import { WideButton, CircleButton, IconButton } from '../components/Button'
import { CustomDropdown, CustomTextInput } from '../components/CustomInput';
import ProfileStore from '../stores/ProfileStore'
import { LineDivider } from '../components/utils'

const ExerciseFormMenu = ({ visible, style, handleClose, trainingID, handleTrainingCreate, token }) => {

    const { authData, authFunctions } = useContext(AuthContext);
    const [searchText, setSearchText] = useState();
    const exerciseTypeOptions = [
        { key: 'W', value: 'Weight' },
        { key: 'T', value: 'Time'},
        { key: 'C', value: 'Custom' },
    ]

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm();

    const handleCreate = (data) => {
        TrainingStore.createExercise(data, trainingID, token, handleClose);
    }

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
        >
            <TouchableWithoutFeedback
                // style={styles.container}
                activeOpacity={1}
                onPress={() => handleClose()}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <TouchableWithoutFeedback
                        activeOpacity={1}
                    >
                        <View
                            style={styles.addContactMenu}
                        >
                            <View style={{ width: '100%', height: "100%", flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                                <ScrollView 
                                    style={{ flex: 1, width: '100%' }} 
                                    contentContainerStyle={{ flexGrow: 1 }}
                                    showsVerticalScrollIndicator={false}
                                >
                                    <View style={{ alignSelf: 'center', width: '90%', marginTop: 10 }}>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <Text style={styles.title}>Exercise creator</Text>
                                            <IconButton
                                                icon={<Ionicons name='close-outline' color={'black'} size={40} />}
                                                style={{ alignSelf: 'center' }}
                                                onPress={() => handleClose()}
                                            />
                                        </View>
                                        <LineDivider style={{ width: '100%', marginBottom: 10, marginTop: 10 }} />
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'flex-start', alignSelf: 'center', width:'90%' }}>

                                        <CustomTextInput
                                            name='name'
                                            control={control}
                                            placeholder={"Provide training title"}
                                            style={styles.input}
                                            rules={{
                                                required: 'Title is required',
                                            }}
                                        />
                                        <CustomDropdown
                                            name='type'
                                            data={exerciseTypeOptions}
                                            save="key"
                                            control={control}
                                            placeholder={'Select exercise type'}
                                            style={styles.input}
                                            rules={{
                                                required: 'Client is required',
                                            }}
                                        />
                                        <CustomTextInput
                                            name='series_number'
                                            control={control}
                                            placeholder={"Number of series"}
                                            style={styles.input}
                                        />
                                        <CustomTextInput
                                            name='repetitions_number'
                                            control={control}
                                            placeholder={"Number of repetitions"}
                                            style={styles.input}
                                        />
                                        <CustomTextInput
                                            name='load'
                                            control={control}
                                            placeholder={"Weight load"}
                                            style={styles.input}
                                        />
                                        <CustomTextInput
                                            name='duration'
                                            control={control}
                                            placeholder={"Duration"}
                                            style={styles.input}
                                        />
                                        <CustomTextInput
                                            multiline
                                            name='description'
                                            control={control}
                                            placeholder={"Exercise description"}
                                            style={styles.input}
                                        />
                                </View>

                                <View style={{ width: '90%', alignSelf: 'center'}}>
                                    <LineDivider style={{ width: '100%', marginBottom: SIZES.font, marginTop: SIZES.font }} />
                                    <WideButton
                                        style={{ marginBottom: 10, }}
                                        onPress={handleSubmit(handleCreate)}
                                        text={'Done'}
                                        />
                                </View>
                                        </ScrollView>
                                {/* </ScrollView> */}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback >

        </Modal>
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
        width: "100%",
        height: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        position:'absolute',
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
    addContactButton: {
        height: 75,
        width: 75,
        borderRadius: 75,
        zIndex: 10,
        position: "absolute",
        alignSelf: 'flex-end',
        bottom: 15,
        right: 15,
        ...SHADOWS.dark
    },
    addMenuOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 11,
    },
    title:{
        textAlign: 'center',
        fontSize: SIZES.title,
    },
    input: {
        marginTop: SIZES.font,
    },
})

export default ExerciseFormMenu