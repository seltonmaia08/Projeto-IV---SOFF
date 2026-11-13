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
            setIsValid(emailRegex.test(text.trim()))
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
            setError(false)
            setMessage('')

            const cleanEmail = email.trim().toLowerCase()
            const cleanPassword = password

            const { data, error } = await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password: cleanPassword
            })

            if (error) {
                console.log("Erro detalhado do login:", error)
                setError(true)
                if (error.message.includes('Email not confirmed')) {
                    setMessage('E-mail ainda não confirmado. Verifique seu e-mail ou desative a confirmação de e-mail no painel do Supabase.')
                } else if (error.message.includes('Invalid login credentials')) {
                    setMessage('E-mail ou senha incorretos. Por favor, tente novamente.')
                } else {
                    setMessage(error.message || 'Erro ao realizar login.')
                }
            }
        } catch (error) {
            console.log("Erro na autenticação do usuário: ", error)
            setError(true)
            setMessage('Ocorreu um erro inesperado ao fazer login.')
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
                    !formularioValido ? styles.btnLoginDisabled : styles.btnLogin
                } onPress={login}
                    disabled={!formularioValido}
                >
                    {loading ? (
                        <ActivityIndicator size="large" color="#DAD0B7" />
                    ) : (
                        <CustomText style={styles.textBtnLogin}>Entrar</CustomText>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnText} onPress={() => navigation.navigate('RedefinirSenha')}>
                    <CustomText style={styles.textBtn}>Esqueci minha senha</CustomText>
                </TouchableOpacity>

            </View>

            <View style={styles.area2}>
                <TouchableOpacity style={styles.btnText} onPress={() => navigation.navigate('Register')}>
                    <CustomText style={styles.textBtn}>Não possui uma conta? <CustomText style={styles.span}>Cadastre-se</CustomText></CustomText>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
        backgroundColor: '#242424',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 50
    },
    logo: {
        marginTop: 20,
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
    textBtnLogin: {
        textTransform: 'uppercase',
    },
    textBtn: {
        fontSize: 12
    },
    span: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#EF5825'
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
        gap: 20
    },
    area2: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 50
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
