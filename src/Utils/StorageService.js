import { supabase } from "./Supabase";
import { File } from 'expo-file-system'

// async function uriToArrayBuffer(uri) {
//     const response = await fetch(uri)
//     return await response.arrayBuffer()
// }

export const StorageService = {
    async uploadImage(uri, bucket, folder) {
        // Caso a imagem já tenha sido enviada (já tem uma URL) Não envia
        if(uri.startsWith('http://') || uri.startsWith('https://')){
            return uri
        }

        const uniqueSuffix = Math.random().toString(36).substring(2, 8);
        const fileName = `${folder}/${Date.now()}_${uniqueSuffix}.jpg`;

        const file = new File(uri)
        const arrayBuffer = await file.arrayBuffer()

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, arrayBuffer, {
                contentType: 'image/jpeg',
                upsert: true
            })

        if (error) throw error

        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path)

        return urlData.publicUrl
    },

    async uploadImages(uris, bucket, folder) {
        const uploadPromises = uris.map(uri => this.uploadImage(uri, bucket, folder))
        return Promise.all(uploadPromises)
    }
}

