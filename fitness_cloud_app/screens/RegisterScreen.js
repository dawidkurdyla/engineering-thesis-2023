import React, { useContext } from 'react'
import { View, Text, Neste, ImageBackground, SafeAreaView, ScrollView, Background, StyleSheet } from 'react-native'
import { useForm, Controller } from 'react-hook-form'

import { CustomTextInput, FocusedStatusBar, CustomCheckbox } from '../components'
import { WideButton, TextButton } from '../components/Button'
import { COLORS, FONTS, SIZES, assets } from '../constants'
import { AuthContext } from '../context'
import ProfileService from '../services/ProfileService'

const RegisterScreen = ({ navigation }) => {
    const { authData, authFunctions } = useContext(AuthContext);
    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        watch,
    } = useForm({
        defaultValues: {
            username: "",
            password: "",
        },
    });
    const passwd = watch('password')

    const handleRegister = (data) => {
        authFunctions.registerUser(data)
        .then((res) => {
            authFunctions.loginUser(data)
                .then(res => {
                    ProfileService.getMyProfile(res.access, data.isCoach)
                        .then(res => {
                            console.log(res)
                        })
                        .catch(err => {
                            console.error(err)
                        })
                })
                .catch(err => {
                    console.error(err);
                })
        })
        .catch((err) =>{
            console.log(err)
            for (let field in err) {
                if (field == 'status') continue;

                setError(field, {
                    type: "custom",
                    message: err[field][0]
                })
                console.log(field);
            }
        })
    }

    const goToSignInScreen = () => {
        navigation.navigate('LoginScreen');
    }

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
                            placeholder={'Username'}
                            rules={{
                                required: 'Username is required',
                            }}
                            style={styles.input}
                        />
                        <CustomTextInput
                            name='firstName'
                            control={control}
                            placeholder={'First name'}
                            rules={{
                                required: 'First name is required',
                            }}
                            style={styles.input}
                        />
                        <CustomTextInput
                            name='lastName'
                            control={control} 
                            placeholder={'Last Name'}
                            rules={{
                                required: 'Last name is required',
                            }}
                            style={styles.input}        
                        />
                        <CustomTextInput
                            name='email'
                            control={control}
                            placeholder={'Email'}
                            rules={{
                                required: 'Email is required',
                            }}
                            style={styles.input}
                        />
                        <CustomTextInput
                            name='password'
                            control={control}
                            placeholder={'Password'}
                            secureTextEntry={true}
                            rules={{
                                required: 'Password is required',
                            }}
                        style={styles.input}
                        />
                        <CustomTextInput
                            name='retypePassword'
                            control={control}
                            placeholder={'Retype Password'}
                            secureTextEntry={true}
                            rules={{
                                required: 'Retype Password is required',
                                validate: value => value === passwd ? true : 'Password do not match'
                            }}
                        style={styles.input}
                        />
                        <View style={styles.checkbox}>
                            <Text style={styles.text}>Create coach account?</Text>
                            <CustomCheckbox
                                name='isCoach'
                                control={control}
                            />
                        </View>
                        <WideButton
                            text='Register' 
                            style={styles.button}
                            onPress={handleSubmit(handleRegister)} 
                        />
                        <TextButton
                            text='Already have account? Sign In ➔'
                            style={styles.textButton}
                            onPress={() => goToSignInScreen()}
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
    textButton:{
        padding: SIZES.small,
        fontWeight: 'bold',
        color: COLORS.white,
        fontSize: 16 ,
    },
    checkbox: {
        marginTop: SIZES.font,
        flexDirection: 'row',
    },
    text:{
        fontWeight: 'bold',
        color: COLORS.white,
        fontSize: 16,
        paddingTop: SIZES.small,
        paddingRight: SIZES.font,
    }
    
});

export default RegisterScreen