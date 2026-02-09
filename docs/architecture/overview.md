# Architecture Overview

KubeStellar provides **multi-cluster deployment of native Kubernetes objects** (no wrapping/bundling) controlled by simple, declarative **`BindingPolicy`** objects.

## High-Level Data Flow

1. **Define workloads in WDS** (native Kubernetes YAML)
2. **Select target clusters using BindingPolicy**
3. **ITS transports** workload objects to cluster “mailboxes” (OCM)
4. **WECs execute** workloads and report status back

## Core Building Blocks

### Workload Description Space (WDS)

- A Kubernetes-like API server used as the **staging/definition** space
- Stores:
  - Workload objects (Deployments, Services, ConfigMaps, CRDs, …)
  - Control objects (`BindingPolicy`, `Binding`, status collectors, transforms)
  - Aggregated status

See: **[WDS](./wds.md)**.

### Inventory and Transport Space (ITS)

- Inventory of registered WECs (as OCM `ManagedCluster` objects)
- Transport hub for workload distribution
- Contains per-WEC “mailbox namespaces” where transport places `ManifestWork`

See: **[ITS](./its.md)**.

### Workload Execution Clusters (WECs)

- The real Kubernetes clusters where workloads run
- Run OCM agent (klusterlet) and receive workload objects from ITS
- Labeled for targeting with BindingPolicies

See: **[WECs](./wecs.md)**.

### BindingPolicy (Placement Control)

- Defines:
  - Which **clusters** match (via `clusterSelectors`)
  - Which **objects** match (via downsync object selectors)
- KubeStellar converts BindingPolicy → Binding to show concrete matches

See: **[BindingPolicy](./binding-policy.md)**.

## Modules (Conceptual)

- **KubeFlex**: creates and tracks “spaces” (WDS/ITS) as control planes
- **KubeStellar Controller Manager**: translates policies and manages status sync
- **Transport Controller**: projects WDS intent into ITS (OCM) objects and manages distribution
- **OCM Cluster Manager (in ITS)**: syncs `ManifestWork` to each WEC
- **OCM Agent (in WEC)**: applies objects into the WEC and reports status

## Why This Matters for Docs & Self-Service

The architecture implies a documentation structure that matches user intent:

- “I want to get a demo system up fast” → **Quickstart**
- “I don’t understand spaces/contexts” → **Architecture**
- “My workload didn’t appear on clusters” → **Troubleshooting**
- “I’m moving from ArgoCD/Karmada” → **Migration**

