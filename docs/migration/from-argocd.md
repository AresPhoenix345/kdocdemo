# Migrating from ArgoCD to KubeStellar

## Overview

ArgoCD commonly manages multi-cluster deployments using:
- Multiple Argo instances (one per cluster)
- A single Argo instance with multiple cluster credentials
- `ApplicationSet` for generating `Application` objects per cluster

KubeStellar provides a different model:
- **Define workloads once** in a **WDS**
- **Select target clusters** using **BindingPolicy** label selectors
- **Distribute and reconcile** via ITS/OCM transport

This guide helps you map ArgoCD patterns to KubeStellar patterns.

## Prerequisites

- Existing ArgoCD setup and access to repos
- Inventory of target clusters and their purposes (dev/stage/prod/regions)
- A working KubeStellar environment (see **[Quickstart](../quickstart/index.md)**)
- Downtime plan (often none if migrating gradually)

## Migration Strategy

### Assessment Phase

1. Inventory current Applications/ApplicationSets:
   - Repos, paths, sync policies
   - Target clusters/namespaces
2. Identify cluster selection logic:
   - Cluster labels in Argo (common in ApplicationSet generators)
3. Identify overlays:
   - kustomize, helm values, env-specific patches

### Preparation Phase

1. Ensure clusters are registered as WECs in KubeStellar ITS.
2. Apply meaningful labels in ITS that match your Argo selection intent:

```bash
kubectl config use-context its1
kubectl label managedcluster prod-us-east environment=prod region=us-east --overwrite
kubectl label managedcluster stage-us-east environment=staging region=us-east --overwrite
```

3. Choose how you will produce workload manifests in WDS:
   - **Option A**: GitOps pipeline renders manifests and applies to WDS
   - **Option B**: Use Helm/Kustomize locally and apply to WDS during migration

### Migration Phase

#### Step 1: Translate cluster targeting logic

**ArgoCD ApplicationSet** (conceptual):

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
spec:
  generators:
  - clusters:
      selector:
        matchLabels:
          environment: prod
  template:
    spec:
      destination:
        namespace: shop
```

**KubeStellar BindingPolicy** equivalent:

```yaml
apiVersion: control.kubestellar.io/v1alpha1
kind: BindingPolicy
metadata:
  name: shop-prod
namespace: shop
spec:
  clusterSelectors:
  - matchLabels:
      environment: prod
  downsync:
  - objectSelectors:
    - matchLabels:
        app.kubernetes.io/part-of: shop
    resources:
    - namespaces
    - deployments
    - services
    - configmaps
    - secrets
```

#### Step 2: Move a single application first (canary)

1. Apply app manifests to WDS with consistent labels:
   - `app.kubernetes.io/part-of: shop`
2. Create BindingPolicy targeting a small subset:
   - `ring=canary` or a single region
3. Validate on WECs.

#### Step 3: Gradually expand scope

- Broaden clusterSelectors (add more regions/environments)
- Decommission corresponding Argo Applications once stable

### Validation Phase

Use repeatable checks:

```bash
# WDS feedback
kubectl config use-context wds1
kubectl get bindingpolicies -A
kubectl get bindings -A

# WEC state
kubectl get deploy -n shop --context prod-us-east
kubectl get svc -n shop --context prod-us-east
```

### Cutover Phase

1. Freeze changes in Argo for the migrated apps.
2. Promote KubeStellar policies/labels to production scope.
3. Remove Argo Applications for migrated workloads.

## Comparison Table

| Feature | ArgoCD | KubeStellar | Notes |
|---|---|---|---|
| Workload source of truth | Git repo | WDS API (often fed by GitOps) | WDS can still be Git-driven |
| Cluster targeting | AppSet generators / destination | BindingPolicy clusterSelectors | Both are label-based patterns |
| Drift correction | Argo sync | Controllers + OCM transport | KubeStellar keeps native objects |
| Multi-cluster scale | Many apps per cluster | Policy selects clusters | Less duplication at scale |

## Common Pitfalls

- Missing or inconsistent cluster labels in ITS
- Workload labels don’t match BindingPolicy objectSelectors
- Namespace creation omitted (`namespaces` not downsynced)
- Attempting to migrate everything at once (avoid)

## Rollback Plan

- Keep Argo Applications defined but paused
- If needed, re-enable Argo sync and remove KubeStellar BindingPolicy for that app
- Ensure ownership clarity to avoid “two reconcilers” fighting

## Post-Migration Optimization

- Standardize cluster label taxonomy (`environment`, `region`, `provider`, `ring`)
- Adopt ring-based promotions
- Add transforms for cluster-specific annotations (ingress/LB/storage)

