import { Image, TextInput, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import CustomText from '../../Components/Text/CustomText'
import { useState } from 'react'
import { EyeClosed, Eye } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

// IMAGEM
import Logo from '../../../assets/logo.svg';
import { supabase } from '../../Utils/Supabase';

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [visible, setVisible] = useState(true)
    const [loading, setLoading] = useState(false)
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

    const formularioValido =
        email.trim().length > 0 &&
        isValid &&
        password.length >= 6 &&
        !loading;

    const login = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            if (error) {
                setError(true)
                setLoading(false)
                setMessage('E-mail ou Senha invalidos. Por favor, tente novamente!')
            }
        } catch (error) {
            console.log("Erro na autenticação do usuário: ", error)
        }
        finally {
            setLoading(false)
        }


    }

    return (
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
            <View style={styles.cardLogin}>
                <View style={styles.items}>
                    <CustomText style={styles.label}>
                        E-mail
                    </CustomText>
                    <TextInput
                        style={!isValid ? styles.inputError : styles.input}
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
                            autoCorrect={false}
                        />
                        {

                            visible
                                ?
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
                    <TouchableOpacity onPress={() => navigation.navigate('RedefinirSenha')}>
                        <CustomText>Esqueci minha senha</CustomText>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.area1}>
                <TouchableOpacity
                    style={!formularioValido ? styles.btnLoginDisabled : styles.btnLogin}
                    onPress={login}
                    disabled={!formularioValido}
                >
                    {loading ? (
                        <ActivityIndicator size="large" color="#DAD0B7" />
                    ) : (
                        <CustomText style={styles.textBtnLogin}>Acessar</CustomText>
                    )}
                </TouchableOpacity>
                <View style={{ alignItems: 'center', gap: 10 }}>
                    <CustomText>Ainda não tem uma conta?</CustomText>
                    <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                        <CustomText style={[styles.textBtnLogin, { color: '#DAB16B' }]}>Cadastre-se</CustomText>
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
        alignItems: 'center',
        gap: 50
    },
    logo: {
        marginTop: 100,
        marginBottom: 50
    },
    cardLogin: {
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
    btnLogin: {
        width: '60%',
        height: 50,
        backgroundColor: '#116646',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnLoginDisabled: {
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
        height: 50,
        backgroundColor: '#5F5F5F',
    },
    btnRegister: {
        width: '60%',
        height: 50,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textBtnLogin: {
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
        top: 220

    }
})