// packages/api-endpoints/src/lib/api-endpoints.ts

export const API_BASE_URL = 'http://127.0.0.1:8787';

export const API_ENDPOINTS = {

    // General Endpoints
    message: `${API_BASE_URL}/message`,

    // userProfile Endpoints
    createProfile: `${API_BASE_URL}/user-profile/create-profile`,
    getAllProfiles: `${API_BASE_URL}/user-profile/get-all-profiles`,
    getProfileByUUID: (uuid: string) => `${API_BASE_URL}/user-profile/get/${uuid}`,
    updateProfileByUUID: (uuid: string) => `${API_BASE_URL}/user-profile/update/${uuid}`,

};
