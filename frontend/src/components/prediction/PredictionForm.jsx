
import React, { useState, useEffect } from 'react';
import { FORM_SECTIONS, CATEGORICAL_OPTIONS, PRESETS } from '../../utils/constants';
import { validateStudentForm } from '../../utils/validators';

function FieldInput({ field, value, onChange, error }) {
  const options = CATEGORICAL_OPTIONS[field.name];
  const isSelect = !!options;

  if (isSelect) {
    return (
      <div className="form-group">
        <label className="form-label" htmlFor={`pred_${field.name}`}>
          {field.label}
          {field.hint && <span className="form-hint"> — {field.hint}</span>}
        </label>

        <select
          id={`pred_${field.name}`}
          className={`input${error ? ' input--error' : ''}`}
          value={value ?? ''}
          onChange={(e) =>
            onChange(
              field.name,
              e.target.value === '' ? '' : Number(e.target.value)
            )
          }
        >
          <option value="">— Select —</option>

          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && <span className="form-error">{error}</span>}
      </div>
    );
  }

  return (
    <div className="form-group">
      <label className="form-label" htmlFor={`pred_${field.name}`}>
        {field.label}
        {field.hint && <span className="form-hint"> — {field.hint}</span>}
      </label>

      <input
        id={`pred_${field.name}`}
        type="number"
        step={field.step || 'any'}
        min={field.min !== undefined ? field.min : undefined}
        max={field.max !== undefined ? field.max : undefined}
        placeholder={field.placeholder || ''}
        className={`input${error ? ' input--error' : ''}`}
        value={value ?? ''}
        onChange={(e) => onChange(field.name, e.target.value)}
      />

      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

function buildEmptyForm() {
  const data = {};

  FORM_SECTIONS.forEach((section) => {
    section.fields.forEach((field) => {
      data[field.name] = '';
    });
  });

  return data;
}

export default function PredictionForm({
  onSubmit,
  loading,
  prefillData = null,
}) {
  const [formData, setFormData] = useState(buildEmptyForm);
  const [activeTab, setActiveTab] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (prefillData) {
      const base = buildEmptyForm();

      FORM_SECTIONS.forEach((section) => {
        section.fields.forEach((field) => {
          if (
            prefillData[field.name] !== undefined &&
            prefillData[field.name] !== null
          ) {
            base[field.name] = prefillData[field.name];
          }
        });
      });

      setFormData(base);
      setValidationErrors({});
    }
  }, [prefillData]);

  function applyPreset(presetKey) {
    if (!presetKey) {
      setFormData(buildEmptyForm());
      setValidationErrors({});
      return;
    }

    const preset = PRESETS[presetKey];

    if (!preset) return;

    const base = buildEmptyForm();
    Object.assign(base, preset);

    setFormData(base);
    setValidationErrors({});
  }

  function handleChange(name, value) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Prediction form does not require a student name.
    const result = validateStudentForm(formData, false);
    const errors = result.errors;

    if (!result.isValid) {
      setValidationErrors(errors);

      // Navigate to the first tab containing a validation error.
      for (let i = 0; i < FORM_SECTIONS.length; i++) {
        const hasError = FORM_SECTIONS[i].fields.some(
          (field) => errors[field.name]
        );

        if (hasError) {
          setActiveTab(i);
          break;
        }
      }

      return;
    }

    // Convert form values to numbers before sending to the API.
    const payload = {};

    FORM_SECTIONS.forEach((section) => {
      section.fields.forEach((field) => {
        const raw = formData[field.name];

        payload[field.name] =
          raw === '' || raw === null || raw === undefined
            ? null
            : Number(raw);
      });
    });

    onSubmit(payload);
  }

  function tabErrorCount(i) {
    return FORM_SECTIONS[i].fields.filter(
      (field) => validationErrors[field.name]
    ).length;
  }

  const currentSection = FORM_SECTIONS[activeTab];

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Preset selector */}
      <div className="prediction-presets">
        <label className="form-label">Quick Presets:</label>

        <div className="preset-buttons">
          {[
            { key: 'high_achiever', label: '🏆 High Achiever' },
            { key: 'average_student', label: '📊 Average Student' },
            { key: 'at_risk_student', label: '⚠️ At-Risk Student' },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => applyPreset(key)}
            >
              {label}
            </button>
          ))}

          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => {
              setFormData(buildEmptyForm());
              setValidationErrors({});
            }}
          >
            ✕ Clear
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="form-tabs">
        {FORM_SECTIONS.map((section, i) => {
          const errCount = tabErrorCount(i);

          return (
            <button
              key={section.id}
              type="button"
              className={`form-tab${activeTab === i ? ' form-tab--active' : ''}${errCount > 0 ? ' form-tab--error' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {section.title}

              {errCount > 0 && (
                <span className="form-tab__badge">{errCount}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Section description */}
      <div className="form-section-description">
        <p>{currentSection.description}</p>
      </div>

      {/* Current section fields */}
      <div className="form-grid">
        {currentSection.fields.map((field) => (
          <FieldInput
            key={field.name}
            field={field}
            value={formData[field.name]}
            onChange={handleChange}
            error={validationErrors[field.name]}
          />
        ))}
      </div>

      {/* Navigation and submit */}
      <div className="form-nav">
        {activeTab > 0 && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setActiveTab((t) => t - 1)}
          >
            ← Previous
          </button>
        )}

        <div style={{ flex: 1 }} />

        {activeTab < FORM_SECTIONS.length - 1 ? (
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setActiveTab((t) => t + 1)}
          >
            Next →
          </button>
        ) : (
          <button
            type="submit"
            className="btn btn--primary"
            disabled={loading}
          >
            {loading ? 'Predicting…' : 'Predict GPA'}
          </button>
        )}
      </div>
    </form>
  );
}