import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PredictionForm from '../components/prediction/PredictionForm';
import PredictionResult from '../components/prediction/PredictionResult';
import { predictionService } from '../api/predictionService';
import { useToast } from '../App';

export default function PredictionPage() {
  const location = useLocation();
  const { showToast } = useToast();
  const prefillData = location.state?.prefill || null;

  const [loading, setLoading] = useState(false);
  const [predictedGpa, setPredictedGpa] = useState(null);

  async function handlePredict(payload) {
    setLoading(true);
    setPredictedGpa(null);
    try {
      const result = await predictionService.predictGpa(payload);
      setPredictedGpa(result.predicted_gpa);
    } catch (err) {
      showToast(`Prediction error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">GPA Prediction</h1>
          <p className="page-subtitle">
            Enter the 43 student features to generate a GPA prediction using the trained ML model.
            {prefillData && <span className="badge badge--info" style={{ marginLeft: '0.5rem' }}>Pre-filled from student record</span>}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div className="card">
          <PredictionForm
            onSubmit={handlePredict}
            loading={loading}
            prefillData={prefillData}
          />
        </div>

        {(loading || predictedGpa !== null) && (
          <div className="card">
            {loading ? (
              <div className="flex-center" style={{ padding: '2rem' }}>
                <div className="spinner" />
                <span style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }}>Running model…</span>
              </div>
            ) : (
              <PredictionResult predictedGpa={predictedGpa} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

