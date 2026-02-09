# Workload Execution Clusters (WECs)

## What is a WEC?

A **Workload Execution Cluster (WEC)** is a Kubernetes cluster where KubeStellar actually deploys and runs workloads defined in a WDS.

WECs:
- Run the actual workloads
- Connect to the ITS through OCM (klusterlet agent)
- Are registered in the ITS as `ManagedCluster` objects
- Are labeled for targeting via BindingPolicies

## Requirements

To function as a WEC, a cluster should:

1. Have network connectivity to the ITS endpoint
2. Have a working Kubernetes control plane
3. Run OCM agent components after registration
4. Be registered with an ITS

## Creating WECs (Common Options)

For development/testing:

```bash
kind create cluster --name cluster1
kubectl config rename-context kind-cluster1 cluster1
```

```bash
k3d cluster create cluster1
kubectl config rename-context k3d-cluster1 cluster1
```

For edge:
- MicroShift (resource constrained)

For production:
- EKS / GKE / AKS / OpenShift / any conformant Kubernetes

## Registering a WEC (Conceptual)

Registration installs the agent and establishes trust with the ITS:

```bash
clusteradm --context its1 get token
clusteradm join --hub-token <token> --hub-apiserver <api-server-url> --cluster-name cluster1 --context cluster1
clusteradm --context its1 accept --clusters cluster1
```

> Your quickstart may use a script or a slightly different join flow; the goal is the same: `ManagedCluster` becomes `Available`.

## Labeling WECs

Label clusters in the ITS so BindingPolicies can select them:

```bash
kubectl --context its1 label managedcluster cluster1 location-group=edge environment=staging --overwrite
```

## Monitoring & Health

In the ITS context:

```bash
kubectl --context its1 get managedclusters
kubectl --context its1 describe managedcluster cluster1
```

On the WEC itself, confirm agent pods:

```bash
kubectl --context cluster1 get pods -n open-cluster-management-agent
```

## Next Steps

- Use **[BindingPolicy](./binding-policy.md)** to place workloads onto WECs
- If workloads don’t show up, start with **[Troubleshooting](../troubleshooting/index.md)**

