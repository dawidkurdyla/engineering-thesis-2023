import React from 'react'
import { View, Text, TextInput, StyleSheet, Image } from 'react-native'
import { Controller } from 'react-hook-form'
import Checkbox from 'expo-checkbox';
import Ionicons from '@expo/vector-icons/Ionicons'
import SelectDropdown from 'react-native-select-dropdown'
import { SelectList } from 'react-native-dropdown-select-list'
import DatePicker from 'react-native-date-picker'

import { COLORS, FONTS, SIZES, assets, SHADOWS } from '../constants'
import { render } from 'react-dom';
import { IconButton } from './Button';

// Custom input for hook forms
export const CustomTextInput = ({ name, control, placeholder, rules = {}, secureTextEntry, style, multiline, keyboardType }) => {

    return (
      <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { value, onChange, onBlur}, fieldState: {error} }) => (
                <>
                    <View 
                        style={[
                            styles.container,
                            {borderWidth: error ? 2 : 1, 
                            borderColor: error ? 'red' : COLORS.border},
                            style,
                        ]}
                    >
                        <TextInput
                            multiline={multiline}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            secureTextEntry={secureTextEntry}
                            placeholderTextColor={error ? 'red' : COLORS.lightGray}
                            keyboardType={keyboardType}
                        />
                    </View>
                    
                    {error && (
                        <Text style={{color: 'red', alignSelf: 'stretch'}}> {error.message || 'Error'} </Text>
                    )}
                </>

            )}
        />
    )
}

export const MyTextInput = ({ placeholder, style, textStyle, multiline, value, onChange, editable, keyboardType }) => {

    return (
        <View
            style={[
                styles.container,
                style,
            ]}
        >
            <TextInput
                multiline={multiline}
                value={value}
                onChangeText={onChange}
                style={textStyle}
                placeholder={placeholder}
                placeholderTextColor={COLORS.lightGray}
                editable={editable}
                keyboardType={keyboardType}
            />
        </View>
    )
}

export const MessageInput = (props) => {

    return (
        <View>
            <View style={styles.messageInputCont}>
                <IconButton
                    icon={props.image 
                        ? <Image
                            source={{ uri: props.image }}
                            style={{ width: 40, height: 40, borderRadius:10, borderWidth:2, borderColor: COLORS.black}}
                            resizeMode='cover'
                        />
                        : <Ionicons name='image-outline' color={'black'} size={30} />
                    }
                    onPress={props.onImagePress}
                    onLongPress={props.onLongImagePress}
                    style={props.image ? { padding: 2 } : { padding: 5 }}
                />
                <TextInput
                    multiline={props.multiline}
                    value={props.value}
                    onChangeText={props.onChangeText}
                    textStyle={props.textStyle}
                    placeholder={props.placeholder}
                    placeholderTextColor={COLORS.lightGray}
                    style={styles.messageInput}
                />
                <IconButton
                    icon={<Ionicons name='send-outline' color={'black'} size={30} />}
                    onPress={() => props.onSendPress()}
                    style={{padding: 5}}
                />
            </View>
        </View>
    )
}


export const CustomCheckbox = ({ name, control, style }) => {
  return (
      <Controller
          control={control}
          name={name}
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <>
                  <View>
                      <Checkbox
                          style={[styles.checkbox, style]}
                          value={value}
                          onValueChange={onChange}
                          color={value ? COLORS.cyan : COLORS.white}
                      />
                  </View>
              </>

          )}
      />
  )
}


export const CustomDropdown = (props) => {

    return (
        <Controller
            control={props.control}
            name={props.name}
            rules={props.rules}
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <View style={props.style}>
                    <SelectList
                        data={props.data}
                        boxStyles={styles.dropdown}
                        dropdownStyles={styles.dropdown}
                        setSelected={onChange}
                        placeholder={props.placeholder}
                        dropdownItemStyles={{borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingHorizontal: 5, paddingVertical: 5, marginHorizontal: 10}}
                        save={props.save}
                        onBlur={onBlur}
                       
                    />
                    {error && (
                        <Text style={{ color: 'red', alignSelf: 'stretch' }}> {error.message || 'Error'} </Text>
                    )}
                </View>

            )}
        />
    )
}

export const CustomSearchBox = (props) => {

    return(
        <View style={{ marginTop: SIZES.font }}>
            <View
                style={{
                    width: '100%',
                    backgroundColor: 'rgba(191, 191, 191, 0.5)',
                    borderRadius: SIZES.font,
                    flexDirection: "row",
                    alignItems: 'center',
                    paddingHorizontal: SIZES.font,
                    paddingVertical: SIZES.font,
                    ...props.style
                }}
            >
                <TextInput
                    placeholder={props.placeholder}
                    style={{ flex: 1 }}
                    onChangeText={(value) => props.onChangeText(value)}
                />
                <IconButton
                    onPress={() => props.onPress()}
                    icon={<Ionicons name='search-outline' color={'white'} size={22} />}
                />
            </View>
        </View>
    )
}

export const CustomDatePicker = (props) => {
    return (
        <Controller
            control={props.control}
            name={props.name}
            rules={props.rules}
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <View style={styles.container}>
                    <DatePicker
                        mode="datetime"
                        date={props.date}
                        onDateChange={(date) => {
                            onChange(date);
                            props.onDateChange();
                        }}

                    />
                    {error && (
                        <Text style={{ color: 'red', alignSelf: 'stretch' }}> {error.message || 'Error'} </Text>
                    )}
                </View>

            )}
        />
    )
}




const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: SIZES.font,
        paddingHorizontal: SIZES.font,
        paddingVertical: SIZES.font,
        ...SHADOWS.black
    },
    checkbox: {
        backgroundColor: COLORS.white,
        borderColor: COLORS.border,
        borderWidth: 3,
        borderRadius: SIZES.font,
        paddingHorizontal: SIZES.large,
        paddingVertical: SIZES.large,
        ...SHADOWS.black
    },
    dropdown:{
        width: '100%',
        backgroundColor: COLORS.white,
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: SIZES.font,
        paddingVertical: SIZES.large,
        ...SHADOWS.black,   
    },
    messageInputCont : {
        backgroundColor: COLORS.border,
        flexDirection: 'row',
        padding: 1, 
        justifyContent: 'space-evenly', 
        alignItems: 'flex-end',
        padding: 5,
        marginTop: 10,
    },
    messageInput : {
        width: '70%',
        backgroundColor: COLORS.white,
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: SIZES.extraLarge,
        paddingHorizontal: SIZES.base,
        paddingVertical: 8,
    }

   
})