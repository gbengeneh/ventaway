import axios from 'axios';

const API_BASE_URL = 'http://192.168.90.234:3005/users'; // Base URL for user endpoints

export const fetchUserProfile = async (userId, token) => {
  const headers = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

  const response = await axios.get(`${API_BASE_URL}/${userId}`, { headers });
  return response.data;
};

export const updateUserProfile = async (userId, updateData, file, bannerFile, token) => {
  const formData = new FormData();

  // Append updateData fields to formData
  for (const key in updateData) {
    if (Object.prototype.hasOwnProperty.call(updateData, key)) {
      formData.append(key, updateData[key]);
    }
  }

  // Append file if provided
  if (file) {
    formData.append('file', file);
  }

  // Append bannerFile if provided
  if (bannerFile) {
    formData.append('bannerFile', bannerFile);
  }
  if (bannerFile) {
    formData.append('bannerFile', bannerFile);
  }

  const headers = {
    'Content-Type': 'multipart/form-data',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await axios.patch(`${API_BASE_URL}/${userId}`, formData, {
    headers,
  });

  return response.data;
};
