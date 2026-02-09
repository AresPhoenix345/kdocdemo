import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Quickstart Excellence',
    icon: '🚀',
    description: (
      <>
        30-minute deployment guarantee with a production-ready guide validated by real users.
        Get from zero to multi-cluster deployment faster than ever before.
      </>
    ),
  },
  {
    title: 'Interactive Learning',
    icon: '🎓',
    description: (
      <>
        Browser-based tutorials with Killercoda - no local setup required. Learn KubeStellar
        through hands-on exercises with automated verification and contextual hints.
      </>
    ),
  },
  {
    title: 'Comprehensive Resources',
    icon: '📚',
    description: (
      <>
        Video series, troubleshooting guides, and migration documentation built for the
        community. Everything you need to succeed with KubeStellar in one place.
      </>
    ),
  },
];

function Feature({icon, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureIcon}>{icon}</div>
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
