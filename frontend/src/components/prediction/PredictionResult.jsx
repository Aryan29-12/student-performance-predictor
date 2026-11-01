import React from 'react';
import { AlertTriangle } from 'lucide-react';

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export default function PredictionResult({ predictedGpa }) {
  if (predictedGpa === null || predictedGpa === undefined) return null;

  const raw = predictedGpa;
  const isOutOfBounds = raw < 0 || raw > 4;
  const displayGpa = raw.toFixed(4);
  const gaugePercent = clamp((raw / 4.0) * 100, 0, 100);

  // Gauge color based on clamped position
  function gaugeColor() {
    if (isOutOfBounds) return 'var(--warning)';
    const ratio = raw / 4.0;
    if (ratio < 0.5) return 'var(--danger)';
    if (ratio < 0.75) return 'var(--warning)';
    return 'var(--success)';
  }

  return (
    <div className="prediction-result">
      <div className="prediction-result__header">Prediction Result</div>

      <div className="prediction-result__gpa">
        <span className="prediction-result__value">{displayGpa}</span>
        <span className="prediction-result__scale"> / 4.00</span>
      </div>

      {/* Gauge bar */}
      <div className="gpa-gauge">
        <div className="gpa-gauge__track">
          <div
            className="gpa-gauge__fill"
            style={{ width: `${gaugePercent}%`, background: gaugeColor() }}
          />
          <div
            className="gpa-gauge__needle"
            style={{ left: `${gaugePercent}%` }}
          />
        </div>
        <div className="gpa-gauge__labels">
          <span>0.00</span>
          <span>1.00</span>
          <span>2.00</span>
          <span>3.00</span>
          <span>4.00</span>
        </div>
      </div>

      {/* Raw value note */}
      <div className="prediction-result__raw">
        Raw model output: <code>{raw}</code>
      </div>

      {/* Out-of-bounds amber warning */}
      {isOutOfBounds && (
        <div className="alert alert--warning">
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <div>
            <strong>Out-of-Bounds Model Extrapolation</strong>
            <p style={{ margin: '4px 0 0' }}>
              The linear regression model produced a result outside the 0.00–4.00 scale.
              This occurs when input combinations exceed typical training distributions.
              The gauge shows the clamped position for reference; the raw value above is the actual model output.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

