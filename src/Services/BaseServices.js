import { supabase } from "../Utils/Supabase";

export const BaseServices = (tableName) => ({
    // Inserir dados em uma tabela
    async create(data) {
        const {data: result, error} = await supabase
            .from(tableName)
            .insert([data])
            .select()

        if (error) throw error;
        return result[0]
    },


    // Ler todos os dados da tabela
    async getAll(options = {orderBy: 'created_at', ascending: false}) {
        const {data, error } = await supabase
            .from(tableName)
            .select('*')
            .order(options.orderBy, { ascending: options.ascending })

        if (error) throw error
        return data
    },

    // Ler apenas uma linha
    async getById(id) {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    // Atualizar os dados em uma tabela
    async update(id, updates) {
        const { data, error } = await supabase
            .from(tableName)
            .update(updates)
            .eq('id', id)
            .select()

        if (error) throw error
        return data[0]
    },

    // Deletar dados em uma tabela
    async delete(id) {
        const { data, error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    }
})