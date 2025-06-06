import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ? `${process.env.REACT_APP_API_BASE_URL}/communities` : 'http://localhost:3005/communities';

const getAuthHeaders = (token) => {
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const communityApi = {
  createCommunity: async (dto, token) => {
    const headers = getAuthHeaders(token);
    const response = await axios.post(API_BASE_URL, dto, { headers });
    return response.data;
  },
  fetchCommunities: async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },
  fetchCommunityById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },
  updateCommunity: async (id, dto) => {
    const response = await axios.patch(`${API_BASE_URL}/${id}`, dto);
    return response.data;
  },
  removeCommunity: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  },
  addMember: async (communityId, { userId, role }, token) => {
    const headers = getAuthHeaders(token);
    const response = await axios.post(`${API_BASE_URL}/${communityId}/members`, { userId, role }, { headers });
    return response.data;
  },
  removeMember: async (communityId, userId, token) => {
    const headers = getAuthHeaders(token);
    const response = await axios.delete(`${API_BASE_URL}/${communityId}/members/${userId}`, { headers });
    return response.data;
  },
  updateMemberRole: async (communityId, userId, role, token) => {
    const headers = getAuthHeaders(token);
    const response = await axios.patch(`${API_BASE_URL}/${communityId}/members/${userId}/role`, { role }, { headers });
    return response.data;
  },
  addUserToCommunities: async (dto, token) => {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    };
    const response = await axios.post(`${API_BASE_URL}/add-user-to-communities`, dto, { headers });
    return response.data;
  },
};

export default communityApi;
