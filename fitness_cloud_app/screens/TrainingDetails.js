import React, { useContext, useEffect, useCallback, useState } from 'react'
import { Text, Image, SafeAreaView, StyleSheet, FlatList, View, RefreshControl, Alert } from 'react-native'
import { Observer } from 'mobx-react'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons'

import TrainingStore from '../stores/TrainingStore'
import CommentStore from '../stores/CommentStore'
import ProfileStore from '../stores/ProfileStore'
import { AuthContext } from '../context'
import { assets, COLORS, SHADOWS, SIZES} from '../constants'
import { ExerciseCard, FocusedStatusBar, TrainingHeader, ExerciseFormMenu, CommentSection } from '../components'
import { CircleButton, WideButton } from '../components/Button'
import { LineDivider } from '../components/utils';

const TrainingDetails = ({route, navigation}) => {

    const { data } = route.params; 
    const { authData, authFunctions } = useContext(AuthContext);
    const [isAddMenuVisible, setIsAddMenuVisible] = useState(false);
    const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);


    useFocusEffect(
        useCallback(() => {
            handleRefreshData()

            return () => {
                TrainingStore.clearTrainingDetails();
            }
        }, [TrainingStore.trainingExercises, CommentStore.commentList])
    )

    const exerciseTypes = {
        "weight": "W",
        "time": "T",
        "custom": "C",
    };
    const stateTypes = {
        "waiting": "W",
        "done": "D",
        "partially": "P",
        "undone": "U",
    };

    const handleRefreshData = () => {
        TrainingStore.loadTrainingExercises(authData.authTokens.access, data.id)
        TrainingStore.setChosedTraining(data);
    }

    const handlePress = (data) => {
        TrainingStore.setChosedExercise(data);
        navigation.navigate("ExerciseDetails", { data })
    }

    const handleLongPress = (item) => {
        Alert.alert(
            'Deleting an exercise',
            `Are you sure you want to remove "${item.name}" from this workout?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes', onPress: () => {
                        TrainingStore.deleteExercise(item.id, item.training_id, authData.authTokens.access)
                    }
                }
            ]
        )
    }

    return (
        <SafeAreaView
            style={{flex: 1}}
        >
            <FocusedStatusBar backgroundColor={COLORS.primary} barStyle='light-content' />

            <ExerciseFormMenu
                visible={isAddMenuVisible}
                handleClose={() => setIsAddMenuVisible(false)}
                trainingID={data.id}
                token={authData.authTokens.access}
                />

            <CommentSection
                data={CommentStore.commentList}
                visible={isCommentSectionVisible}
                handleClose={() => setIsCommentSectionVisible(false)}
                myProfile={ProfileStore.myProfile}
                onChangeText={(v) => CommentStore.setNewComment(v)}
                onSendPress={(() => CommentStore.sendComment(
                    ProfileStore.myProfile.user_id, TrainingStore.chosedTraining, authData.authTokens.access))}     
            />

            <Observer>{() =>
                <View style={{flex: 1}}>
                    <FlatList
                        data={TrainingStore.trainingExercises}
                        renderItem={(({ item }) =>
                            <ExerciseCard
                                data={item}
                                onPress={() => handlePress(item)}
                                onLongPress={() => handleLongPress(item)}
                                navigation={navigation}
                                handleDone={() => TrainingStore.handleExerciseEdit(item, 'status', stateTypes["done"], authData.authTokens.access)}
                                handlePartially={() => TrainingStore.handleExerciseEdit(item, 'status', stateTypes["partially"], authData.authTokens.access)}
                                handleUndonde={() => TrainingStore.handleExerciseEdit(item, 'status', stateTypes["undone"], authData.authTokens.access)}
                                refreshControl={<RefreshControl refreshing={TrainingStore.refreshing} onRefresh={handleRefreshData} />}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={TrainingStore.refreshing} onRefresh={handleRefreshData} />}
                        ListHeaderComponent={
                            <TrainingHeader 
                                training={data}
                                onAvatarPress={() => navigation.openDrawer()}
                            />
                        }
                        ListFooterComponentStyle={{ flex: 1, justifyContent: 'flex-end' }}
                        ListFooterComponent={
                            <View>
                                <CircleButton
                                    icon={<Ionicons name="create-outline" size={40} color={COLORS.white} />}
                                    color={COLORS.cyan}
                                    style={styles.createButton}
                                    onPress={() => setIsAddMenuVisible(true)}
                                />
                                
                            </View>
                        }
                    />
                    <WideButton
                        onPress={() => setIsCommentSectionVisible(true)}
                        text={`Comments (${data.comments_number})`}
                        style={{ width: '180%', alignSelf: 'center' }}
                    />
                </View>
            }</Observer>

            <View style={styles.background}>
                <View style={{ height: 250, backgroundColor: COLORS.primary }} />
                <View style={{ flex: 1, backgroundColor: COLORS.white }} />
            </View>

        </SafeAreaView>
    )
}

export default TrainingDetails

const styles = StyleSheet.create({
    background: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: -1,
    },
    createButton: {
        height: 75,
        width: 75,
        borderRadius: 75,
        zIndex: 10,
        alignSelf: 'center',
        marginTop: 75,
        marginBottom: 100,
        ...SHADOWS.dark
    },
})