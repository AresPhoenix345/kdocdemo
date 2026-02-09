# Edge Deployment

## Problem Statement

You operate **many remote edge sites** (retail stores, manufacturing plants, telecom towers) and need to deploy the same application stack consistently—while still supporting **site-specific configuration** and **limited connectivity**.

## Architecture

- **WDS**: app team defines workloads once (Deployments/Services/ConfigMaps/CRDs)
- **ITS**: hub inventory + transport, selects edge sites by labels
- **WECs**: each edge site cluster runs the workloads

## Implementation Workflow

### Step 1: Label edge clusters (WECs)

In the **ITS** context:

```bash
kubectl config use-context its1
kubectl label managedcluster store-001 location-group=edge site=store-001 --overwrite
kubectl label managedcluster store-002 location-group=edge site=store-002 --overwrite
```

### Step 2: Define workload in WDS

In the **WDS** context:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: edge-nginx
  namespace: edge-demo
  labels:
    app.kubernetes.io/name: edge-nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: edge-nginx
  template:
    metadata:
      labels:
        app.kubernetes.io/name: edge-nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
        ports:
        - containerPort: 80
```

### Step 3: Target edge sites with BindingPolicy

```yaml
apiVersion: control.kubestellar.io/v1alpha1
kind: BindingPolicy
metadata:
  name: edge-nginx
  namespace: edge-demo
spec:
  clusterSelectors:
  - matchLabels:
      location-group: edge
  downsync:
  - objectSelectors:
    - matchLabels:
        app.kubernetes.io/name: edge-nginx
    resources:
    - namespaces
    - deployments
```

### Step 4: Validate rollout

```bash
# In WDS
kubectl config use-context wds1
kubectl get bindingpolicies -n edge-demo
kubectl get bindings -n edge-demo

# On an edge WEC
kubectl config use-context store-001
kubectl get deploy -n edge-demo
kubectl get pods -n edge-demo
```

## Recommended Configurations

### BindingPolicy Example

```yaml
apiVersion: control.kubestellar.io/v1alpha1
kind: BindingPolicy
metadata:
  name: edge-stack
spec:
  clusterSelectors:
  - matchLabels:
      location-group: edge
  downsync:
  - objectSelectors:
    - matchLabels:
        app.kubernetes.io/part-of: edge-stack
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
kind: ConfigMap
metadata:
  name: edge-config
  namespace: edge-demo
  labels:
    app.kubernetes.io/part-of: edge-stack
data:
  FEATURE_FLAG: "true"
```

## Expected Outcomes

- One workload definition drives a fleet-wide rollout
- Edge sites are targeted via labels, not manual context switching
- Updates in WDS propagate to all matched edge clusters

## Variations and Adaptations

- **Canary edge rollouts**: select a subset of sites via label (e.g., `ring=canary`)
- **Per-site overrides**: use transforms or per-site configmaps keyed by `site=...`
- **Disconnected edge**: design for delayed reconciliation and intermittent connectivity

## Troubleshooting

- If clusters don’t match: verify labels in ITS (`kubectl get managedclusters --show-labels --context its1`)
- If namespace missing: ensure `namespaces` is included in downsync resources

## Next Steps

- Expand to multi-app stacks (ingress, observability agents)
- Add status collection and dashboards
- Apply network policies and RBAC for multi-tenancy

