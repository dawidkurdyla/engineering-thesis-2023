import React, {useContext, useEffect} from 'react'
import { View, Text, TextInput, ImageBackground, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import jwt_decode from "jwt-decode";

import { CustomTextInput, FocusedStatusBar } from '../components'
import { WideButton, TextButton } from '../components/Button'
import { COLORS, FONTS, SIZES, assets } from '../constants' 
import { AuthContext } from '../context'
import ProfileService from '../services/ProfileService'
import ProfileStore from '../stores/ProfileStore'


const LoginScreen = ({navigation}) => {
    const { authData, authFunctions } = useContext(AuthContext);

    const { 
        control,
        handleSubmit,
        formState: {errors},
        setError
    } = useForm({
        defaultValues: {
            username: "",
            password: "",  
        },
    });

    const handleSignIn = async (data) => {
        try {
            const res = await authFunctions.loginUser(data);
            let userData = jwt_decode(res.access)
            ProfileStore.loadMyProfile(
                res.access,
                userData.is_coach,
                callBack = () => authFunctions.setIsSignedIn(true),
            );
        }
        catch (err) {
            if (err.status == 401) {
                setError('username', {
                    type: "custom",
                    message: "Invalid user data"
                })
                setError('password', {
                    type: "custom",
                    message: "Invalid user data"
                })
            }
        }
    }

    const goToRegister = () => {
        navigation.navigate('RegisterScreen');
    }

    
    const usernamePlaceholder = 'Username'
    const passwordPlaceholder = 'Password'

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FocusedStatusBar barStyle='light-content' />
            <ScrollView 
                style={{ width: '100%', height: '100%' }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={styles.container}>
                    <CustomTextInput
                        name='username'
                        control={control}
                        placeholder={usernamePlaceholder}
                        style={styles.input}
                        rules={{
                            required: 'Username is required',
                        }}
                    />
                    <CustomTextInput
                        name='password'
                        control={control}
                        placeholder={passwordPlaceholder}
                        secureTextEntry={true}
                        style={styles.input}
                        rules={{
                            required: 'Password is required',
                        }}
                    />

                    <WideButton
                        text='Sign in'
                        style={styles.button} 
                        onPress={handleSubmit(handleSignIn)} 
                    />
                    <TextButton
                        text="Don't have an account? Create one ➔"
                        style={styles.textButton}
                        onPress={() => goToRegister()}
                    />
                </View>
            </ScrollView>
            <ImageBackground source={assets.login_background} style={styles.background}/>
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
    container: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'flex-end',
        padding: SIZES.font,
    },
    input: {
        marginTop: SIZES.font,
    },
    button: {
        marginTop: 2 * SIZES.extraLarge,
    },
    textButton: {
        padding: SIZES.small,
        fontWeight: 'bold',
        color: COLORS.white,
        fontSize: 16
    },

});

export default LoginScreen