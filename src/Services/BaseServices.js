import { supabase } from "../Utils/Supabase";

// Limite de segurança de 8 segundos para evitar que requisições fiquem travadas indefinidamente
const withTimeout = (promise, ms = 8000) => {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Tempo limite de resposta do Supabase excedido (8s).')), ms)
        )
    ]);
};

export const BaseServices = (tableName) => ({
    // Inserir dados em uma tabela
    async create(data) {
        const query = supabase
            .from(tableName)
            .insert([data])
            .select();

        const { data: result, error } = await withTimeout(query);

        if (error) throw error;
        return result?.[0] || data;
    },

    // Ler todos os dados da tabela
    async getAll(options = {orderBy: 'created_at', ascending: false}) {
        let query = supabase
            .from(tableName)
            .select('*');

        if (options?.orderBy) {
            query = query.order(options.orderBy, { ascending: options.ascending ?? false });
        }

        const { data, error } = await withTimeout(query);

        if (error && error.code === '42703' && options?.orderBy) {
            // Se a coluna de ordenação não existir, tenta sem ordenação
            const { data: d2, error: e2 } = await withTimeout(supabase.from(tableName).select('*'));
            if (e2) throw e2;
            return d2 || [];
        }

        if (error) throw error;
        return data || [];
    },

    // Ler apenas uma linha
    async getById(id) {
        const query = supabase
            .from(tableName)
            .select('*')
            .eq('id', id)
            .single();

        const { data, error } = await withTimeout(query);

        if (error) throw error;
        return data;
    },

    // Atualizar os dados em uma tabela
    async update(id, updates, idColumn = null) {
        const colId = idColumn ?? ('id' + tableName);
        const query = supabase
            .from(tableName)
            .update(updates)
            .eq(colId, id)
            .select();

        const { data, error } = await withTimeout(query);

        if (error) throw error;
        return data?.[0] || updates;
    },

    // Deletar dados em uma tabela
    async delete(id, idColumn = null) {
        const colId = idColumn ?? ('id' + tableName);
        const query = supabase
            .from(tableName)
            .delete()
            .eq(colId, id);

        const { data, error } = await withTimeout(query);

        if (error) throw error;
        return true;
    },

    async getAllColumn(columnName, value, options = {orderBy: 'created_at', ascending: false}) {
        let query = supabase
            .from(tableName)
            .select('*')
            .eq(columnName, value);

        if (options?.orderBy) {
            query = query.order(options.orderBy, { ascending: options.ascending ?? false });
        }

        const { data, error } = await withTimeout(query);

        if (error && error.code === '42703' && options?.orderBy) {
            // Se a coluna de ordenação não existir, busca sem ordenação
            const { data: d2, error: e2 } = await withTimeout(
                supabase.from(tableName).select('*').eq(columnName, value)
            );
            if (e2) throw e2;
            return d2 || [];
        }

        if (error) throw error;
        return data || [];
    },
});