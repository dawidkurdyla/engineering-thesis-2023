import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { COLORS, SIZES, SHADOWS, assets } from '../constants'
import { CircleButton, RectButton } from './Button'
import { SubInfo, TrainingPrice, TrainingTitle } from './SubInfo'

const TraningCard = ({ data, onPress, onLongPress, onLayout } ) => {

    navigation = useNavigation();

    return (
        <View
            style={styles.bottomCard}
            onLayout={onLayout}
            >
            <TouchableOpacity
                onPress={onPress}
                onLongPress={onLongPress}
                delayPressOut={69}
                delayPressIn={50}
            >
                <View style={{ width: '100%', height: 200 }}>
                    <Image
                        source={assets.Wheights}
                        resizeMode='cover'
                        style={styles.image}
                    />

                </View>

                <SubInfo startDate={data.date} />

                <View style={{ width: "100%", padding: SIZES.font }}>
                    <TrainingTitle trainingTitle={data.title} style={styles.trainingTitle} />
                </View>

            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    bottomCard: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.font,
        marginBottom: SIZES.extraLarge,
        margin: SIZES.base,
        ...SHADOWS.dark
    },
    image: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: SIZES.font,
        borderTopRightRadius: SIZES.font,
    },
    trainingTitle: {
        fontSize: SIZES.large
    },
})

export default TraningCard