# Use Cases

KubeStellar shines when you need to manage **many Kubernetes clusters** (edge, multi-cloud, hybrid) while keeping a **single-cluster-like** developer workflow.

This section presents **5 real-world patterns**, each with:
- A clear problem statement
- A reference architecture
- An implementation workflow
- Copy/paste YAML for `BindingPolicy` + workload examples
- Troubleshooting and next steps

## The 5 Patterns

1. **[Edge Deployment](./edge-deployment.md)**: Retail stores, factories, telecom towers  
2. **[Multi-Cloud Orchestration](./multi-cloud.md)**: Distribute workloads across AWS/GCP/Azure  
3. **[Regional Compliance](./compliance.md)**: Data residency, GDPR, sovereignty constraints  
4. **[CRD Synchronization](./crd-sync.md)**: Distribute CRDs + custom resources consistently  
5. **[Helm Chart Distribution](./helm-charts.md)**: Controlled rollouts of charts across fleets  

## A Common Baseline Assumption

These use cases assume:
- A **WDS** where app teams define Kubernetes objects
- An **ITS** that inventories and transports to clusters (via OCM)
- Multiple **WECs** registered to the ITS and labeled for targeting

If you don’t have that yet, start with the **[Quickstart Guide](../quickstart/index.md)**.

