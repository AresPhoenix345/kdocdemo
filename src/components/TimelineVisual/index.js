import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const timeline = [
  {
    week: 'Weeks 1-2',
    title: 'Foundation & Analysis',
    description: 'Deployment audits, friction log creation, and comprehensive documentation analysis',
    to: '/docs/intro',
  },
  {
    week: 'Weeks 3-4',
    title: 'Quickstart Guide',
    description: 'Draft and validate Quickstart guide with first round of user testing',
    to: '/docs/quickstart',
  },
  {
    week: 'Weeks 5-6',
    title: 'Interactive Tutorial',
    description: 'Build and publish browser-based Killercoda tutorial',
    to: '/docs/tutorials/interactive-tutorial-preview',
  },
  {
    week: 'Weeks 7-8',
    title: 'Video Series',
    description: 'Produce and publish comprehensive video tutorial series',
    to: '/docs/tutorials/video-series-outline',
  },
  {
    week: 'Weeks 9-10',
    title: 'Troubleshooting Guide',
    description: 'Create comprehensive troubleshooting guide with 20 common issues',
    to: '/docs/troubleshooting',
  },
  {
    week: 'Weeks 11-12',
    title: 'Use Cases & Migration',
    description: 'Prepare use-case documentation and migration guides',
    to: '/docs/use-cases',
  },
];

export default function TimelineVisual() {
  return (
    <div className={styles.timeline}>
      {timeline.map((item, idx) => (
        <div key={idx} className={styles.timelineItem}>
          <div className={styles.timelineMarker}></div>
          <div className={styles.timelineContent}>
            <div className={styles.timelineWeek}>{item.week}</div>
            <h3 className={styles.timelineTitle}>
              <Link to={item.to} className={styles.timelineLink}>
                {item.title} →
              </Link>
            </h3>
            <p className={styles.timelineDescription}>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
