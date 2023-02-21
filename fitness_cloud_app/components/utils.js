import { View, Image, Text, StyleSheet } from "react-native";
import { COLORS, SIZES, SHADOWS, assets } from "../constants";

export const LineDivider = (props) => {
    return (
        <View style={{
            borderBottomColor: COLORS.gray,
            borderBottomWidth: StyleSheet.hairlineWidth,
            ...props.style
        }}/>
    )
}

export const AvatarLogo = ({image, style}) => {
    return (
        <View
            style={{
                backgroundColor: COLORS.white,
                borderRadius: style.width,
                alignItems: 'center',
                justifyContent: 'center',
                ...style,
            }}
        >
            {image && <Image
                source={image}
                resizeMode="contain"
                style={{ width: '90%', height: '90%' }}
            />}
            
        </View>
    )
}