# Helm Chart Distribution

## Problem Statement

You need to distribute and manage **Helm-based applications** consistently across many clusters (dev/stage/prod, regions, edge sites), while keeping values controlled and rollouts safe.

## Architecture

- **WDS**: holds Helm-rendered manifests or a higher-level definition that results in Kubernetes objects
- **ITS**: transports those objects to WECs based on labels
- **WECs**: run the workloads; differences handled by transforms or controlled value sets

## Implementation Workflow

### Step 1: Decide the distribution approach

Common patterns:

1. **Render Helm in CI → apply manifests to WDS**  
   - Deterministic output, GitOps-friendly
   - KubeStellar syncs native Kubernetes objects

2. **Helm per cluster group (platform pipeline) + KubeStellar for app resources**  
   - Useful when clusters differ (ingress, storage class)

This prototype demonstrates (1): render and apply native YAML to WDS, then use BindingPolicy for placement.

### Step 2: Apply rendered manifests to WDS

Label everything consistently:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mychart-web
  namespace: mychart
  labels:
    app.kubernetes.io/part-of: mychart
    app.kubernetes.io/managed-by: helm
spec:
  replicas: 2
  selector:
    matchLabels:
      app.kubernetes.io/name: mychart-web
  template:
    metadata:
      labels:
        app.kubernetes.io/name: mychart-web
        app.kubernetes.io/part-of: mychart
    spec:
      containers:
      - name: web
        image: nginx:1.25
```

### Step 3: BindingPolicy to distribute the chart

```yaml
apiVersion: control.kubestellar.io/v1alpha1
kind: BindingPolicy
metadata:
  name: mychart-rollout
spec:
  clusterSelectors:
  - matchLabels:
      environment: staging
  downsync:
  - objectSelectors:
    - matchLabels:
        app.kubernetes.io/part-of: mychart
    resources:
    - namespaces
    - configmaps
    - secrets
    - services
    - deployments
```

### Step 4: Validate

```bash
kubectl get deploy -n mychart --context cluster1
kubectl get deploy -n mychart --context cluster2
```

## Recommended Configurations

### BindingPolicy Example

```yaml
apiVersion: control.kubestellar.io/v1alpha1
kind: BindingPolicy
metadata:
  name: mychart-prod
spec:
  clusterSelectors:
  - matchLabels:
      environment: production
  downsync:
  - objectSelectors:
    - matchLabels:
        app.kubernetes.io/part-of: mychart
    resources:
    - namespaces
    - services
    - deployments
```

### Workload Example

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: mychart
  labels:
    app.kubernetes.io/part-of: mychart
```

## Expected Outcomes

- “One chart release” becomes “one workload set” in the WDS
- Placement and rollout scope controlled by cluster labels
- Consistent multi-cluster deployments without manual context switching

## Variations and Adaptations

- Ring-based rollouts (`ring=canary`, `ring=stable`)
- Per-cluster-group values (render different manifests per ring/region)
- Transforms for ingress/storage annotations

## Troubleshooting

- Conflicts (“already exists”): use dedicated namespaces per release
- Divergent cluster capabilities: split chart into common + cloud-specific overlays

## Next Steps

- Define a standard “Helm-to-WDS” pipeline template
- Add policy-driven promotion: staging → production by changing labels

