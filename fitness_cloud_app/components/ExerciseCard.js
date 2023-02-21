import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation} from "@react-navigation/native";
import { observer } from 'mobx-react'
import Ionicons from '@expo/vector-icons/Ionicons';

import { COLORS, SIZES, SHADOWS, assets } from "../constants";
import { SubInfo, TrainingTitle } from "./SubInfo";
import { RectButton, CircleButton, ExerciseControlButtons } from "./Button";
import { LineDivider } from "./utils";

const { width, height } = Dimensions.get('screen');

const ExerciseCard = observer(({ data, handleDone, handlePartially, handleUndonde, onPress, onLongPress  }) => {

    const navigation = useNavigation();
    const exerciseTypes = {
        "weight" : "W",
        "time" : "T",
        "custom" : "C",
    };
    const stateTypes = {
        "waiting": "W",
        "done": "D",
        "partially": "P",
        "undone": "U",
    };
    
    const exerciseDescription = (
        <View style={{}}>
            {(data.type == exerciseTypes["weight"]) && <View>
                <Text style={{ fontSize: 20 }}>Weight: {data.load} kg</Text>
                <Text style={{ fontSize: 20 }}>Sets: {data.series_number}</Text>
                <Text style={{ fontSize: 20 }}>Reps: {data.repetitions_number}</Text>
            </View>}
            {(data.type == exerciseTypes["time"]) && <View>
                <Text style={{ fontSize: 20 }}>Duration: {data.duration}</Text>
                <Text style={{ fontSize: 20 }}>Sets: {data.series_number}</Text>
                <Text style={{ fontSize: 20 }}>Reps: {data.repetitions_number}</Text>
            </View>}
            {(data.type == exerciseTypes["custom"]) && <View>
            </View>}
        </View>
    )

    const ControlButtons = (
        <ExerciseControlButtons
            handleDone={handleDone}
            handlePartially={handlePartially}
            handleUndonde={handleUndonde}
            undoneIcon={<Ionicons name='close-outline' color={"white"} size={30} />}
            partiallyIcon={<Ionicons name='menu-outline' color={"white"} size={30} />}
            doneIcon={<Ionicons name='checkmark-outline' color={"white"} size={30} />}
        />
    )

    const fullCardContent = (
        <View>
            <View style={{ width: "100%", padding: SIZES.base}}>
                <Text style={styles.exerciseTitle}> {data.name} </Text>
                <LineDivider/>
            </View>

            <View style={styles.fullCardContent}>
                {exerciseDescription}
                {ControlButtons}
            </View>
        </View>
    )
    const hiddenCardContent = (
        <View>
            <View style={styles.hiddenCardContent}>
                <Text 
                    style={styles.exerciseTitle}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}
                > 
                    {data.name} 
                </Text>
                {ControlButtons}
            </View>
        </View>
    )

    return (
        <View style={{
                backgroundColor: COLORS.white,
                borderRadius: SIZES.font,
                marginBottom: SIZES.small,
                margin: SIZES.base,
                ...SHADOWS.dark,
            }}
        >
            <TouchableOpacity
                onPress={onPress}
                onLongPress={onLongPress}
                delayPressOut={69}
                delayPressIn={50}
            >
                {[stateTypes["waiting"], stateTypes["undone"]].includes(data.status)
                    ? fullCardContent 
                    : hiddenCardContent
                }
            </TouchableOpacity>
        </View>
    )
});


const styles = StyleSheet.create({
    exerciseTitle: {
        fontSize: SIZES.extraLarge,
        flexShrink: 1,
    },
    fullCardContent: {
        width: "100%",
        padding: SIZES.base,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: 'space-between'
    },
    hiddenCardContent: {
        width: "100%", 
        padding: SIZES.base, 
        flexDirection: 'row', 
        justifyContent: "space-between", 
        alignItems: "center"
    },
})


export default ExerciseCard;

