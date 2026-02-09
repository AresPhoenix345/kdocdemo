# Installation

This guide walks you through installing KubeStellar core components. We'll create a demo environment with one hosting cluster, one ITS, one WDS, and two WECs.

## Overview

The installation process involves:

1. Creating a hosting cluster (using kind or k3d)
2. Installing KubeFlex and KubeStellar controllers
3. Creating an ITS (Inventory and Transport Space)
4. Creating a WDS (Workload Description Space)
5. Setting up kubeconfig contexts

**Estimated Time: 10 minutes**

## Step 1: Set KubeStellar Version

Set the version you want to install:

```bash
export kubestellar_version=v0.27.1
```

> **Note**: Replace `v0.27.1` with the latest version from [GitHub Releases](https://github.com/kubestellar/kubestellar/releases)

## Step 2: Create Hosting Cluster

Choose either **kind** or **k3d** based on your preference.

### Option A: Using kind

```bash
bash <(curl -s https://raw.githubusercontent.com/kubestellar/kubestellar/${kubestellar_version}/scripts/create-kind-cluster-with-SSL-passthrough.sh) --name kubeflex --port 9443
```

### Option B: Using k3d

```bash
k3d cluster create kubeflex -p "9443:443@loadbalancer"
```

**Verify the cluster:**
```bash
kubectl cluster-info --context kind-kubeflex
# or
kubectl cluster-info --context k3d-kubeflex
```

## Step 3: Install KubeStellar Core Chart

This single Helm command installs KubeFlex, creates the ITS and WDS, and sets up all controllers:

```bash
helm upgrade --install ks-core oci://ghcr.io/kubestellar/kubestellar/core-chart \
    --version "$kubestellar_version" \
    --set-json ITSes='[{"name":"its1"}]' \
    --set-json WDSes='[{"name":"wds1"}]' \
    --set verbosity.default=5
```

**What this does:**
- Installs KubeFlex operator
- Creates ITS named `its1` (Inventory and Transport Space)
- Creates WDS named `wds1` (Workload Description Space)
- Deploys KubeStellar controller manager
- Sets up OCM (Open Cluster Management) components

**Wait for installation to complete:**
```bash
# Watch the pods come up
kubectl get pods -n kubeflex-system --watch
```

You should see pods in `Running` state:
- `kubeflex-controller-manager-*`
- `ks-controller-manager-*`
- `transport-controller-*`

## Step 4: Configure Kubeconfig Contexts

Set up contexts for accessing your ITS and WDS:

```bash
# Ensure you're using the hosting cluster context
kubectl config use-context kind-kubeflex
# or
kubectl config use-context k3d-kubeflex

# Set KubeFlex hosting context
kflex ctx --set-current-for-hosting

# Create context for ITS
kflex ctx --overwrite-existing-context its1

# Create context for WDS
kflex ctx --overwrite-existing-context wds1
```

**Verify contexts:**
```bash
kubectl config get-contexts
```

You should see:
- `kind-kubeflex` (or `k3d-kubeflex`) - hosting cluster
- `its1` - Inventory and Transport Space
- `wds1` - Workload Description Space

## Step 5: Verify Installation

### Check ITS

```bash
kubectl config use-context its1
kubectl get managedclusters
# Should show: No resources found (no WECs registered yet)
```

### Check WDS

```bash
kubectl config use-context wds1
kubectl api-resources | grep kubestellar
# Should show: bindingpolicies, bindings, etc.
```

### Check Controllers

```bash
kubectl config use-context kind-kubeflex
kubectl get deployments -n kubeflex-system
# Should show all controllers running
```

## Step 6: Create WECs (Workload Execution Clusters)

Create two clusters that will run your workloads:

### Using kind

```bash
kind create cluster --name cluster1
kind create cluster --name cluster2

kubectl config rename-context kind-cluster1 cluster1
kubectl config rename-context kind-cluster2 cluster2
```

### Using k3d

```bash
k3d cluster create cluster1
k3d cluster create cluster2

kubectl config rename-context k3d-cluster1 cluster1
kubectl config rename-context k3d-cluster2 cluster2
```

## Step 7: Register WECs with ITS

Register both clusters with your ITS:

```bash
# Switch to ITS context
kubectl config use-context its1

# Get registration token
clusteradm get token --context its1 > /tmp/token.yaml

# Register cluster1
kubectl config use-context cluster1
clusteradm join --hub-token-file /tmp/token.yaml --hub-apiserver $(kubectl config view -o jsonpath='{.clusters[?(@.name=="its1")].cluster.server}') --cluster-name cluster1 --context cluster1

# Register cluster2
kubectl config use-context cluster2
clusteradm join --hub-token-file /tmp/token.yaml --hub-apiserver $(kubectl config view -o jsonpath='{.clusters[?(@.name=="its1")].cluster.server}') --cluster-name cluster2 --context cluster2
```

**Verify registration:**
```bash
kubectl config use-context its1
kubectl get managedclusters
# Should show: cluster1 and cluster2
```

## Step 8: Label WECs

Label your clusters for targeting with BindingPolicies:

```bash
kubectl config use-context its1

# Label cluster1 as edge
kubectl label managedcluster cluster1 location-group=edge environment=production

# Label cluster2 as edge
kubectl label managedcluster cluster2 location-group=edge environment=staging
```

**Verify labels:**
```bash
kubectl get managedclusters --show-labels
```

## Installation Complete! ✅

You now have:
- ✅ Hosting cluster running KubeFlex and controllers
- ✅ ITS (its1) managing cluster inventory
- ✅ WDS (wds1) for defining workloads
- ✅ Two WECs (cluster1, cluster2) registered and labeled

## Set Shell Variables (Optional)

For use in example scenarios, set these variables:

```bash
export host_context=kind-kubeflex
export its_cp=its1
export its_context=its1
export wds_cp=wds1
export wds_context=wds1
export wec1_name=cluster1
export wec2_name=cluster2
export wec1_context=cluster1
export wec2_context=cluster2
export label_query_both="location-group=edge"
export label_query_one="environment=production"
```

## Troubleshooting

### Helm Chart Installation Fails

- Check internet connectivity
- Verify Helm can access ghcr.io: `helm repo add test oci://ghcr.io/kubestellar/kubestellar/core-chart`
- Check Docker is running

### Context Creation Fails

- Ensure you're using the hosting cluster context
- Run `kflex ctx --set-current-for-hosting` first
- Check KubeFlex pods are running: `kubectl get pods -n kubeflex-system`

### WEC Registration Fails

- Verify network connectivity between WEC and ITS
- Check ITS endpoint is accessible: `kubectl config view -o jsonpath='{.clusters[?(@.name=="its1")].cluster.server}'`
- Ensure OCM agent pods are running on WECs

## Next Steps

Now that installation is complete:

→ **[Deploy Your First Application](./first-deployment.md)**
