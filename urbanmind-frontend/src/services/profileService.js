import api from "../api/axios";

const PROFILE_BASE = "/api/profiles";

// 🔹 Get specific profile by role + id
const getProfile = async (role, userId) => {
  const response = await api.get(
    `${PROFILE_BASE}/${role.toUpperCase()}/${userId}`,
  );
  return response.data;
};

// 🔹 Update profile
const updateProfile = async (role, userId, data) => {
  const response = await api.put(
    `${PROFILE_BASE}/${role.toUpperCase()}/${userId}`,
    data,
  );
  return response.data;
};

// 🔹 Delete profile
const deleteProfile = async (role, userId) => {
  const response = await api.delete(
    `${PROFILE_BASE}/${role.toUpperCase()}/${userId}`,
  );
  return response.data;
};

// 🔹 Get all profiles (filtered or all roles)
const getAllProfiles = async (roleFilter = "all") => {
  if (roleFilter === "all") {
    const [citizens, volunteers, ngos] = await Promise.all([
      api.get(`${PROFILE_BASE}/all?role=citizen`),
      api.get(`${PROFILE_BASE}/all?role=volunteer`),
      api.get(`${PROFILE_BASE}/all?role=ngo`),
    ]);
    return [...citizens.data, ...volunteers.data, ...ngos.data];
  }

  const response = await api.get(`${PROFILE_BASE}/all?role=${roleFilter}`);
  return response.data;
};

// 🔹 Public profile (no role needed)
const getPublicProfile = async (userId) => {
  const response = await api.get(`${PROFILE_BASE}/public/${userId}`);
  return response.data;
};

// 🔹 My profile (from token)
const getMyProfile = async () => {
  const response = await api.get(`${PROFILE_BASE}/me`);
  return response.data;
};

export default {
  getProfile,
  updateProfile,
  deleteProfile,
  getAllProfiles,
  getPublicProfile,
  getMyProfile,
};
