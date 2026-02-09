# Multi-Cloud Orchestration

## Problem Statement

You want to run the same application across **AWS, GCP, and Azure** to improve resilience, reduce vendor lock-in, and place workloads close to users—without maintaining separate deployment pipelines per cloud.

## Architecture

- **WDS**: one source of truth for workloads
- **ITS**: inventories multi-cloud WECs and transports workloads
- **WECs**: clusters in each cloud, labeled by provider/region/tier

## Implementation Workflow

### Step 1: Label clusters by cloud/region

In the **ITS** context:

```bash
kubectl config use-context its1
kubectl label managedcluster aws-us-east-1 provider=aws region=us-east-1 --overwrite
kubectl label managedcluster gcp-us-central1 provider=gcp region=us-central1 --overwrite
kubectl label managedcluster azure-eastus provider=azure region=eastus --overwrite
```

### Step 2: Define workload once in WDS

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: checkout
  namespace: shop
  labels:
    app.kubernetes.io/name: checkout
    app.kubernetes.io/part-of: shop
spec:
  replicas: 2
  selector:
    matchLabels:
      app.kubernetes.io/name: checkout
  template:
    metadata:
      labels:
        app.kubernetes.io/name: checkout
    spec:
      containers:
      - name: checkout
        image: ghcr.io/example/checkout:1.0.0
        ports:
        - containerPort: 8080
```

### Step 3: Target specific clouds via BindingPolicy

Example: deploy to AWS + GCP only (exclude Azure):

```yaml
apiVersion: control.kubestellar.io/v1alpha1
kind: BindingPolicy
metadata:
  name: checkout-multicloud
  namespace: shop
spec:
  clusterSelectors:
  - matchLabels:
      provider: aws
  - matchLabels:
      provider: gcp
  downsync:
  - objectSelectors:
    - matchLabels:
        app.kubernetes.io/name: checkout
    resources:
    - namespaces
    - deployments
    - services
```

### Step 4: Validate

```bash
# WDS: see policy and binding feedback
kubectl config use-context wds1
kubectl get bindingpolicies -n shop
kubectl get bindings -n shop

# On WECs
kubectl get deploy -n shop --context aws-us-east-1
kubectl get deploy -n shop --context gcp-us-central1
kubectl get deploy -n shop --context azure-eastus
```

## Recommended Configurations

### BindingPolicy Example

```yaml
apiVersion: control.kubestellar.io/v1alpha1
kind: BindingPolicy
metadata:
  name: shop-tier1
spec:
  clusterSelectors:
  - matchLabels:
      tier: primary
  downsync:
  - objectSelectors:
    - matchLabels:
        app.kubernetes.io/part-of: shop
    resources:
    - namespaces
    - configmaps
    - secrets
    - services
    - deployments
```

### Workload Example

```yaml
apiVersion: v1
kind: Service
metadata:
  name: checkout
  namespace: shop
  labels:
    app.kubernetes.io/name: checkout
spec:
  selector:
    app.kubernetes.io/name: checkout
  ports:
  - port: 80
    targetPort: 8080
```

## Expected Outcomes

- Single pipeline defines workloads once
- Cloud-specific targeting controlled by labels
- Faster, safer multi-cloud rollouts with policy-driven selection

## Variations and Adaptations

- **Region-based routing**: `region in (us-east-1, us-central1)` for proximity
- **Cost-optimized scheduling**: use labels for spot/preemptible pools
- **Burst to cloud**: include/exclude clouds dynamically by changing labels

## Troubleshooting

- Ensure ManagedClusters carry expected labels in ITS
- If services behave differently, reconcile cloud LB differences (annotations, ingress)

## Next Steps

- Add per-cloud transforms for annotations (load balancers, ingress classes)
- Integrate progressive delivery strategies (ring/canary)

