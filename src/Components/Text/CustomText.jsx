// src/components/Text.jsx
import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

// Busca e atualiza as fontes no App
const getFontFamilyByWeight = (fontWeight) => {
    if (!fontWeight) return 'Alexandria-Regular'

    if (fontWeight === 'bold' || fontWeight === 700 || fontWeight === 800 || fontWeight === 900){
        return 'Alexandria-Bold'
    }

    if (fontWeight === 'semibold' || fontWeight === 600){
        return 'Alexandria-SemiBold'
    }

    if (fontWeight === 500){
        return 'Alexandria-Medium'
    }

    if (fontWeight === 'light' || fontWeight === 100 || fontWeight === 200 || fontWeight === 300){
        return 'Alexandria-Light'
    }

    return 'Alexandria-Regular'
}

const CustomText = ({ style, ...props }) => {
  const { colors } = useTheme()

  // Converte arrays de estilo em um objeto simples para ler o fontWeight
  const flattenedStyle = style ? StyleSheet.flatten(style) : {};
  const resolvedFontFamily = getFontFamilyByWeight(flattenedStyle.fontWeight);

  return (
    <RNText
      {...props}
      style={[
        { 
          fontFamily: resolvedFontFamily,
          color: colors.text
        }, // Injeta a variação correta da fonte
        style // Mantém todo o resto
      ]}
    />
  );
}

export default CustomText