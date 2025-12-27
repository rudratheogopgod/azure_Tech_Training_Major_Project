export interface DocumentAttachment {
    id: string;
    fileName: string;
    contentType: string;
    fileSize: number;
    blobName: string;
    uploadedDate: Date;
}

export interface Note {
    id?: string;
    title: string;
    content?: string;
    attachments?: DocumentAttachment[];
    tags?: Record<string, string>;
    createdDate?: Date;
    updatedDate?: Date;
}


