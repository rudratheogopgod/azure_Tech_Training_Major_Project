import { RestService } from './restService';
import { Note } from '../models';

export class NoteService extends RestService<Note> {
    public constructor(baseUrl: string) {
        super(baseUrl, '/notes');
    }

    public async searchNotes(query: string, skip?: number, batchSize?: number): Promise<Note[]> {
        const response = await this.client.request<Note[]>({
            method: 'GET',
            url: '/search',
            params: { query, skip, batchSize }
        });
        return response.data;
    }

    public async uploadDocument(noteId: string, file: File): Promise<Note> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await this.client.request<Note>({
            method: 'POST',
            url: `/${noteId}/documents`,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    }

    public async downloadDocument(noteId: string, documentId: string): Promise<Blob> {
        const response = await this.client.request<Blob>({
            method: 'GET',
            url: `/${noteId}/documents/${documentId}/download`,
            responseType: 'blob'
        });

        return response.data;
    }

    public async deleteDocument(noteId: string, documentId: string): Promise<void> {
        await this.client.request<void>({
            method: 'DELETE',
            url: `/${noteId}/documents/${documentId}`
        });
    }
}


