import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function InteractiveDemoPreview() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.badge}>Killercoda</div>
          <h3 className={styles.title}>KubeStellar Basics: From WDS to WEC</h3>
          <p className={styles.subtitle}>
            A browser-based lab with automated setup, verification checks, and contextual hints.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.item}>
            <div className={styles.itemTitle}>What you’ll do</div>
            <ul className={styles.list}>
              <li>Explore WDS/ITS contexts</li>
              <li>Register and label clusters</li>
              <li>Write BindingPolicies</li>
              <li>Deploy and verify workloads</li>
            </ul>
          </div>
          <div className={styles.item}>
            <div className={styles.itemTitle}>UX features</div>
            <ul className={styles.list}>
              <li>One-click environment bootstrap</li>
              <li>Step-by-step tasks with hints</li>
              <li>Automated correctness checks</li>
              <li>Copy/paste-ready commands</li>
            </ul>
          </div>
          <div className={styles.item}>
            <div className={styles.itemTitle}>Estimated time</div>
            <div className={styles.time}>45–60 minutes</div>
            <div className={styles.links}>
              <Link className="button button--secondary" to="/docs/tutorials/interactive-tutorial-preview">
                View tutorial preview →
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.note}>
            Prototype note: the live Killercoda scenario link is shown in the preview doc and will be activated during
            project execution.
          </div>
        </div>
      </div>
    </div>
  );
}

