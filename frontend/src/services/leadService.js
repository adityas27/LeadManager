import api from "./api";

export const leadService = {
  list(params) {
    return api.get("/leads/", { params });
  },

  retrieve(id) {
    return api.get(`/leads/${id}/`);
  },

  create(data) {
    return api.post("/leads/", data);
  },

  update(id, data) {
    return api.put(`/leads/${id}/`, data);
  },

  partialUpdate(id, data) {
    return api.patch(`/leads/${id}/`, data);
  },

  remove(id) {
    return api.delete(`/leads/${id}/`);
  },

  stats() {
    return api.get("/dashboard/stats/");
  },
};
