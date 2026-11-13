import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../Utils/Supabase';

export const useMembers = (idProject) => {
    const [owner, setOwner] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [linkInvitation, setLinkInvitation] = useState('');

    const fetchMembers = useCallback(async () => {
        if (!idProject) return;

        try {
            setLoading(true);
            setError(null);

            // 1. Busca os dados do Projeto (idUser do dono e linkInvitation)
            const { data: project, error: projectError } = await supabase
                .from('Project')
                .select('idUser, linkInvitation')
                .eq('idProject', idProject)
                .single();

            if (projectError) throw projectError;
            setLinkInvitation(project?.linkInvitation || '');

            const ownerId = project?.idUser;

            // 2. Busca os membros associados ao projeto na tabela ProjectMember
            const { data: memberRows, error: membError } = await supabase
                .from('ProjectMember')
                .select('*')
                .eq('idProject', idProject);

            if (membError) {
                console.warn('Aviso ao buscar ProjectMember:', membError);
            }

            const memberList = memberRows || [];

            // 3. Coleta os IDs de todos os usuários a serem consultados (membros + dono)
            const userIdsToFetch = new Set();
            if (ownerId) userIdsToFetch.add(ownerId);
            memberList.forEach(m => {
                if (m.idUser) userIdsToFetch.add(m.idUser);
            });

            // 4. Busca os dados dos perfis (tenta Profiles e caso necessário User)
            let profilesMap = {};
            if (userIdsToFetch.size > 0) {
                const idsArray = Array.from(userIdsToFetch);

                let { data: profilesData } = await supabase
                    .from('Profiles')
                    .select('*')
                    .in('idUser', idsArray);

                // Caso a coluna de id seja 'id' em vez de 'idUser'
                if (!profilesData || profilesData.length === 0) {
                    const fallbackId = await supabase
                        .from('Profiles')
                        .select('*')
                        .in('id', idsArray);
                    if (fallbackId.data && fallbackId.data.length > 0) {
                        profilesData = fallbackId.data;
                    }
                }

                // Fallback para a tabela User se Profiles não retornar registros
                if (!profilesData || profilesData.length === 0) {
                    const fallbackUser = await supabase
                        .from('User')
                        .select('*')
                        .in('idUser', idsArray);
                    if (fallbackUser.data && fallbackUser.data.length > 0) {
                        profilesData = fallbackUser.data;
                    }
                }

                if (profilesData) {
                    profilesData.forEach(p => {
                        const uid = p.idUser || p.id;
                        if (uid) profilesMap[uid] = p;
                    });
                }
            }

            // 5. Dados do Proprietário
            if (ownerId) {
                const ownerProfile = profilesMap[ownerId] || {};
                const ownerMemberRow = memberList.find(m => m.idUser === ownerId);
                setOwner({
                    idUser: ownerId,
                    userName: ownerProfile.userName || ownerProfile.name || "Proprietário",
                    email: ownerProfile.email || "",
                    avatar: ownerProfile.avatar || ownerProfile.avatar_url || ownerProfile.photoUrl || null,
                    cargo: ownerMemberRow?.cargo || "Proprietário"
                });
            } else {
                setOwner(null);
            }

            // 6. Lista de Participantes (todos os membros exceto o dono, para evitar duplicação)
            const participantesFormatados = memberList
                .filter(m => m.idUser !== ownerId)
                .map(m => {
                    const perfil = profilesMap[m.idUser] || {};
                    return {
                        idProjectMember: m.idProjectMember,
                        idUser: m.idUser,
                        cargo: m.cargo || "Participante",
                        User: {
                            userName: perfil.userName || perfil.name || "Sem nome",
                            email: perfil.email || "Sem e-mail",
                            avatar: perfil.avatar || perfil.avatar_url || perfil.photoUrl || null
                        }
                    };
                });

            setMembers(participantesFormatados);

        } catch (err) {
            setError(err);
            console.error('Erro ao buscar membros:', err);
        } finally {
            setLoading(false);
        }
    }, [idProject]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    return { owner, members, linkInvitation, loading, error, refetch: fetchMembers };
};
