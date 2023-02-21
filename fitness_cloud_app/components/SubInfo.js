import { useState } from 'react'
import { View, Text, Image, useEfect } from 'react-native'
import Moment from 'moment';

import { SIZES, FONTS, SHADOWS, COLORS, assets } from '../constants'


export const TrainingTitle = (props) => {
    return (
        <View>
            <Text style={props.style}>{props.trainingTitle}</Text>
        </View>
    )
}


export const ImageCmp = ({imgUrl, index}) => {
    return (
        <Image
            source={imgUrl}
            resizeMode='contain'
            style={{
                width: 48,
                height: 48,
            }}
        />
    )
}

export const StartDate = (props) => {
    const [startDate, setStartDate] = useState(new Date(props.startDate));

    // Moment.locale('en');

    return (
        <View 
            style={{
                paddingHorizontal: SIZES.font,
                paddingVertical: SIZES.base,
                backgroundColor: COLORS.white,
                borderRadius: SIZES.extraLarge,
                justifyContent: 'center',
                alignContent: 'center',
                ...SHADOWS.light,
                elevation: 1,
                maxWidth: '50%'
            }}
        >
            <Text style={{ fontSize: SIZES.medium, color: COLORS.primary}}>
                {Moment.utc(startDate).format('D MMMM, HH:mm')}
            </Text>
        </View>
    )
}

export const SubInfo = (props) => {
    return (
        <View style={{
            width: "100%",
            paddingHorizontal: SIZES.font,
            marginTop: -SIZES.extraLarge,
            flexDirection: "row",
            justifyContent: 'space-between'
        }}>
            <ImageCmp
                imgUrl={assets.person04}
            />
            <StartDate startDate={props.startDate}/>
        </View>
    )
}