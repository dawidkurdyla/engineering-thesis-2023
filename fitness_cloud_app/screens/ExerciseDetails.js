import React, { useContext, useEffect, useCallback, useState } from 'react'
import { Text, Image, SafeAreaView, StyleSheet, FlatList, View, RefreshControl, Alert, ScrollView, BackHandler, Switch } from 'react-native'
import { Observer } from 'mobx-react'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons'
import { useForm, Controller } from 'react-hook-form'

import TrainingStore from '../stores/TrainingStore'
import { AuthContext } from '../context'
import { assets, COLORS, SHADOWS, SIZES } from '../constants'
import { ExerciseCard, FocusedStatusBar, TrainingHeader, AppHeader } from '../components'
import { CustomDropdown, CustomTextInput, FlatCustomTextInput, MyTextInput } from '../components/CustomInput';
import { CircleButton, IconButton } from '../components/Button'
import { LineDivider } from '../components/utils';

const ExerciseDetails = ({ route, navigation }) => {

    const { data } = route.params;
    const { authData, authFunctions } = useContext(AuthContext);
    const [isAddMenuVisible, setIsAddMenuVisible] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);


    useFocusEffect(
        useCallback(() => {
            TrainingStore.setHasChanged(false);
            handleRefreshData()

            return () => {
                TrainingStore.clearTrainingDetails();
            }
        }, [])
    )
    const exerciseTypeOptions = [
        { key: 'W', value: 'Weight' },
        { key: 'T', value: 'Time' },
        { key: 'C', value: 'Custom' },
    ]

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        setError
    } = useForm();


    const handleRefreshData = () => {
        TrainingStore.loadExercise(TrainingStore.chosedExercise, authData.authTokens.access);
    }

    const handleChange = (key, value) => {
        let exercise = {...TrainingStore.chosedExercise};
        exercise[key] = value;
        TrainingStore.setChosedExercise(exercise);
        TrainingStore.setHasChanged(true);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FocusedStatusBar backgroundColor={COLORS.primary} barStyle='light-content' />

            <Observer>{() =>
                <ScrollView
                    style={{ flex: 1, height: '100%'}}
                    refreshControl={<RefreshControl refreshing={TrainingStore.refreshing} onRefresh={handleRefreshData} />}
                >
                    <View style={{ height: 150, backgroundColor: COLORS.primary, padding: SIZES.font }}>
                        <AppHeader
                            title={data.name}
                            avatar={assets.person01}
                            isCoach={true}
                            onAvatarPress={() => navigation.openDrawer()}
                        />
                        <View style={styles.swichContainer}>
                            <Text style={{ fontSize: SIZES.large, color: COLORS.white,}}>
                                Enable editing
                            </Text>
                            <Switch
                                trackColor={{ false: '#767577', true: COLORS.white }}
                                thumbColor={isEnabled ? COLORS.cyan : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1, backgroundColor: COLORS.white, padding: SIZES.base }}>
                        {TrainingStore.chosedExercise.series_number != undefined && <View>
                            <Text style={styles.label}>Sets</Text>
                            <MyTextInput
                                name='series_number'
                                control={control}
                                value={String(TrainingStore.chosedExercise.series_number)}
                                onChange={(v) => handleChange('series_number', v)}
                                placeholder={"Number of series"}
                                textStyle={styles.inputText}
                                editable={isEnabled}
                                keyboardType={'decimal-pad'}
                            />
                        </View>}
                        {TrainingStore.chosedExercise.repetitions_number != undefined && <View>
                            <Text style={styles.label}>Repetitions</Text>
                            <MyTextInput
                                name='repetitions_number'
                                value={String(TrainingStore.chosedExercise.repetitions_number)}
                                onChange={(v) => handleChange('repetitions_number', v)}
                                placeholder={"Number of repetitions"}
                                style={styles.input}
                                textStyle={styles.inputText}
                                editable={isEnabled}
                                keyboardType={'decimal-pad'}
                            />
                        </View>}
                        {TrainingStore.chosedExercise.load != undefined && <View>
                            <Text style={styles.label}>Weight load</Text>
                            <MyTextInput
                                name='load'
                                value={String(TrainingStore.chosedExercise.load)}
                                onChange={(v) => handleChange('load', v)}
                                placeholder={"Weight load"}
                                style={styles.input}
                                textStyle={styles.inputText}
                                editable={isEnabled}
                                keyboardType={'decimal-pad'}
                            />
                        </View>}
                        {TrainingStore.chosedExercise.duration != undefined && <View>
                            <Text style={styles.label}>Time duration</Text>
                            <MyTextInput
                                name='duration'
                                value={String(TrainingStore.chosedExercise.duration)}
                                onChange={(v) => handleChange('duration', v)}
                                placeholder={"Duration"}
                                style={styles.input}
                                textStyle={styles.inputText}
                                editable={isEnabled}
                                keyboardType={'decimal-pad'}
                            />
                        </View>}
                        {TrainingStore.chosedExercise.description != undefined && <View>
                            <Text style={styles.label}>Description</Text>
                            <MyTextInput
                                multiline
                                name='description'
                                value={String(TrainingStore.chosedExercise.description)}
                                onChange={(v) => handleChange('description', v)}
                                placeholder={"Exercise description"}
                                style={styles.input}
                                editable={isEnabled}
                                keyboardType={'default'}
                            />
                        </View>}
                        {TrainingStore.hasChanged && <CircleButton
                            icon={<Ionicons name="cloud-upload-outline" size={40} color={COLORS.white} />}
                            color={COLORS.cyan}
                            style={styles.createButton}
                            onPress={handleRefreshData}
                        />}
                    </View>
                </ScrollView>
            }</Observer>

            {/* <View style={styles.background}>
                <View style={{ height: 250, backgroundColor: COLORS.primary }} />
                <View style={{ flex: 1, backgroundColor: COLORS.border }} />
            </View> */}

        </SafeAreaView>
    )
}

export default ExerciseDetails

const styles = StyleSheet.create({
    swichContainer: { 
        flexDirection: 'row', 
        width: '100%', 
        position: 'absolute', 
        bottom: SIZES.font, 
        justifyContent: 'flex-end'
    },
    createButton: {
        height: 75,
        width: 75,
        borderRadius: 75,
        zIndex: 10,
        alignSelf: 'center',
        marginTop: 15,
        ...SHADOWS.dark
    },
    label: {
        fontSize: SIZES.large
    },
    input: {
        marginBottom: 10,
        fontSize: SIZES.large
    },
    inputText: {
        fontSize: SIZES.large
    },
})