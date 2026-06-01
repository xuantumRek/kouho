import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || window.location.origin;

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

export const getVideos = () => api.get('/videos');
export const getVideo = (id) => api.get(`/videos/${id}`);
export const uploadVideo = (formData) => api.post('/videos', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteVideo = (id) => api.delete(`/videos/${id}`);

export default api;