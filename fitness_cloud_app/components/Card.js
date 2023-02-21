import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons'

import { COLORS, SIZES, SHADOWS, assets } from '../constants'
import { IconButton } from './Button'
import { LineDivider, AvatarLogo } from './utils'

export const ProfileCard = ({ data, onPress, onLongPress, onMessagePress }) => {

    navigation = useNavigation();

    return (
        <View style={styles.bottomCard}>
            <TouchableOpacity
                onPress={onPress}
                onLongPress={onLongPress}
                delayPressOut={69}
                delayPressIn={50}
            >
                <View style={styles.content}>
                    <AvatarLogo
                        image={assets.person04}
                        style={{ width: 60, height: 60}}
                    />
                    <View  style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
                        <View style={{ alignContent: 'space-between', paddingHorizontal: 5}}>
                            <Text style={styles.userTitle}>
                                {data.first_name + ' ' + data.last_name}
                            </Text>
                            <Text style={styles.username}>
                                {data.username}
                            </Text>
                        </View>
                        <IconButton
                            icon={<Ionicons name='chatbox-ellipses-outline' color={'black'} size={30} />}
                            style={{paddingHorizontal: 10, paddingVertical: 10}}
                            onPress={() => onMessagePress()}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export const FlatProfileCard = ({ data, onPress, isContact }) => {

    navigation = useNavigation();

    return (
        <View style={styles.bottomFlatCard}>
            <TouchableWithoutFeedback>
                <View style={styles.content}>
                    <AvatarLogo
                        image={assets.person04}
                        style={{ width: 60, height: 60 }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                        <View style={{ alignContent: 'space-between', paddingHorizontal: 5 }}>
                            <Text style={styles.smallUserTitle}>
                                {data.first_name + ' ' + data.last_name}
                            </Text>
                            <Text style={styles.smallUsername}>
                                {data.username}
                            </Text>
                        </View>
                        {isContact
                            ? <IconButton
                                icon={<Ionicons name='checkmark-outline' color={'black'} size={28} />}
                                style={{ paddingHorizontal: 10, paddingVertical: 15 }}
                                onPress={() => { }}
                            />
                            : <IconButton
                                icon={<Ionicons name='person-add-outline' color={'black'} size={28} />}
                                style={{ paddingHorizontal: 10, paddingVertical: 15 }}
                                onPress={onPress} 
                            />
                        }
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

// export const FlatProfileCard

const styles = StyleSheet.create({
    bottomCard: {
        height: 70,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.font,
        margin: SIZES.base,
        marginTop: 1,
        ...SHADOWS.dark
    },
    bottomFlatCard: {
        height: 70,
        backgroundColor: COLORS.white,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray,
        marginTop: 1,
    },
    content:{
        flexDirection: "row", 
        justifyContent: 'flex-start',
        alignItems: "center",
        paddingVertical: 5, 
        paddingHorizontal: 5  
    },
    avatarLogo: {
        width: 60,
        height: 60,
        position: 'absolute',
        top: -30,
        left: 5,
    },
    searchIcon:{
        position: 'absolute',
        top: -30,
        right: 5,
    },
    username:{
        fontSize: SIZES.font,
    },
    userTitle:{
        fontSize: SIZES.extraLarge,
        flexShrink: 1,
    },
    smallUsername: {
        // position: "absolute",
        // marginBottom: -30,
        flexShrink: 1,
        fontSize: SIZES.font,
    },
    smallUserTitle: {
        // marginTop: 3,
        flexShrink: 1,
        fontSize: SIZES.large,
    }
})
