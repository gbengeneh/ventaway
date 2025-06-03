import axios from 'axios';

const API_BASE_URL = 'http://192.168.90.234:3005/posts';

const getAuthHeaders = (token) => {
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createPost = async (dto, file, token) => {
  const formData = new FormData();

  for (const key in dto) {
    if (Object.prototype.hasOwnProperty.call(dto, key)) {
      formData.append(key, dto[key]);
    }
  }

  if (file) {
    formData.append('file', file);
  }

  const headers = {
    'Content-Type': 'multipart/form-data',
    ...getAuthHeaders(token),
  };

  const response = await axios.post(API_BASE_URL, formData, { headers });
  return response.data;
};

export const fetchPostsByUser = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
  return response.data;
};

export const fetchPostById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const updatePost = async (id, dto, file, token) => {
  const formData = new FormData();

  for (const key in dto) {
    if (Object.prototype.hasOwnProperty.call(dto, key)) {
      formData.append(key, dto[key]);
    }
  }

  if (file) {
    formData.append('file', file);
  }

  const headers = {
    'Content-Type': 'multipart/form-data',
    ...getAuthHeaders(token),
  };

  const response = await axios.put(`${API_BASE_URL}/${id}`, formData, { headers });
  return response.data;
};

export const removePost = async (id, token) => {
  const headers = getAuthHeaders(token);
  const response = await axios.delete(`${API_BASE_URL}/${id}`, { headers });
  return response.data;
};
