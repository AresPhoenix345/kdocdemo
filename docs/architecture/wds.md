# Workload Description Space (WDS)

## What is a WDS?

A **Workload Description Space (WDS)** is a Kubernetes-like API server with storage that acts as the primary user interface for defining and managing workloads for multi-cluster deployment.

In practice, a WDS:
- Stores workload definitions in **native Kubernetes format**
- Stores KubeStellar control objects (`BindingPolicy`, `Binding`, status collectors, transforms)
- Stores or reflects status information gathered from WECs

## The “Denaturing” Idea (Why WDS feels like Kubernetes)

KubeStellar’s goal is to let you use familiar tools (kubectl, Helm, GitOps) while avoiding the operational pain of managing each cluster independently.

In a WDS, you can:
- `kubectl apply` Deployments/Services/ConfigMaps exactly like normal
- Use your existing tooling to define desired state once

But the WDS is not where workloads *run*—it’s where they’re *defined*.

## Creating a WDS

Common approaches:

- **Core Helm chart** (recommended for quickstart/demo)
- **KubeFlex CLI** creating a `ControlPlane` backed by vcluster/host/external

Example (context creation):

```bash
kflex ctx --overwrite-existing-context <wds-name>
kubectl config use-context <wds-name>
```

## Working with a WDS

Typical workflow:

1. Apply workload objects (your app manifests).
2. Apply `BindingPolicy` objects to select clusters and workloads.
3. Watch the generated `Binding` objects to confirm concrete matches.
4. Inspect aggregated status and/or check WECs directly.

## Controllers associated with a WDS

For each WDS, KubeStellar typically runs:
- **KubeStellar Controller Manager**
- **Transport Controller**

These are usually deployed in the KubeFlex hosting cluster and act on behalf of the WDS.

## Practical Tips

- Always confirm your current context before applying policies:

```bash
kubectl config current-context
```

- If `BindingPolicy` isn’t recognized, you’re likely not in a WDS context (or CRDs aren’t installed).

## Next Steps

- Read **[BindingPolicy](./binding-policy.md)** to understand placement and selection
- Read **[ITS](./its.md)** to understand inventory + transport

