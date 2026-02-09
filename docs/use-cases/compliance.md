# Regional Compliance (Data Residency)

## Problem Statement

You must comply with **data residency and regulatory requirements** (GDPR, sovereignty rules, contractual localization). Workloads handling sensitive data must run only in approved regions, while other workloads can run globally.

## Architecture

- **WDS**: defines workloads with clear labels indicating data sensitivity
- **ITS**: inventories clusters and labels them by compliance scope (region, jurisdiction)
- **WECs**: clusters in specific regions, labeled with `residency=eu`, `jurisdiction=gdpr`, etc.

## Implementation Workflow

### Step 1: Label compliant clusters

In the **ITS** context:

```bash
kubectl config use-context its1
kubectl label managedcluster eu-west-1 residency=eu jurisdiction=gdpr --overwrite
kubectl label managedcluster us-east-1 residency=us jurisdiction=us --overwrite
```

### Step 2: Label workloads by sensitivity

In the **WDS**:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pii-api
  namespace: compliance-demo
  labels:
    app.kubernetes.io/name: pii-api
    data-classification: pii
spec:
  replicas: 2
  selector:
    matchLabels:
      app.kubernetes.io/name: pii-api
  template:
    metadata:
      labels:
        app.kubernetes.io/name: pii-api
        data-classification: pii
    spec:
      containers:
      - name: api
        image: ghcr.io/example/pii-api:1.0.0
        ports:
        - containerPort: 8080
```

### Step 3: Use BindingPolicy to enforce residency

Deploy PII workloads only to EU clusters:

```yaml
apiVersion: control.kubestellar.io/v1alpha1
kind: BindingPolicy
metadata:
  name: pii-eu-only
  namespace: compliance-demo
spec:
  clusterSelectors:
  - matchLabels:
      residency: eu
  downsync:
  - objectSelectors:
    - matchLabels:
        data-classification: pii
    resources:
    - namespaces
    - deployments
    - services
```

### Step 4: Validate

```bash
kubectl get deploy -n compliance-demo --context eu-west-1
kubectl get deploy -n compliance-demo --context us-east-1
```

## Recommended Configurations

### BindingPolicy Example

```yaml
apiVersion: control.kubestellar.io/v1alpha1
kind: BindingPolicy
metadata:
  name: residency-policy
spec:
  clusterSelectors:
  - matchLabels:
      jurisdiction: gdpr
  downsync:
  - objectSelectors:
    - matchLabels:
        compliance-scope: gdpr
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
kind: Secret
metadata:
  name: pii-db-credentials
  namespace: compliance-demo
  labels:
    compliance-scope: gdpr
type: Opaque
stringData:
  username: demo
  password: demo
```

## Expected Outcomes

- Policy-driven placement ensures regulated workloads run only in approved regions
- Reduced operational risk and audit complexity
- Simple, label-based governance model

## Variations and Adaptations

- Split policies by data class (`pii`, `phi`, `financial`)
- Add transforms for region-specific endpoints/annotations
- Separate namespaces per compliance domain

## Troubleshooting

- Verify cluster labels reflect the compliance domain
- Ensure workloads have correct classification labels

## Next Steps

- Add policy-as-code workflows for label governance
- Integrate audit logging and continuous compliance checks

