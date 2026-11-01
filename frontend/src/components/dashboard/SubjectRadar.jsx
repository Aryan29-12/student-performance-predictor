import React from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export default function SubjectRadar({ subjectAverages }) {
  if (!subjectAverages) return null;

  const data = [
    { subject: 'Math', avg: subjectAverages.math ?? 0 },
    { subject: 'Science', avg: subjectAverages.science ?? 0 },
    { subject: 'English', avg: subjectAverages.english ?? 0 },
    { subject: 'History', avg: subjectAverages.history ?? 0 },
    { subject: 'Computer', avg: subjectAverages.computer ?? 0 },
  ];

  return (
    <div className="chart-card">
      <div className="chart-card__title">Database-Wide Subject Averages</div>
      <div className="chart-card__subtitle">All students · All-time averages</div>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 130]}
            tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
            tickCount={4}
          />
          <Radar
            name="Average Score"
            dataKey="avg"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(val) => [val.toFixed(1), 'Avg Score']}
            contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}
            labelStyle={{ color: 'var(--text-primary)' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

