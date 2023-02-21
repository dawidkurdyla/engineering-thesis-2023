import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native'

import { COLORS, SHADOWS, SIZES, assets } from '../constants'

export const CircleButton = ({ image, icon, color, onPress, style }) => {
    return (
        <TouchableOpacity
            style={{
                width: 50,
                height: 50,
                backgroundColor: color ? color :  COLORS.white,
                // position: 'absolute',
                borderRadius: SIZES.extraLarge,
                alignItems: 'center',
                justifyContent: 'center',
                ...SHADOWS.light,
                ...style,
            }}
            onPress={() => onPress()}
        >
            {image && <Image
                source={image}
                resizeMode="contain"
                style={{ width: '90%', height: '90%' }}
            />}
            {icon && icon}
        </TouchableOpacity>
    )
}

export const RectButton = () => {
    return (
        <TouchableOpacity style={styles.circleButton}>

            <Text>Button</Text>
        </TouchableOpacity>
    )
}

export const WideButton = (props) => {
    return (
        <View>
            <TouchableOpacity
                onPress={props.onPress}
            >
                <View
                    style={[styles.wideButton, props.style]}
                >
                    <Text style={{ fontWeight: 'bold', color: COLORS.white, fontSize: 18 }} >{props.text}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export const InputButton = (props) => {

    let content;

    if (props.value) {
        content = (
            <Text style={{color: COLORS.black}} >
                {props.value}
            </Text>
        )
    } else {
        content = (
            <Text style={{ color: COLORS.gray }} >
                {props.placeholder}
            </Text>
        )
    }
    return (
        <View>
            <TouchableOpacity
                onPress={props.onPress}
            >
                <View
                    style={[styles.inputButton, props.style]}
                >
                    {content}
                </View>
            </TouchableOpacity>
        </View>
    )
}

export const TextButton = (props) => {
    return (
        <TouchableOpacity
            onPress={props.onPress}
        >
            <View>
                <Text style={props.style} >{props.text}</Text>
            </View>
        </TouchableOpacity>
    )
 }

 export const IconButton = (props) => {
    return (
        <TouchableOpacity
            onPress={props.onPress}
            onLongPress={props.onLongPress}
            style={props.style}
        >
            {props.icon}
        </TouchableOpacity>
    )
 }


 export const ExerciseControlButtons = (props) => {
     return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignContent: 'center' ,
         }}
        >
            <CircleButton
                onPress={props.handleUndonde} 
                icon={props.undoneIcon}  
                color="#c33126"
                style={styles.ExerciseControlButton}
            /> 
            <CircleButton 
                onPress={props.handlePartially}
                color="#fb7a3f" 
                style={styles.ExerciseControlButton}
                icon={props.partiallyIcon}  
            />
            <CircleButton  
                onPress={props.handleDone}
                icon={props.doneIcon}
                color={COLORS.cyan}
                style={styles.ExerciseControlButton}
            />
        </View>
     )
 }

const styles = StyleSheet.create({
    wideButton: {
        width: '100%',
        backgroundColor: COLORS.cyan,
        borderColor: COLORS.gray,
        borderWidth: 1,
        borderRadius: SIZES.font,
        flexDirection: "row",
        alignItems: 'center',
        paddingHorizontal: SIZES.font,
        paddingVertical: SIZES.font,
        justifyContent: 'center',
        ...SHADOWS.black
    },
    textButton: {
        paddingHorizontal: SIZES.font,
        paddingVertical: SIZES.font,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ExerciseControlButton: {
        width: 40,
        height: 40,
        position: 'relative',
        marginLeft: 5,
        ...SHADOWS.dark
    },
    inputButton: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: SIZES.font,
        paddingHorizontal: SIZES.font,
        paddingVertical: SIZES.font,
        ...SHADOWS.black
    },


});
