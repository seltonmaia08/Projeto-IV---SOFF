import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Container = ({ children, style }) => {
    return (
        <SafeAreaView>
            <View style={[
                { flex: 1, paddingHorizontal: 20, paddingTop: 15, },
                style
            ]}>
                {children}
            </View>
        </SafeAreaView>
    )
}

export default Container