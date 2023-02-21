import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Image, TextInput } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import Moment from 'moment';

import { CircleButton } from './Button.js'
import { COLORS, FONTS, SIZES, assets } from '../constants'
import { AuthContext } from "../context";
import { CustomSearchBox } from "./CustomInput.js";

export const AppHeader = ({ title, logo, icon, avatar, isCoach, onAvatarPress }) => {
    return (
        <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}
        >
            <View style={{ flexDirection: 'row', paddingTop:SIZES.font, alignContent: 'space-between' }}>
                {logo &&
                    <Image
                        source={logo}
                        resizeMode="contain"
                        style={{ width: 90, height: 25 }}
                    />
                }
                {icon && icon}
                {title &&
                    <Text style={styles.title}>
                        {title}
                    </Text>
                }
            </View>
            <View style={{ width: 45, height: 45 }}>
                <CircleButton
                    image={avatar}
                    onPress={onAvatarPress}
                />
                {isCoach && <Image
                    source={assets.badge}
                    resizeMode="contain"
                    style={{ position: 'absolute', width: 15, height: 15, bottom: -5, right: -5 }}
                />}
            </View>
        </View>
    )
}


export const HomeHeader = (props) => {

    const { authData, authFunctions } = useContext(AuthContext);

    return (
        <View style={{ backgroundColor: COLORS.primary, padding: SIZES.font }}>
            <AppHeader
                icon={<Ionicons name="cloud-outline" size={40} color={COLORS.white} />}
                title={"  Fitness Cloud"}
                avatar={assets.person01}
                isCoach={true}
                onAvatarPress={() => props.onAvatarPress()}
            />

            <View style={{ marginVertical: SIZES.font }}>
                <Text style={{ fontSize: SIZES.small, color: COLORS.white }}>
                    {`Hello ${authData.userInfo.first_name}! 👋`}
                </Text>
            </View>

            <CustomSearchBox
                placeholder="Search upcoming workouts"
            />
        </View>
    )
}

export const TrainingHeader = (props) => {

    const { authData, authFunctions } = useContext(AuthContext);
    const coachData = props.training.coach.first_name + ' ' + props.training.coach.last_name;
    const clientData = props.training.client.first_name + ' ' + props.training.client.last_name;

    Moment.locale('en');


    return (
        <View style={{ backgroundColor: COLORS.primary, padding: SIZES.font }}>
            <AppHeader
                title={props.training.title}
                avatar={assets.person01}
                isCoach={true}
                onAvatarPress={() => props.onAvatarPress()}
            />

            <View style={{ marginVertical: SIZES.font }} />
            <View style={styles.description}>
                <Text style={styles.descriptionText}>{`Coach: ${coachData}`} </Text>
                <Text style={styles.descriptionText}>{`Client: ${clientData}`} </Text>
                <Text style={styles.descriptionText}>{`Date: ${Moment(props.training.date).format('DD MMMM YYYY, H:m')}`} </Text>
            </View>
        </View>
    )
}

export const ContactsHeader = (props) => {

    const { authData, authFunctions } = useContext(AuthContext);

    return (
        <View style={{ backgroundColor: COLORS.primary, padding: SIZES.font }}>
            <AppHeader
                icon={<Ionicons name="people-outline" size={40} color={COLORS.white} />}
                title={props.trainingTitle}
                avatar={assets.person01}
                isCoach={true}
                onAvatarPress={() => props.onAvatarPress()}
            />

            <View style={{ marginVertical: SIZES.font }} />

            <CustomSearchBox
                placeholder="Search contact"
            />
            
        </View>
    )
}

export const UserTrainingsHeader = (props) => {

    const { authData, authFunctions } = useContext(AuthContext);
    const title = props.user.username + "'s trainings"

    Moment.locale('en');


    return (
        <View style={{ backgroundColor: COLORS.primary, padding: SIZES.font }}>
            <AppHeader
                title={title}
                avatar={assets.person01}
                isCoach={true}
                onAvatarPress={() => props.onAvatarPress()}
            />

            <View style={{ marginVertical: SIZES.font }} />
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: SIZES.title,
        color: COLORS.white,
        flexShrink: 1,
        // paddingTop: SIZES.font
    },
    icon: {
        paddingTop: SIZES.font
    },
    image: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: SIZES.font,
        borderTopRightRadius: SIZES.font,
    },
    descriptionText:{
        fontSize: SIZES.large,
        color: COLORS.white,
        marginTop: SIZES.base,
        flexShrink: 1,
    }
})