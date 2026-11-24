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

            // 4. Busca os dados dos perfis diretamente pela coluna 'id' em Profiles
            let profilesMap = {};
            if (userIdsToFetch.size > 0) {
                const idsArray = Array.from(userIdsToFetch);

                const { data: profilesData, error: profError } = await supabase
                    .from('Profiles')
                    .select('*')
                    .in('id', idsArray);

                if (profError) {
                    console.warn('Aviso ao consultar Profiles:', profError);
                }

                if (profilesData && profilesData.length > 0) {
                    profilesData.forEach(p => {
                        const uid = p.id || p.idUser;
                        if (uid) {
                            profilesMap[uid] = {
                                ...p,
                                userName: p.name || p.userName || "Sem nome",
                                name: p.name || p.userName || "Sem nome",
                                email: p.email || ""
                            };
                        }
                    });
                }
            }

            // 5. Dados do Proprietário
            let ownerMemberRow = null;
            if (ownerId) {
                const ownerProfile = profilesMap[ownerId] || {};
                ownerMemberRow = memberList.find(m => m.idUser === ownerId);
                const cargoDono = ownerMemberRow?.cargo || ownerMemberRow?.position || "Proprietário";

                setOwner({
                    idUser: ownerId,
                    userName: ownerProfile.name || ownerProfile.userName || "Proprietário",
                    email: ownerProfile.email || "",
                    avatar: ownerProfile.avatar || ownerProfile.avatar_url || ownerProfile.photoUrl || null,
                    cargo: cargoDono
                });
            } else {
                setOwner(null);
            }

            // 6. Lista de Membros (inclui o dono do projeto e deduplica por idUser)
            const seenUserIds = new Set();
            const participantesFormatados = [];

            // Se existir dono, inclui na lista de membros para que possa participar de departamentos
            if (ownerId) {
                seenUserIds.add(ownerId);
                const ownerProfile = profilesMap[ownerId] || {};
                const cargoDono = ownerMemberRow?.cargo || ownerMemberRow?.position || "Proprietário";

                participantesFormatados.push({
                    idProjectMember: ownerMemberRow?.idProjectMember || null,
                    idUser: ownerId,
                    cargo: cargoDono,
                    isOwner: true,
                    User: {
                        userName: ownerProfile.name || ownerProfile.userName || "Proprietário",
                        email: ownerProfile.email || "Sem e-mail",
                        avatar: ownerProfile.avatar || ownerProfile.avatar_url || ownerProfile.photoUrl || null
                    }
                });
            }

            // Adiciona os demais membros sem duplicar por idUser (caso estejam em múltiplos departamentos)
            memberList.forEach(m => {
                if (m.idUser && !seenUserIds.has(m.idUser)) {
                    seenUserIds.add(m.idUser);
                    const perfil = profilesMap[m.idUser] || {};
                    const cargoMembro = m.cargo || m.position || "Participante";

                    participantesFormatados.push({
                        idProjectMember: m.idProjectMember,
                        idUser: m.idUser,
                        cargo: cargoMembro,
                        isOwner: false,
                        User: {
                            userName: perfil.name || perfil.userName || "Sem nome",
                            email: perfil.email || "Sem e-mail",
                            avatar: perfil.avatar || perfil.avatar_url || perfil.photoUrl || null
                        }
                    });
                }
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
