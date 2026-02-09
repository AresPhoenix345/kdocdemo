# Migration Guides

This section provides practical migration playbooks for teams adopting KubeStellar from other multi-cluster approaches.

## Available Guides

1. **[From ArgoCD](./from-argocd.md)**: ApplicationSet → BindingPolicy mapping  
2. **[From Karmada](./from-karmada.md)**: PropagationPolicy → BindingPolicy conversion  
3. **[From Cluster API](./from-cluster-api.md)**: Cluster lifecycle → WEC registration & labeling  

## General Migration Principles

- **Start in parallel**: stand up KubeStellar alongside existing tooling first
- **Labeling is everything**: consistent cluster/workload labels make policies readable and safe
- **Promote progressively**: migrate a single workload to a subset of clusters (canary), then expand
- **Automate validation**: use repeatable checks after each phase
- **Plan rollback**: always have a cutback option until confidence is high

If you’re new to KubeStellar concepts, read **[Architecture Overview](../architecture/overview.md)** first.

