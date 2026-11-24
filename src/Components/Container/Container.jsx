import { ScrollView, View } from 'react-native'

const Container = ({ children, style }) => {
    return (
            <View style={[
                {
                    flex: 1,
                    paddingHorizontal: 20,
                    paddingTop: 15,
                },
                style
            ]}>
                {children}
            </View>
    )
}

export default Container