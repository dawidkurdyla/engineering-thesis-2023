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
import { AppHeader, FocusedStatusBar,  } from '../components'
import { CustomDropdown, CustomTextInput, CustomDatePicker } from '../components/CustomInput';
import { CircleButton } from '../components/Button'


const TrainingForm = (props) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm();

    const [date, setDate] = useState(new Date());
    const [dateOpen, setDateOpen] = useState(false);

    const handleCreate = (data) => {
        data["date"] = date;
        data['coach_id'] = ProfileStore.myProfile.id;
        TrainingStore.createTraining(data, props.token, props.handleCreate);
    }

  return (
      <Observer>{() => 
            <View style={styles.formContainer}>
                <CustomTextInput
                    name='title'
                    control={control}
                    placeholder={"Provide training title..."}
                    style={styles.input}
                    rules={{
                        required: 'Title is required',
                    }}
                />
                <CustomDropdown
                    name='client_id'
                    data={ProfileStore.contacts?.map(contact => {
                        return { key: contact.id, value: contact.username };
                    })}
                    save="key"
                    control={control}
                    placeholder={"Select client"}
                    style={styles.input}
                    rules={{
                        required: 'Client is required',
                    }}
                />
              <View style={styles.container}>
                    <DatePicker
                        locale={'en'}
                        mode="datetime"
                        date={date}
                        minimumDate={new Date()}
                        onDateChange={setDate}
                        textColor={"#000000"}
                    />
              </View>

              <CircleButton
                  icon={<Ionicons name="create-outline" size={40} color={COLORS.white} />}
                  color={COLORS.cyan}
                  style={styles.createButton}
                  onPress={handleSubmit(handleCreate)}
              />
            </View>
      }</Observer>
    )
}


const TrainingCreator = ({ route, navigation }) => {

    const { authData, authFunctions } = useContext(AuthContext);

    useFocusEffect(
        useCallback(() => {
            TrainingStore.clearCreatedTraining();
            TrainingStore.clearTrainingDetails();
            
            ProfileStore.loadContacts(authData.authTokens.access, ProfileStore.myProfile.id)

            return () => {
                
            }
        }, [TrainingStore.chosedTraining])
    )

    const handleCreate = (data) => {
        navigation.navigate("TrainingDetails", {data})
    }
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
                    <View style={{ backgroundColor: COLORS.primary, padding: SIZES.font }}>
                        <AppHeader
                            icon={<Ionicons name="barbell-outline" size={40} color={COLORS.white} />}
                            title={'Training Creator'}
                            avatar={assets.person01}
                            isCoach={true}
                            onAvatarPress={() => navigation.openDrawer()}
                        />

                        <View style={{ marginVertical: SIZES.font }} />

                    </View>
                    <TrainingForm
                        token={authData.authTokens.access}
                        handleCreate={handleCreate}       
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

export default TrainingCreator

const styles = StyleSheet.create({
    background: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: -1,
    },
    formContainer :{
        maxHeight:'100%',
        justifyContent: "space-between",
        padding:SIZES.small, 
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
        ...SHADOWS.dark
    },
})