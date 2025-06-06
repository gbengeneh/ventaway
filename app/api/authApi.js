import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ? `${process.env.REACT_APP_API_BASE_URL}/auth` : 'http://localhost:3005/auth';

const authApi = {
  register: (registerDto) => axios.post(`${API_BASE_URL}/register`, registerDto),
  login: (loginDto) => axios.post(`${API_BASE_URL}/login`, loginDto),
  forgotPassword: (forgotPasswordDto) => axios.post(`${API_BASE_URL}/forgot-password`, forgotPasswordDto),
  resetPassword: (resetPasswordDto) => axios.post(`${API_BASE_URL}/reset-password`, resetPasswordDto),
  refreshTokens: (refreshToken) =>
    axios.post(
      `${API_BASE_URL}/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    ),
  logout: (accessToken) =>
    axios.post(
      `${API_BASE_URL}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),
  googleTokenLogin: (access_token) => axios.post(`${API_BASE_URL}/google/token`, { access_token }),
  appleTokenLogin: (id_token, name) => axios.post(`${API_BASE_URL}/apple/token`, { id_token, name }),
};

export default authApi;
