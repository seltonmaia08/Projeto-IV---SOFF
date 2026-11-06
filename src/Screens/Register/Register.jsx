import {
    Image,
    TextInput,
    View,
    StyleSheet,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    ScrollView,
    Keyboard
} from 'react-native'
import CustomText from '../../Components/Text/CustomText'
import { useState } from 'react'
import { EyeClosed, Eye } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

// IMAGEM
import Logo from '../../../assets/logo.svg';
import { supabase } from '../../Utils/Supabase';
import Top from '../TopAba/Top';

const Register = () => {

    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirPass, setConfirPass] = useState('')
    const [visible, setVisible] = useState(true)
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation()

    //Tratar erros
    const [isValid, setIsValid] = useState(true)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState('')

    const validEmail = (text) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        setEmail(text)

        if (text === '') {
            setIsValid(true)
        } else {
            setIsValid(emailRegex.test(text))
        }
    }

    const senhasIguais = password.length >= 6 && password === confirPass;

    const formularioValido =
        name.trim().length > 0 &&
        lastname.trim().length > 0 &&
        email.trim().length > 0 &&
        isValid &&
        password.length >= 6 &&
        senhasIguais &&
        !loading;

    const register = async () => {
        console.log('autenticando...')
        if (!email || !password) {
            alert('preencha os dados')
            return
        }
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        userName: `${name} ${lastname}`.trim()
                    }
                }
            })

           if (error) {
            setError(true);
            if (error.message.includes('already registered') || error.status === 422) {
                setMessage('Este e-mail já está cadastrado. Faça login ou use outro e-mail.');
            } else {
                setMessage(error.message || 'Ocorreu um erro ao criar a conta.');
            }
            return;
        }
        
        if (data?.user?.identities && data.user.identities.length === 0) {
            setError(true);
            setMessage('Este e-mail já está cadastrado. Faça login ou recupere sua senha.');
            return;
        }
        } catch (error) {
            console.log("Erro na autenticação do usuário: ", error)
        }


    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%'}}>
            <Top abaName={"Cadastro"} voltar={true} voltarOn={() => navigation.navigate('Login')}/>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.innerContainer}>
                    <View style={styles.container}>
                        {
                            error &&
                            <View style={styles.error}>
                                <CustomText>{message}</CustomText>
                            </View>
                        }
                        <View style={styles.logo}>
                            <Logo width={164} height={48} />
                        </View>
                        <View style={styles.cardRegister}>
                            <View style={styles.items}>
                                <CustomText style={styles.label}>
                                    Nome
                                </CustomText>
                                <TextInput
                                    style={styles.input}
                                    keyboardType='default'
                                    placeholder='José'
                                    value={name}
                                    onChangeText={setName}
                                    autoCorrect={false}

                                />
                            </View>
                            <View style={styles.items}>
                                <CustomText style={styles.label}>
                                    Sobrenome
                                </CustomText>
                                <TextInput
                                    style={styles.input}
                                    keyboardType='default'
                                    placeholder='Silva'
                                    value={lastname}
                                    onChangeText={setLastname}
                                    autoCorrect={false}
                                />
                            </View>
                            <View style={styles.items}>
                                <CustomText style={styles.label}>
                                    E-mail
                                </CustomText>
                                <TextInput
                                    style={isValid ? styles.input : styles.inputError}
                                    keyboardType='email-address'
                                    placeholder='exemplo@email.com'
                                    value={email}
                                    onChangeText={validEmail}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                />
                            </View>
                            <View style={styles.items}>
                                <CustomText style={styles.label}>
                                    Senha
                                </CustomText>
                                <View style={{ justifyContent: 'space-around', alignItems: 'center' }}>

                                    <TextInput
                                        style={styles.input}
                                        keyboardType='default'
                                        secureTextEntry={visible}
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                    {
                                        visible ?
                                            <TouchableOpacity
                                                style={styles.btnEye}
                                                onPress={() => setVisible(false)}
                                            >
                                                <EyeClosed size={24} color={'#313131'} />
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity
                                                style={styles.btnEye}
                                                onPress={() => setVisible(true)}
                                            >
                                                <Eye size={24} color={'#313131'} />
                                            </TouchableOpacity>
                                    }
                                </View>
                                <CustomText style={[styles.label, { fontSize: 11 }]}>
                                    Min: 6 digitos
                                </CustomText>
                            </View>
                            <View style={styles.items}>
                                <CustomText style={styles.label}>
                                    Confirmar Senha
                                </CustomText>
                                <View style={{ justifyContent: 'space-around', alignItems: 'center' }}>

                                    <TextInput
                                        style={confirPass.length > 0 && !senhasIguais ? styles.inputError : styles.input}
                                        keyboardType='default'
                                        secureTextEntry={visible}
                                        value={confirPass}
                                        onChangeText={setConfirPass}
                                    />
                                    {
                                        visible ?
                                            <TouchableOpacity
                                                style={styles.btnEye}
                                                onPress={() => setVisible(false)}
                                            >
                                                <EyeClosed size={24} color={'#313131'} />
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity
                                                style={styles.btnEye}
                                                onPress={() => setVisible(true)}
                                            >
                                                <Eye size={24} color={'#313131'} />
                                            </TouchableOpacity>
                                    }
                                </View>
                            </View>
                        </View>
                        <View style={styles.area1}>
                            <TouchableOpacity style={
                                !formularioValido ? styles.btnRegisterDisabled : styles.btnRegister
                            } onPress={register}
                                disabled={!formularioValido}
                            >
                                {loading ? (
                                    <ActivityIndicator size="large" color="#DAD0B7" />
                                ) : (
                                    <CustomText style={styles.textBtnRegister}>Cadastrar e Entrar</CustomText>
                                )}
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView >
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 20,
        paddingTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 50
    },
    innerContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    logo: {
        marginTop: 20,
        marginBottom: 50
    },
    cardRegister: {
        width: '80%',
        height: 'auto',
        gap: 20,
        padding: 10,

    },
    items: {
        gap: 10
    },

    input: {
        height: 50,
        width: '100%',
        paddingHorizontal: 10,
        backgroundColor: '#DAD0B7',
        borderRadius: 15
    },
    inputError: {
        height: 50,
        width: '100%',
        paddingHorizontal: 10,
        backgroundColor: '#DAD0B7',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#EF5825'
    },
    btnRegister: {
        width: '60%',
        height: 50,
        backgroundColor: '#116646',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnRegisterDisabled: {
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
        height: 50,
        backgroundColor: '#5F5F5F',
    },
    textBtnRegister: {
        textTransform: 'uppercase',
    },
    btnEye: {
        position: 'absolute',
        width: 26,
        height: 26,
        right: 20

    },
    area1: {
        width: '100%',
        alignItems: 'center',
        gap: 50
    },
    error: {
        width: '80%',
        height: 'auto',
        padding: 10,
        borderColor: '#EF5825',
        borderLeftWidth: 10,
        borderRadius: 15,
        backgroundColor: '#ef582540',
        position: 'absolute',
        top: 150

    }
})