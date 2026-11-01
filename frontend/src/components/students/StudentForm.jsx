
import React, { useState, useEffect } from 'react';
import { FORM_SECTIONS, CATEGORICAL_OPTIONS } from '../../utils/constants';
import { validateStudentForm } from '../../utils/validators';

// Single field renderer
function FieldInput({ field, value, onChange, error }) {
  const options = CATEGORICAL_OPTIONS[field.name];
  const isSelect = field.type === 'select' || !!options;

  if (isSelect && options) {
    return (
      <div className="form-group">
        <label className="form-label" htmlFor={field.name}>
          {field.label}
          {field.hint && <span className="form-hint"> — {field.hint}</span>}
        </label>

        <select
          id={field.name}
          name={field.name}
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
      <label className="form-label" htmlFor={field.name}>
        {field.label}
        {field.hint && <span className="form-hint"> — {field.hint}</span>}
      </label>

      <input
        id={field.name}
        name={field.name}
        type={field.type === 'text' ? 'text' : 'number'}
        step={field.step || 'any'}
        min={field.min !== undefined ? field.min : undefined}
        max={field.max !== undefined ? field.max : undefined}
        placeholder={field.placeholder || ''}
        className={`input${error ? ' input--error' : ''}`}
        value={value ?? ''}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(field.name, raw);
        }}
      />

      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

// Student form
export default function StudentForm({
  initialData = {},
  onSubmit,
  loading = false,
  serverErrors = {},
  isEdit = false,
  includeNameField = true,
}) {
  const [formData, setFormData] = useState(() => {
    const base = {};

    FORM_SECTIONS.forEach((section) => {
      section.fields.forEach((field) => {
        base[field.name] = initialData[field.name] ?? '';
      });
    });

    if (includeNameField) {
      base.name = initialData.name ?? '';
    }

    return base;
  });

  const [activeTab, setActiveTab] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  // Merge server-side field errors into validation state
  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      setValidationErrors((prev) => ({
        ...prev,
        ...serverErrors,
      }));
    }
  }, [serverErrors]);

  // Sync initialData when it changes
  useEffect(() => {
    if (isEdit && initialData && Object.keys(initialData).length > 0) {
      const base = {};

      FORM_SECTIONS.forEach((section) => {
        section.fields.forEach((field) => {
          base[field.name] = initialData[field.name] ?? '';
        });
      });

      if (includeNameField) {
        base.name = initialData.name ?? '';
      }

      setFormData(base);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, JSON.stringify(initialData)]);

  function handleChange(name, value) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when the user changes that field
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

    // The same validator supports both forms.
    // includeNameField=false skips student-name validation for prediction.
    const result = validateStudentForm(formData, includeNameField);
    const errors = result.errors;

    if (!result.isValid) {
      setValidationErrors(errors);

      // Navigate to the first tab containing an error
      for (let i = 0; i < FORM_SECTIONS.length; i++) {
        const sectionFields = FORM_SECTIONS[i].fields.map(
          (field) => field.name
        );

        const hasError = sectionFields.some((field) => errors[field]);

        if (hasError || (i === 0 && errors.name)) {
          setActiveTab(i);
          break;
        }
      }

      return;
    }

    // Convert numeric fields before submitting
    const payload = {};

    FORM_SECTIONS.forEach((section) => {
      section.fields.forEach((field) => {
        const raw = formData[field.name];

        if (raw === '' || raw === null || raw === undefined) {
          payload[field.name] = null;
        } else if (field.type === 'text') {
          payload[field.name] = raw;
        } else {
          payload[field.name] = Number(raw);
        }
      });
    });

    if (includeNameField) {
      payload.name = formData.name;
    }

    onSubmit(payload);
  }

  // Calculate error count for each tab
  function tabErrorCount(sectionIndex) {
    const fields = FORM_SECTIONS[sectionIndex].fields.map(
      (field) => field.name
    );

    const relevant =
      sectionIndex === 0 && includeNameField
        ? ['name', ...fields]
        : fields;

    return relevant.filter((field) => validationErrors[field]).length;
  }

  const currentSection = FORM_SECTIONS[activeTab];

  return (
    <form onSubmit={handleSubmit} noValidate>
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

      {/* Student name field */}
      {activeTab === 0 && includeNameField && (
        <FieldInput
          field={{
            name: 'name',
            label: 'Student Name',
            type: 'text',
            placeholder: 'Full name',
          }}
          value={formData.name}
          onChange={handleChange}
          error={validationErrors.name}
        />
      )}

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
            {loading
              ? 'Saving…'
              : isEdit
                ? 'Save Changes'
                : 'Create Student'}
          </button>
        )}
      </div>
    </form>
  );
}