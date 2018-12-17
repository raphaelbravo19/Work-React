import React, {Component} from 'react';
import {View} from 'react-native';
import {TextMontserrat, FloatingTextInput,} from 'components';

class CreateAccountForm extends Component {
    render() {
        return (
            <View style={styles.formContainer}>
                <View style={styles.nameInputs}>
                    <View style={{flex: 1}}>
                        <FloatingTextInput
                            label={'First Name'}
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <FloatingTextInput
                            label={'Last Name'}
                            lineLeft={true}
                        />
                    </View>
                </View>
                <View>
                    <FloatingTextInput
                        label={'E-mail'}
                        errors={['Enter a valid E-mail address']}
                    />
                </View>
                <View>
                    <FloatingTextInput
                        label={'Password'}
                        secureTextEntry={true}
                        validate={{
                            title: 'Password must contain',
                            validations: [
                                {
                                    name: '8 Characters',
                                    validateInput: (val) => {
                                        return val.length > 8;
                                    }
                                },
                                {
                                    name: '1 Number',
                                    validateInput: (val) => {
                                        return /\d/.test(val);
                                    }
                                },
                                {
                                    name: '1 Special Character',
                                    validateInput: (val) => {
                                        return /\W+/.test(val);
                                        }
                                }
                            ]
                        }}
                    />
                </View>
                <View>
                    <FloatingTextInput
                        label={'Mobile Number'}
                    />
                </View>
                <View>
                    <FloatingTextInput
                        label={'Company Name'}
                        labelOptional={'(Optional)'}
                    />
                </View>
                <View>
                    <FloatingTextInput
                        label={'Refferal Code'}
                        labelOptional={'(Optional)'}
                    />
                </View>
            </View>
        )
    }
}

const styles = {
    nameInputs: {
        flexDirection: 'row',
    }
}

export default CreateAccountForm;