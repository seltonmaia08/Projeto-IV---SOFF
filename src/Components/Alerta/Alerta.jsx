import { useEffect, useRef, useCallback } from 'react';
import { reminderService } from '../../Services/api';
import { supabase } from '../../Utils/Supabase';
import AlertaGeral from './AlertaGeral';

const NotificationWatcher = ({ idProject }) => {
    // Mantém os lembretes em memória para verificação instantânea sem travamentos de rede
    const lembretesRef = useRef([]);
    // Registra os alertas já disparados para evitar repetições
    const alertadosRef = useRef(new Set());

    // Busca os lembretes do projeto no banco de dados
    const carregarLembretes = useCallback(async () => {
        if (!idProject) return;
        try {
            const dados = await reminderService.getAllColumn('idProject', idProject);
            if (Array.isArray(dados)) {
                lembretesRef.current = dados;
            }
        } catch (error) {
            console.log("Erro ao carregar lembretes para o monitor:", error);
        }
    }, [idProject]);

    // 1. Sincroniza a lista de lembretes ao montar, em intervalo e via realtime
    useEffect(() => {
        carregarLembretes();

        // Atualiza os lembretes em segundo plano a cada 20 segundos
        const syncInterval = setInterval(() => {
            carregarLembretes();
        }, 20000);

        // Escuta novas adições ou edições em tempo real na tabela Reminder
        let subscription = null;
        try {
            subscription = supabase
                .channel(`reminder-watcher-${idProject}`)
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'Reminder', filter: `idProject=eq.${idProject}` },
                    () => {
                        carregarLembretes();
                    }
                )
                .subscribe();
        } catch (e) {
            console.warn("Aviso ao iniciar realtime de lembretes:", e);
        }

        return () => {
            clearInterval(syncInterval);
            if (subscription) {
                supabase.removeChannel(subscription);
            }
        };
    }, [idProject, carregarLembretes]);

    // 2. Monitoramento de tempo exato a cada 1 segundo diretamente na memória
    useEffect(() => {
        if (!idProject) return;

        const verificarTempoExato = () => {
            const lembretes = lembretesRef.current;
            if (!lembretes || lembretes.length === 0) return;

            const agora = new Date();
            const ano = agora.getFullYear();
            const mes = String(agora.getMonth() + 1).padStart(2, '0');
            const dia = String(agora.getDate()).padStart(2, '0');
            const dataHojeStr = `${ano}-${mes}-${dia}`;

            const horaAtual = agora.getHours();
            const minutoAtual = agora.getMinutes();

            lembretes.forEach(item => {
                if (!item.reminderDate || !item.reminderTime) return;

                // Se já estiver lido, não precisa alertar novamente
                if (item.read) return;

                const itemDataStr = String(item.reminderDate).split('T')[0].trim();

                if (itemDataStr === dataHojeStr) {
                    const partesHora = String(item.reminderTime).split(':').map(Number);
                    const horaLembrete = partesHora[0];
                    const minutoLembrete = partesHora[1];

                    // Verifica se a hora e minuto atuais coincidem exatamente com o lembrete
                    if (horaLembrete === horaAtual && minutoLembrete === minutoAtual) {
                        const chaveAlerta = `${item.idReminder || item.reminderTitle}_${dataHojeStr}_${horaLembrete}_${minutoLembrete}`;

                        // Se já disparou para esse lembrete neste horário, NÃO dispara novamente
                        if (alertadosRef.current.has(chaveAlerta)) {
                            return;
                        }

                        // Registra imediatamente no Set para bloquear repetições
                        alertadosRef.current.add(chaveAlerta);

                        // Dispara o alerta uma única vez
                        AlertaGeral.alert(
                            "🔔 Lembrete:",
                            `${item.reminderTitle || 'Lembrete'}\n\n${item.reminderText || 'Chegou a hora do seu compromisso!'}`,
                            [
                                {
                                    text: "OK",
                                    onPress: async () => {
                                        // Marca no banco como lido ao clicar em OK
                                        if (item.idReminder) {
                                            try {
                                                await reminderService.update(item.idReminder, { read: true }, 'idReminder');
                                                item.read = true;
                                            } catch (err) {
                                                console.log("Aviso ao marcar lembrete como lido:", err);
                                            }
                                        }
                                    }
                                }
                            ],
                            { cancelable: false }
                        );
                    }
                }
            });
        };

        // Executa imediatamente e inicia o intervalo de 1 segundo
        verificarTempoExato();
        const timer = setInterval(verificarTempoExato, 1000);

        return () => clearInterval(timer);
    }, [idProject]);

    return null;
};

export default NotificationWatcher;