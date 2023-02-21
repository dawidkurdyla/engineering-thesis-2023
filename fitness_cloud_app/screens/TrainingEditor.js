import React, { useContext, useEffect, useCallback, useState } from 'react'
import { Text, Image, SafeAreaView, StyleSheet, ScrollView, View, Button } from 'react-native'
import { Observer } from 'mobx-react'
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons'
import { useForm, Controller } from 'react-hook-form'
import DatePicker from 'react-native-date-picker'

import TrainingStore from '../stores/TrainingStore'
import ProfileStore from '../stores/ProfileStore'
import { AuthContext } from '../context'
import { assets, COLORS, SIZES, SHADOWS } from '../constants'
import { FocusedStatusBar, TrainingHeader } from '../components'
import { CustomDropdown, CustomTextInput, CustomDatePicker } from '../components/CustomInput';
import { CircleButton } from '../components/Button'



const ExerciseForm = (props) => {
    return (
        <Text>
            FORM
        </Text>
    )
}

const TrainingEditor = ({ route, navigation }) => {

    const { authData, authFunctions } = useContext(AuthContext);
    const { data } = route.params;

    return (
        <SafeAreaView
            style={{ flex: 1 }}
        >
            <FocusedStatusBar backgroundColor={COLORS.primary} barStyle='light-content' />

            <Observer>{() =>
                <ScrollView
                    style={{ width: '100%', height: '100%' }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View style={{ backgroundColor: COLORS.primary}}>
                        <TrainingHeader
                            training={data}
                            onAvatarPress={() => navigation.openDrawer()}
                        />
                    </View>
                    <ExerciseForm
                        token={authData.authTokens.access}
                        handleCreate={() => navigation.navigate("TrainingEditor")}
                    />
                </ScrollView>
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
    formContainer: {
        maxHeight: '100%',
        justifyContent: "space-between",
        padding: SIZES.small,
    },
    input: {
        marginTop: SIZES.font,
    },
    container: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: SIZES.font,
        paddingHorizontal: SIZES.font,
        marginTop: SIZES.font,
        ...SHADOWS.black
    },
    createButton: {
        height: 75,
        width: 75,
        borderRadius: 75,
        zIndex: 10,
        alignSelf: 'center',
        marginTop: 75,
        // position: "absolute",
        // alignSelf: 'flex-end',
        // bottom: 15,
        // right: 15,
        ...SHADOWS.dark
    },
})

export default TrainingEditor