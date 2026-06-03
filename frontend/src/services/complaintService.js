import api from './api';

export const complaintService = {
  // Student Endpoints
  getStudentComplaints: async () => {
    const response = await api.get('/api/student/complaints');
    return response.data;
  },

  createStudentComplaint: async (complaintData) => {
    // complaintData: { title, categoryId, description }
    const response = await api.post('/api/student/complaints', complaintData);
    return response.data;
  },

  getStudentComplaintDetail: async (id) => {
    const response = await api.get(`/api/student/complaints/${id}`);
    return response.data;
  },

  getStudentCategories: async () => {
    const response = await api.get('/api/student/categories');
    return response.data;
  },

  submitFeedback: async (id, feedbackData) => {
    // feedbackData: { rating, feedbackComment }
    const response = await api.put(`/api/student/complaints/${id}/feedback`, feedbackData);
    return response.data;
  },

  reopenComplaint: async (id) => {
    const response = await api.put(`/api/student/complaints/${id}/reopen`);
    return response.data;
  },

  // Warden Endpoints
  getWardenComplaints: async () => {
    const response = await api.get('/api/warden/complaints');
    return response.data;
  },

  getWardenComplaintDetail: async (id) => {
    const response = await api.get(`/api/warden/complaints/${id}`);
    return response.data;
  },

  updateWardenComplaintStatus: async (id, statusUpdate) => {
    // statusUpdate: { status, remark }
    const response = await api.put(`/api/warden/complaints/${id}/status`, statusUpdate);
    return response.data;
  },

  // Admin Endpoints
  getAdminComplaints: async () => {
    const response = await api.get('/api/admin/complaints');
    return response.data;
  },

  assignComplaintToWarden: async (id, assignData) => {
    // assignData: { wardenId }
    const response = await api.put(`/api/admin/complaints/${id}/assign`, assignData);
    return response.data;
  },

  getAdminStudents: async () => {
    const response = await api.get('/api/admin/users/student');
    return response.data;
  },

  getAdminWardens: async () => {
    const response = await api.get('/api/admin/users/warden');
    return response.data;
  },

  createWarden: async (wardenData) => {
    // wardenData: { name, email, password, phone, categoryId }
    const response = await api.post('/api/admin/users/wardens', wardenData);
    return response.data;
  },

  toggleUserStatus: async (id) => {
    const response = await api.put(`/api/admin/users/${id}/toggle`);
    return response.data;
  },

  getAdminCategories: async () => {
    const response = await api.get('/api/admin/categories');
    return response.data;
  },

  createCategory: async (categoryData) => {
    // categoryData: { name, description, assignedWardenId }
    const response = await api.post('/api/admin/categories', categoryData);
    return response.data;
  },

  getAdminStats: async () => {
    const response = await api.get('/api/admin/stats');
    return response.data;
  }
};

export default complaintService;
