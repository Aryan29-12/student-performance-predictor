import apiClient from './client';

export const predictionService = {
  // Submit exact 43 features to ML prediction endpoint
  async predictGpa(featureData) {
    // Strip non-prediction fields (e.g. name, id) if present
    const payload = { ...featureData };
    delete payload.id;
    delete payload.name;

    // Convert strings to appropriate numeric types
    Object.keys(payload).forEach((key) => {
      if (typeof payload[key] === 'string' && payload[key].trim() !== '') {
        payload[key] = Number(payload[key]);
      }
    });

    const res = await apiClient.post('/predict/', payload);
    return res.data; // { predicted_gpa: number }
  },
};

