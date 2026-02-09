# BindingPolicy

## What is a BindingPolicy?

`BindingPolicy` is KubeStellar’s core placement mechanism. It answers two questions:

1. **Which clusters (WECs) should receive workloads?**  
   Selected by label selectors in `spec.clusterSelectors`.

2. **Which objects in the WDS should be distributed?**  
   Selected by label selectors in `spec.downsync[*].objectSelectors` plus optional resource scoping.

KubeStellar translates each `BindingPolicy` into a lower-level `Binding` object. The `Binding` is useful feedback because it shows the concrete objects and clusters that matched.

## Minimal Example

```yaml
apiVersion: control.kubestellar.io/v1alpha1
kind: BindingPolicy
metadata:
  name: example-policy
spec:
  clusterSelectors:
    - matchLabels:
        location-group: edge
  downsync:
    - objectSelectors:
        - matchLabels:
            app: nginx
      resources:
        - namespaces
        - deployments
```

## Key Fields

### `spec.clusterSelectors`

- Array of Kubernetes label selectors.
- A cluster matches if its inventory object (in ITS) matches **any** selector entry.

### `spec.downsync`

List of downsync clauses. Each clause can include:

- **`objectSelectors`**: label selectors for workload objects in WDS
- **`resources`**: list of resource kinds to include (e.g., `deployments`, `services`, `namespaces`)
- **`createOnly`**: a common pattern for “create once, don’t update” resources

## Debugging Placement

### Confirm cluster labels in ITS

```bash
kubectl --context its1 get managedclusters --show-labels
```

### Confirm workload labels in WDS

```bash
kubectl --context wds1 get deploy -A --show-labels
```

### Inspect BindingPolicy and generated Binding

```bash
kubectl --context wds1 get bindingpolicies -A
kubectl --context wds1 get bindings -A
kubectl --context wds1 describe bindingpolicy <name> -n <ns>
kubectl --context wds1 describe binding <name> -n <ns>
```

## Patterns

### Target all clusters

```yaml
clusterSelectors:
  - {}
```

### Ring-based rollout (canary → stable)

```yaml
clusterSelectors:
  - matchLabels:
      ring: canary
```

Promote by relabeling clusters or switching selector.

## Troubleshooting

If nothing syncs:

- Check you are applying to the WDS context
- Confirm CRDs exist (BindingPolicy kind recognized)
- Confirm cluster labels match selectors
- Confirm object labels match objectSelectors
- Ensure `namespaces` is included when needed

See: **[Troubleshooting](../troubleshooting/common-issues.md)**.

