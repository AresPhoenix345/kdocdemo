# CRD Synchronization (Custom Resources Across Clusters)

## Problem Statement

You use Kubernetes operators (GitOps, service mesh, databases, platform APIs) that rely on **CRDs + CustomResources**. You need consistent CRD availability and CR instance deployment across a fleet of clusters.

## Architecture

- **WDS**: source of truth for CRDs and CRs
- **ITS**: transports CRDs/CRs to labeled target clusters
- **WECs**: run operators and accept CRs once CRDs exist

## Implementation Workflow

### Step 1: Ensure operators exist on WECs

KubeStellar can distribute YAML, but operators often have lifecycle needs. In many orgs:
- Operators are installed via a dedicated platform pipeline per cluster or per cluster group
- KubeStellar then distributes CR instances (and sometimes CRDs)

### Step 2: Apply CRD in WDS

Example CRD snippet (shortened):

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: widgets.example.com
  labels:
    app.kubernetes.io/part-of: widgets
spec:
  group: example.com
  names:
    plural: widgets
    singular: widget
    kind: Widget
  scope: Namespaced
  versions:
  - name: v1
    served: true
    storage: true
    schema:
      openAPIV3Schema:
        type: object
```

### Step 3: Apply CustomResource instances in WDS

```yaml
apiVersion: example.com/v1
kind: Widget
metadata:
  name: widget-demo
  namespace: widgets
  labels:
    app.kubernetes.io/part-of: widgets
spec:
  size: small
```

### Step 4: BindingPolicy with CRD-first strategy

A simple pattern is:
- downsync CRDs to all target clusters
- downsync CRs to the same target clusters
- ensure ordering by introducing “phases” in your rollout process (or pre-install CRDs)

```yaml
apiVersion: control.kubestellar.io/v1alpha1
kind: BindingPolicy
metadata:
  name: widgets-crd-and-cr
spec:
  clusterSelectors:
  - matchLabels:
      widgets-enabled: "true"
  downsync:
  - objectSelectors:
    - matchLabels:
        app.kubernetes.io/part-of: widgets
    resources:
    - customresourcedefinitions
    - namespaces
    - widgets.example.com
```

> Note: The exact `resources` value for a CR kind depends on the resource discovery and how you express it in your environment. The prototype shows the intent: “CRDs + CRs to the same clusters.”

## Recommended Configurations

### BindingPolicy Example

```yaml
apiVersion: control.kubestellar.io/v1alpha1
kind: BindingPolicy
metadata:
  name: operator-crs
spec:
  clusterSelectors:
  - matchLabels:
      operator: widgets
  downsync:
  - objectSelectors:
    - matchLabels:
        app.kubernetes.io/part-of: widgets
    resources:
    - namespaces
    - customresourcedefinitions
```

### Workload Example

```yaml
apiVersion: example.com/v1
kind: Widget
metadata:
  name: widget-prod
  namespace: widgets
  labels:
    app.kubernetes.io/part-of: widgets
spec:
  size: large
```

## Expected Outcomes

- CRDs are present where needed
- CR instances are created consistently across the fleet
- Operators can act on CRs without “unknown kind” failures

## Variations and Adaptations

- Pre-install CRDs/operators, then use KubeStellar for CRs only
- Use labels to target subsets (dev/stage/prod)
- Add transforms for cluster-specific values (storage classes, endpoints)

## Troubleshooting

- If CRs fail: verify CRD exists on WEC first
- Check for ordering issues: CR delivered before CRD

## Next Steps

- Document an “operator lifecycle” pattern (who installs operators, how upgrades happen)
- Add a validation step that asserts CRD presence before rolling CRs

