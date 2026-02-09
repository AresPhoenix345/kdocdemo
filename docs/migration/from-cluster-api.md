# Migrating from Cluster API to KubeStellar

## Overview

Cluster API (CAPI) primarily manages the **lifecycle of Kubernetes clusters** (create/upgrade/scale). Many teams also build deployment workflows around clusters that CAPI creates.

KubeStellar is complementary:
- CAPI can continue to manage cluster lifecycle
- KubeStellar focuses on **multi-cluster workload distribution and configuration**

This guide describes how to move from “CAPI-managed fleets + per-cluster deployments” to “CAPI-managed fleets + KubeStellar workload placement”.

## Prerequisites

- Existing CAPI management cluster access
- Inventory of workload clusters and their characteristics
- A working KubeStellar ITS and WDS
- Cluster credentials (kubeconfigs) for clusters you will register as WECs

## Migration Strategy

### Assessment Phase

1. Inventory clusters created by CAPI:
   - Names, regions, environments
   - Add-ons (CNI, storage, ingress)
2. Inventory current deployment method:
   - GitOps per cluster? Helm per cluster? CI scripts?
3. Identify cluster metadata you want as labels:
   - `environment`, `region`, `provider`, `tier`, `ring`

### Preparation Phase

1. Register clusters as WECs in your ITS.
2. Apply consistent labels in ITS.

```bash
kubectl config use-context its1
kubectl label managedcluster wec-prod-1 environment=prod region=us-east provider=aws --overwrite
kubectl label managedcluster wec-stage-1 environment=staging region=us-east provider=aws --overwrite
```

3. Define standard workload labels:
   - `app.kubernetes.io/name`
   - `app.kubernetes.io/part-of`

### Migration Phase

#### Step 1: Centralize workload definitions in WDS

Instead of applying manifests to each cluster, apply them once to the WDS:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: platform-demo
  labels:
    app.kubernetes.io/name: api
    app.kubernetes.io/part-of: platform-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app.kubernetes.io/name: api
  template:
    metadata:
      labels:
        app.kubernetes.io/name: api
    spec:
      containers:
      - name: api
        image: ghcr.io/example/api:1.0.0
```

#### Step 2: Use BindingPolicy for placement

```yaml
apiVersion: control.kubestellar.io/v1alpha1
kind: BindingPolicy
metadata:
  name: api-prod
  namespace: platform-demo
spec:
  clusterSelectors:
  - matchLabels:
      environment: prod
  downsync:
  - objectSelectors:
    - matchLabels:
        app.kubernetes.io/part-of: platform-demo
    resources:
    - namespaces
    - deployments
    - services
```

#### Step 3: Replace per-cluster deployment automation

You can typically remove:
- “loop over kubeconfigs” scripts in CI
- multiple Argo instances per cluster (optional)
- duplicated manifests per cluster (replace with labels + policies)

### Validation Phase

```bash
kubectl get bindings -n platform-demo --context wds1
kubectl get deploy -n platform-demo --context wec-prod-1
kubectl get deploy -n platform-demo --context wec-stage-1
```

### Cutover Phase

1. Freeze per-cluster deploy pipelines for migrated apps.
2. Ensure KubeStellar policies are the single source of desired placement.
3. Keep CAPI for lifecycle, but use KubeStellar for workloads going forward.

## Comparison Table

| Feature | Cluster API | KubeStellar | Notes |
|---|---|---|---|
| Primary responsibility | Cluster lifecycle | Workload placement & sync | Complementary tools |
| Selection mechanism | N/A | BindingPolicy clusterSelectors | Driven by cluster labels in ITS |
| Workload rollout | External tooling | Policy-driven distribution | No manual context switching |

## Common Pitfalls

- Missing consistent labeling for CAPI clusters in ITS
- Treating KubeStellar as a cluster lifecycle tool (it isn’t)
- Inconsistent base add-ons across WECs causing workload drift

## Rollback Plan

- Keep old per-cluster deployment mechanism intact for a time
- Remove BindingPolicies for rolled-back apps and re-enable previous pipeline

## Post-Migration Optimization

- Auto-label clusters based on CAPI ClusterClass/metadata
- Add ring-based promotion policies
- Standardize “cluster capability” labels (gpu, storageclass, ingress)

