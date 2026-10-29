// import * as Notifications from 'expo-notifications'
// import { Platform } from 'react-native'

// try {
//     Notifications.setNotificationHandler({
//         handleNotification: async () => ({
//             shouldShowAlert: true,
//             shouldPlaySound: false,
//             shouldSetBadge: true,
//         })
//     })
// } catch (e) {
//     console.log("Configuração de notificação não suportada neste ambiente.");
// }

// async function getPermissions() {
//     if (Platform.OS === 'web') return false;

//     try {
//         const { status: existingStatus } = await Notifications.getPermissionsAsync()
//         let finalStatus = existingStatus

//         if (existingStatus !== 'granted') {
//             const { status } = await Notifications.requestPermissionsAsync()
//             finalStatus = status
//         }

//         if (finalStatus !== 'granted') {
//             return false
//         }

//         return true
//     } catch (error) {
//         console.log("Permissões de notificação indisponíveis:", error);
//         return false;
//     }
// }

// export const setNotificationReminder = async (title, dateTime) => {
//     if (Platform.OS === 'web') return;

//     try {
//         const permission = await getPermissions()
//         if (!permission) return

//         await Notifications.scheduleNotificationAsync({
//             content: {
//                 title: title,
//                 body: 'Não esqueça suas tarefas',
//                 sound: false
//             },
//             trigger: dateTime
//         })

//         console.log("Notificação agendada para:", dateTime);
//     } catch (error) {
//         console.log("Aviso: Não foi possível agendar a notificação localmente:", error.message);
//     }
// }