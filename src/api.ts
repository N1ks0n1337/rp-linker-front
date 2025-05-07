import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: false,
    headers: {
        'X-Captcha-Token': import.meta.env.VITE_CAPTCHA_TOKEN,
    },
});

export interface UploadResponse {
    download_url: string;
    sha1: string;
    delete_key: string;
}

export const uploadResourcePack = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<UploadResponse>(
        '/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
};

export const downloadTexturePack = (filename: string) =>
    api.get<Blob>(`/packs/${filename}.zip`, { responseType: 'blob' });

export const getTexturePackSha1 = (filename: string) =>
    api.get<{ sha1: string }>(`/packs/${filename}.zip?sha-1=true`);

export const deleteTexturePack = (filename: string, deleteKey: string) =>
    api.get<{ message: string }>(
        `/packs/${filename}.zip?delete=true&key=${deleteKey}`
    );

export default api;
