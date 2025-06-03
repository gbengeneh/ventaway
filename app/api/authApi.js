import axios from 'axios';

const API_BASE_URL = 'http://192.168.90.234:3005/auth';

export const register = (registerDto) => {
  return axios.post(`${API_BASE_URL}/register`, registerDto);
};

export const login = (loginDto) => {
  return axios.post(`${API_BASE_URL}/login`, loginDto);
};

export const forgotPassword = (forgotPasswordDto) => {
  return axios.post(`${API_BASE_URL}/forgot-password`, forgotPasswordDto);
};

export const resetPassword = (resetPasswordDto) => {
  return axios.post(`${API_BASE_URL}/reset-password`, resetPasswordDto);
};

export const refreshTokens = (refreshToken) => {
  return axios.post(
    `${API_BASE_URL}/refresh`,
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );
};

export const logout = (accessToken) => {
  return axios.post(
    `${API_BASE_URL}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer \${accessToken}`,
      },
    }
  );
};

export const googleTokenLogin = (access_token) => {
  return axios.post(`${API_BASE_URL}/google/token`, { access_token });
};

export const appleTokenLogin = (id_token, name) => {
  return axios.post(`${API_BASE_URL}/apple/token`, { id_token, name });
};
