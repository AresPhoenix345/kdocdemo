# Inventory and Transport Space (ITS)

## What is an ITS?

An **Inventory and Transport Space (ITS)** is a Kubernetes-like API server with storage that provides two critical capabilities:

1. **Inventory**: tracks which WECs exist and what they are (labels/capabilities)
2. **Transport**: delivers desired objects from WDS to the appropriate WECs (via OCM)

## What Lives in an ITS?

Common contents:

- **`ManagedCluster` objects** (OCM) representing each registered WEC
- A **mailbox namespace per WEC** containing `ManifestWork` objects
- A `customization-properties` namespace with WEC properties used for customization/transforms
- OCM cluster manager components

## Creating an ITS

Typical options:

- **Core Helm chart**:

```bash
helm upgrade --install ks-core oci://ghcr.io/kubestellar/kubestellar/core-chart \
  --set-json='ITSes=[{"name":"its1","type":"vcluster"}]'
```

- **KubeFlex CLI**:

```bash
kflex create its1 --type vcluster -p ocm
```

## Registering WECs (at a glance)

WEC registration connects clusters to the ITS so they can receive workloads:

```bash
kubectl --context its1 get managedclusters
clusteradm --context its1 get token
```

After join/accept, `ManagedCluster` should become `Available`.

## Labeling Strategy (the key to safe placement)

Cluster labels are your “placement API”. Recommended baseline labels:

- `environment`: `dev` / `staging` / `prod`
- `region`: `us-east-1`, `eu-west-1`
- `provider`: `aws` / `gcp` / `azure` / `onprem`
- `location-group`: `edge` / `core`
- `ring`: `canary` / `stable`

These labels power BindingPolicy `clusterSelectors`.

## Next Steps

- Read **[WECs](./wecs.md)** for WEC requirements and registration concepts
- Read **[BindingPolicy](./binding-policy.md)** to see how cluster selection works

