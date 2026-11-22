import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export interface UploadResponse {
  document_id: string;
  filename: string;
  message: string;
  pages_processed: number;
}

export interface QueryResponse {
  answer: string;
  sources: number[];
}

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const queryDocument = async (documentId: string, query: string): Promise<QueryResponse> => {
  const response = await api.post('/query', {
    document_id: documentId,
    query: query,
  });
  return response.data;
};
