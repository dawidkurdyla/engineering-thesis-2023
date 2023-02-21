import { useState, useEffect, useContext, useCallback } from 'react'
import { View, FlatList, StyleSheet, SafeAreaView, RefreshControl, Alert } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Observer } from 'mobx-react'
import Ionicons from '@expo/vector-icons/Ionicons'

import ProfileService from '../services/ProfileService'
import TrainingStore from '../stores/TrainingStore'
import ProfileStore from '../stores/ProfileStore';

import { AuthContext } from '../context'
import { COLORS, SHADOWS } from '../constants'
import { TraningCard, FocusedStatusBar, UserTrainingsHeader } from '../components'
import { CircleButton } from '../components/Button'

const UserTrainings = ({ route, navigation }) => {
    const { authData, authFunctions } = useContext(AuthContext);
    // data == selected user
    const { data } = route.params; 

    useFocusEffect(
        useCallback(() => {
            handleRefreshData();

            return () => {
                TrainingStore.clearTrainingList();
            }
        }, [TrainingStore.trainingList, ProfileStore.myProfile])
    )

    const handlePress = (data) => {
        navigation.navigate("TrainingDetails", { data })
    }

    const handleLongPress = (item) => {
        Alert.alert(
            'Deleting a workout',
            `Are you sure you want to remove "${item.title}" from your workouts?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes', onPress: () => {
                        TrainingStore.deleteTraining(item.id, ProfileStore.myProfile, authData.authTokens.access)
                    }
                }
            ]
        )
    }

    const handleRefreshData = () => {
        TrainingStore.loadTrainingList(authData.authTokens.access, data)
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FocusedStatusBar backgroundColor={COLORS.primary} barStyle='light-content' />

            <View style={{ flex: 1 }}>
                <CircleButton
                    icon={<Ionicons name='add-outline' color={'white'} size={42} />}
                    color={COLORS.cyan}
                    onPress={() => navigation.navigate("Create Training")}
                    style={styles.addContactButton}
                />
                <View style={{ zIndex: 0 }}>
                    <Observer>{() =>
                        <FlatList
                            data={TrainingStore.trainingList}
                            renderItem={(({ item }) =>
                                <TraningCard
                                    data={item}
                                    onPress={() => handlePress(item)}
                                    onLongPress={() => handleLongPress(item)}
                                    navigation={navigation}
                                />

                            )}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl refreshing={TrainingStore.refreshing} onRefresh={handleRefreshData} />}
                            ListHeaderComponent={
                                <UserTrainingsHeader
                                    onAvatarPress={() => navigation.openDrawer()}
                                    user={data}
                                />
                            }
                        />
                    }</Observer>
                </View>

                <View style={styles.background}>
                    <View style={{ height: 250, backgroundColor: COLORS.primary }} />
                    <View style={{ flex: 1, backgroundColor: COLORS.white }} />
                </View>

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
})


export default UserTrainings