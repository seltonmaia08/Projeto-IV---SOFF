import { useEffect } from 'react';
import { Alert } from 'react-native';
import { reminderService } from '../../Services/api';

const NotificationWatcher = ({ idProject }) => {
    console.log(idProject)
    useEffect(() => {
        const checarLembretesPendentes = async () => {
            try {
                const lembretes = await reminderService.getAllColumn('idProject', idProject);
                
                if (!lembretes || lembretes.length === 0) return;

                const agora = new Date();
                
                const ano = agora.getFullYear();
                const mes = String(agora.getMonth() + 1).padStart(2, '0');
                const dia = String(agora.getDate()).padStart(2, '0');
                const dataHojeStr = `${ano}-${mes}-${dia}`;

                
                const horaAtual = agora.getHours();
                const minutoAtual = agora.getMinutes();

              
                lembretes.forEach(item => {
                    if (item.reminderDate === dataHojeStr) {
                       
                        if (item.reminderTime) {
                            const [horaLembrete, minutoLembrete] = item.reminderTime.split(':').map(Number);

                           
                            if (horaLembrete === horaAtual && minutoLembrete === minutoAtual) {
                                
                                
                                Alert.alert(
                                    "🔔 Lembrete:",
                                    `${item.reminderTitle}\n\n${item.reminderText || 'Chegou a hora do seu compromisso!'}`,
                                    [{ text: "OK" }]
                                );
                            }
                        }
                    }
                });

            } catch (error) {
                console.log("Erro ao verificar lembretes:", error);
            }
        };

       checarLembretesPendentes();

        const intervalo = setInterval(() => {
            checarLembretesPendentes();
        }, 50000);

        return () => clearInterval(intervalo);
    }, [idProject]);

    return null;
};

export default NotificationWatcher;