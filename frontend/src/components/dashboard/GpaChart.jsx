import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const BINS = [
  { label: '< 2.50', key: 'below_2_5', color: 'var(--danger)' },
  { label: '2.50–2.99', key: 'range_2_5_3', color: 'var(--warning)' },
  { label: '3.00–3.49', key: 'range_3_3_5', color: 'var(--primary)' },
  { label: '3.50–4.00', key: 'range_3_5_4', color: 'var(--success)' },
];

function bucketStudents(students) {
  const counts = { below_2_5: 0, range_2_5_3: 0, range_3_3_5: 0, range_3_5_4: 0 };
  students.forEach((s) => {
    const gpa = parseFloat(s.previous_gpa);
    if (isNaN(gpa)) return;
    if (gpa < 2.5) counts.below_2_5 += 1;
    else if (gpa < 3.0) counts.range_2_5_3 += 1;
    else if (gpa < 3.5) counts.range_3_3_5 += 1;
    else counts.range_3_5_4 += 1;
  });
  return BINS.map((b) => ({ label: b.label, count: counts[b.key], color: b.color }));
}

export default function GpaChart({ students = [] }) {
  const data = bucketStudents(students);

  return (
    <div className="chart-card">
      <div className="chart-card__title">Previous GPA Distribution</div>
      <div className="chart-card__subtitle">
        Sample: {students.length} record{students.length !== 1 ? 's' : ''} from current page
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="label" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
          <Tooltip
            formatter={(val) => [val, 'Students']}
            contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}
            labelStyle={{ color: 'var(--text-primary)' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

