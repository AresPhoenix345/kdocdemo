import React from 'react';
import styles from './styles.module.css';

const metrics = [
  {
    value: '30 min',
    label: 'Time to First Success',
    icon: '⏱️',
  },
  {
    value: '4/5',
    label: 'Target User Satisfaction',
    icon: '⭐',
  },
  {
    value: '8+',
    label: 'New GitHub Issues Goal',
    icon: '🐛',
  },
  {
    value: '2+',
    label: 'Documentation PRs Goal',
    icon: '📝',
  },
];

export default function MetricsDisplay() {
  return (
    <section className={styles.metricsSection}>
      <div className="container">
        <h2 style={{textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem'}}>
          Success Metrics
        </h2>
        <div className={styles.metricsGrid}>
          {metrics.map((metric, idx) => (
            <div key={idx} className={styles.metricCard}>
              <div className={styles.metricIcon}>{metric.icon}</div>
              <div className={styles.metricValue}>{metric.value}</div>
              <div className={styles.metricLabel}>{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
