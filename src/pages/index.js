import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import TimelineVisual from '@site/src/components/TimelineVisual';
import MetricsDisplay from '@site/src/components/MetricsDisplay';
import ArchitectureDiagram from '@site/src/components/ArchitectureDiagram';
import InteractiveDemoPreview from '@site/src/components/InteractiveDemoPreview';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">
          Transforming KubeStellar Documentation
        </h1>
        <p className="hero__subtitle">
          A 30-Minute Journey from Zero to Multi-Cluster Deployment
        </p>
        <p className="hero__subtitle" style={{fontSize: '1.2rem', marginTop: '1rem'}}>
          LFX Mentorship 2026 Term 1 - Documentation and Self-Service Enablement Specialist
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            View Project Vision →
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/quickstart"
            style={{marginLeft: '1rem'}}>
            Explore Deliverables →
          </Link>
          <Link
            className="button button--primary button--lg"
            href="https://mentorship.lfx.linuxfoundation.org/"
            style={{marginLeft: '1rem'}}>
            Apply for Mentorship →
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="LFX Mentorship 2026 - KubeStellar Documentation and Self-Service Enablement Initiative">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <MetricsDisplay />
        <section style={{padding: '4rem 0'}} id="interactive-demo">
          <div className="container">
            <h2 style={{textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem'}}>
              Interactive Learning (Killercoda Preview)
            </h2>
            <InteractiveDemoPreview />
          </div>
        </section>
        <section style={{padding: '4rem 0', backgroundColor: 'var(--ifm-color-emphasis-100)'}}>
          <div className="container">
            <h2 style={{textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem'}}>
              12-Week Project Timeline
            </h2>
            <TimelineVisual />
          </div>
        </section>
        <section style={{padding: '4rem 0'}}>
          <div className="container">
            <h2 style={{textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem'}}>
              KubeStellar Architecture Overview
            </h2>
            <ArchitectureDiagram />
          </div>
        </section>
      </main>
    </Layout>
  );
}
