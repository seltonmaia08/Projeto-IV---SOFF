import React, { useState } from 'react'
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import CustomText from '../../Components/Text/CustomText'
import { supabase } from '../../Utils/Supabase'
import { useNavigation } from '@react-navigation/native'
import Top from '../TopAba/Top'

const RedefinirSenha = () => {
  const navigation = useNavigation()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Etapa 1: Enviar código para o e-mail
  const handleSendToken = async () => {
    if (!email) {
      Alert.alert('Atenção', 'Informe o seu e-mail.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    setLoading(false)
    if (error) {
      Alert.alert('Erro', error.message)
    } else {
      Alert.alert('Código Enviado', 'Verifique sua caixa de entrada e digite o código de 6 dígitos.')
      setStep(2)
    }
  }
  // Etapa 2: Validar o código e salvar a nova senha
  const handleReset = async () => {
    if (!token || !newPassword) {
      Alert.alert('Atenção', 'Preencha o código e a nova senha.')
      return
    }
    setLoading(true)
    try {
      // Verifica o código OTP
      const { error: otpError } = await supabase.auth.verifyOtp({
        email,
        token: token.trim(),
        type: 'recovery',
      })
      if (otpError) throw otpError
      // Atualiza a senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (updateError) throw updateError
      Alert.alert('Sucesso', 'Sua senha foi redefinida com sucesso!')
      navigation.navigate('Login')
    } catch (err) {
      Alert.alert('Erro', err.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <View style={styles.container}>
      <Top abaName="Recuperar Senha" voltar={true}/>
      <View style={styles.content}>
        {step === 1 ? (
          <>
            <CustomText style={styles.instruction}>
              Digite seu e-mail cadastrado para enviarmos o código de recuperação:
            </CustomText>
            <TextInput
              style={styles.input}
              placeholder="exemplo@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.btn} onPress={handleSendToken} disabled={loading}>
              {loading ? <ActivityIndicator color="#DAD0B7" /> : <CustomText style={styles.btnText}>Enviar Código</CustomText>}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <CustomText style={styles.instruction}>
              Digite o código recebido no e-mail e a sua nova senha:
            </CustomText>
            <TextInput
              style={styles.input}
              placeholder="Código de 6 dígitos"
              keyboardType="number-pad"
              value={token}
              onChangeText={setToken}
            />
            <TextInput
              style={styles.input}
              placeholder="Nova senha"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity style={styles.btn} onPress={handleReset} disabled={loading}>
              {loading ? <ActivityIndicator color="#DAD0B7" /> : <CustomText style={styles.btnText}>Redefinir Senha</CustomText>}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  )
}
export default RedefinirSenha
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#242424' },
  content: { padding: 25, gap: 20, alignItems: 'center', marginTop: 40 },
  instruction: { textAlign: 'center', marginBottom: 10 },
  input: {
    height: 50,
    width: '100%',
    paddingHorizontal: 15,
    backgroundColor: '#DAD0B7',
    borderRadius: 15,
  },
  btn: {
    width: '70%',
    height: 50,
    backgroundColor: '#116646',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  btnText: { textTransform: 'uppercase', fontWeight: 'bold' },
})