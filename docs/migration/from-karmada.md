# Migrating from Karmada to KubeStellar

## Overview

Karmada typically orchestrates multi-cluster deployments using:
- `PropagationPolicy` / `ClusterPropagationPolicy` for placement
- Scheduling rules for cluster selection
- Overrides and replica scheduling for cluster-specific customization

KubeStellar provides:
- Workload definitions in a **WDS**
- Cluster selection via **BindingPolicy** `clusterSelectors`
- Transport and reconciliation via **ITS** and **OCM**

This guide shows a practical mapping from Karmada policy constructs to KubeStellar BindingPolicies.

## Prerequisites

- Current Karmada control plane access
- Inventory of propagated resources and target clusters
- Plan for overlaps during transition (avoid double-management)
- Working KubeStellar environment and WEC registration

## Migration Strategy

### Assessment Phase

1. Inventory existing policies:
   - Which resources are propagated?
   - Which cluster selectors are used?
2. Identify overrides:
   - per-cluster patches, replicas, image overrides

### Preparation Phase

1. Register the same target clusters as **WECs** in KubeStellar ITS.
2. Apply equivalent labels in ITS to match Karmada selection intent.

```bash
kubectl config use-context its1
kubectl label managedcluster cluster-a region=us-east env=prod --overwrite
kubectl label managedcluster cluster-b region=eu-west env=prod --overwrite
```

3. Decide how to handle overrides:
   - Prefer transforms or environment-specific manifests

### Migration Phase

#### Step 1: Translate placement policy

**Before (Karmada PropagationPolicy)** (simplified):

```yaml
apiVersion: policy.karmada.io/v1alpha1
kind: PropagationPolicy
metadata:
  name: nginx-prop
spec:
  resourceSelectors:
  - apiVersion: apps/v1
    kind: Deployment
    name: nginx
  placement:
    clusterAffinity:
      clusterNames:
      - cluster-a
      - cluster-b
```

**After (KubeStellar BindingPolicy)**:

```yaml
apiVersion: control.kubestellar.io/v1alpha1
kind: BindingPolicy
metadata:
  name: nginx-prod
  namespace: demo
spec:
  clusterSelectors:
  - matchLabels:
      env: prod
  downsync:
  - objectSelectors:
    - matchLabels:
        app.kubernetes.io/name: nginx
    resources:
    - namespaces
    - deployments
```

#### Step 2: Translate resource selection

Karmada selects by GVK/name; KubeStellar commonly selects by **labels**.

Best practice during migration:
- Add stable labels to your workloads (e.g., `app.kubernetes.io/name`, `app.kubernetes.io/part-of`)
- Use those labels in BindingPolicy objectSelectors

#### Step 3: Handle overrides

Karmada’s per-cluster overrides can be expressed as:
- Separate workload manifests per cluster group (recommended for clarity)
- Transforms (where supported) for systematic patching

### Validation Phase

```bash
kubectl config use-context wds1
kubectl get bindingpolicies -A
kubectl get bindings -A

kubectl get deploy -n demo --context cluster-a
kubectl get deploy -n demo --context cluster-b
```

### Cutover Phase

1. Stop Karmada propagation for migrated workloads (remove policies or stop reconcilers).
2. Ensure only KubeStellar is driving desired state.

## Comparison Table

| Feature | Karmada | KubeStellar | Notes |
|---|---|---|---|
| Placement object | PropagationPolicy | BindingPolicy | Both declarative |
| Cluster selection | clusterAffinity / selectors | clusterSelectors (labels) | Label hygiene is key |
| Overrides | OverridePolicy | Transforms / overlays | Choose the simplest reliable approach |
| Transport | Karmada mechanisms | OCM via ITS | Different operational model |

## Common Pitfalls

- Workload selection via labels not added yet
- Cluster labels missing in ITS
- Two systems reconciling same resources simultaneously

## Rollback Plan

- Keep Karmada policies available but disabled
- If needed, remove BindingPolicy and re-enable Karmada propagation

## Post-Migration Optimization

- Consolidate policies using labels instead of enumerating cluster names
- Adopt ring-based release management
- Standardize workload labeling

