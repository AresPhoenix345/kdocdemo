import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function ArchitectureDiagram() {
  return (
    <div className={styles.diagramContainer}>
      <div className={styles.architectureDiagram}>
        <Link
          className={styles.componentLink}
          to="/docs/architecture/wds"
          title="WDS: define workloads + policies (native Kubernetes objects)">
          <div className={styles.component} style={{gridArea: 'wds'}}>
            <div className={styles.componentIcon}>📝</div>
            <h3>Workload Description Space (WDS)</h3>
            <p>Central staging area where users define workloads in native Kubernetes format</p>
          </div>
        </Link>
        
        <div className={styles.arrow} style={{gridArea: 'arrow1'}}>→</div>
        
        <Link
          className={styles.componentLink}
          to="/docs/architecture/its"
          title="ITS: inventory + transport via OCM (ManagedCluster, mailboxes, ManifestWork)">
          <div className={styles.component} style={{gridArea: 'its'}}>
            <div className={styles.componentIcon}>🚚</div>
            <h3>Inventory & Transport Space (ITS)</h3>
            <p>Manages cluster inventory and transports workloads to WECs via OCM</p>
          </div>
        </Link>
        
        <div className={styles.arrow} style={{gridArea: 'arrow2'}}>→</div>
        
        <Link className={styles.componentLink} to="/docs/architecture/wecs" title="WECs: where workloads execute">
          <div className={styles.component} style={{gridArea: 'wec1'}}>
            <div className={styles.componentIcon}>⚙️</div>
            <h3>WEC 1</h3>
            <p>Edge/Cloud Cluster</p>
          </div>
        </Link>
        
        <Link className={styles.componentLink} to="/docs/architecture/wecs" title="WECs: where workloads execute">
          <div className={styles.component} style={{gridArea: 'wec2'}}>
            <div className={styles.componentIcon}>⚙️</div>
            <h3>WEC 2</h3>
            <p>Edge/Cloud Cluster</p>
          </div>
        </Link>
        
        <Link className={styles.componentLink} to="/docs/architecture/wecs" title="WECs: where workloads execute">
          <div className={styles.component} style={{gridArea: 'wec3'}}>
            <div className={styles.componentIcon}>⚙️</div>
            <h3>WEC N</h3>
            <p>Edge/Cloud Cluster</p>
          </div>
        </Link>
        
        <Link className={styles.componentLink} to="/docs/architecture/binding-policy" title="BindingPolicy: label-based placement control">
          <div className={styles.bindingPolicy} style={{gridArea: 'policy'}}>
            <div className={styles.componentIcon}>🎯</div>
            <h3>BindingPolicy</h3>
            <p>Controls which workloads go to which clusters using label selectors</p>
          </div>
        </Link>
      </div>
      
      <div className={styles.description}>
        <p>
          KubeStellar uses a hub-and-spoke architecture built on Open Cluster Management (OCM).
          Users define workloads in the WDS, BindingPolicies control distribution, and the ITS
          manages transport to Workload Execution Clusters (WECs) where applications actually run.
        </p>
      </div>
    </div>
  );
}
