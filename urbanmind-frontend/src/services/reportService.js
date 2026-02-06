import api from '../api/axios';

export const createReport = async (reportData) => {
  try {
    const response = await api.post('/reports', reportData);
    return response.data;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
};

export const getReportById = async (id) => {
  try {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching report ${id}:`, error);
    throw error;
  }
};

export const getReportsByStatus = async (status, page = 0, size = 20) => {
  try {
    const response = await api.get('/admin/reports', { params: { status, page, size } });
    return response.data;
  } catch (error) {
    console.error(`Error fetching reports with status ${status}:`, error);
    throw error;
  }
};

export const updateReportStatus = async (id, status) => {
  try {
    const response = await api.patch(`/admin/reports/${id}/status`, null, { params: { status } });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for report ${id}:`, error);
    throw error;
  }
};
