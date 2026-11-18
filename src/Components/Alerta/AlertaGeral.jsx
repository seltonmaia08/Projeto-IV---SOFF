import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, Alert as NativeAlert } from 'react-native';
import { BlurView } from 'expo-blur';
import CustomText from '../Text/CustomText';

let globalAlertListener = null;

const AlertaGeral = ({ visivel, visible, title, mensagem, aoFechar, onClose, buttons, botoes }) => {
    const [localState, setLocalState] = useState({
        aberto: false,
        title: '',
        mensagem: '',
        buttons: null
    });

    useEffect(() => {
        globalAlertListener = (dados) => {
            setLocalState({
                aberto: true,
                title: dados.title || '',
                mensagem: dados.mensagem || '',
                buttons: dados.buttons || null
            });
        };
        return () => {
            globalAlertListener = null;
        };
    }, []);

    const isControlled = typeof visivel === 'boolean' || typeof visible === 'boolean';
    const isVisible = isControlled ? (visivel ?? visible) : localState.aberto;
    const currentTitle = isControlled ? title : localState.title;
    const currentMessage = isControlled ? mensagem : localState.mensagem;
    const currentButtons = isControlled ? (botoes ?? buttons) : localState.buttons;

    const handleClose = () => {
        if (isControlled) {
            if (aoFechar) aoFechar();
            if (onClose) onClose();
        } else {
            setLocalState(prev => ({ ...prev, aberto: false }));
        }
    };

    return (
        <Modal
            visible={!!isVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <BlurView style={styles.overlay} intensity={40} tint="dark">
                <View style={styles.contain}>
                    <View style={styles.textos}>
                        {!!currentTitle && (
                            <CustomText style={{ fontSize: 16, fontWeight: '900', color: '#242424' }}>
                                {currentTitle}
                            </CustomText>
                        )}
                        {!!currentMessage && (
                            <CustomText style={{ fontSize: 12, color: '#242424', marginTop: 4 }}>
                                {currentMessage}
                            </CustomText>
                        )}
                    </View>

                    <View style={styles.botoesArea}>
                        {Array.isArray(currentButtons) && currentButtons.length > 0 ? (
                            currentButtons.map((btn, index) => (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        handleClose();
                                        if (btn.onPress) btn.onPress();
                                    }}
                                    style={styles.botaoItem}
                                >
                                    <CustomText style={[
                                        styles.textoBotao,
                                        btn.style === 'destructive' && { color: '#EF5625' },
                                        btn.style === 'cancel' && { opacity: 0.7 }
                                    ]}>
                                        {btn.text || 'OK'}
                                    </CustomText>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={handleClose}
                                style={styles.botaoItem}
                            >
                                <CustomText style={styles.textoBotao}>OK</CustomText>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
};

AlertaGeral.alert = (title, mensagem, buttons) => {
    if (globalAlertListener) {
        globalAlertListener({ title, mensagem, buttons });
    } else {
        NativeAlert.alert(title, mensagem, buttons);
    }
};

export default AlertaGeral;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center"
    },
    contain: {
        width: 350,
        minHeight: 140,
        backgroundColor: '#DAD0B7',
        padding: 20,
        borderRadius: 20,
        justifyContent: 'space-between',
        gap: 15
    },
    textos: {
        gap: 6,
         justifyContent: 'center',
        alignItems: 'center'
    },
    botoesArea: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        marginTop: 10
    },
    botaoItem: {
        paddingVertical: 6,
        paddingHorizontal: 10
    },
    textoBotao: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#242424'
    }
});
