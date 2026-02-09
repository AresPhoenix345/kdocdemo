# First Deployment

Congratulations! You've installed KubeStellar. Now let's deploy your first application across multiple clusters using a BindingPolicy.

## Overview

In this guide, you will:
1. Create a simple nginx deployment
2. Create a BindingPolicy to control where it runs
3. Verify the deployment across clusters
4. Understand how KubeStellar synchronizes workloads

**Estimated Time: 10 minutes**

## Step 1: Switch to WDS Context

All workload definitions go into the WDS:

```bash
kubectl config use-context wds1
```

## Step 2: Create a Namespace

Create a namespace for your application:

```bash
kubectl create namespace demo
kubectl config set-context --current --namespace=demo
```

## Step 3: Create a Deployment

Create a simple nginx deployment:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  namespace: demo
  labels:
    app.kubernetes.io/name: nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      app.kubernetes.io/name: nginx
  template:
    metadata:
      labels:
        app.kubernetes.io/name: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
        ports:
        - containerPort: 80
EOF
```

**Verify in WDS:**
```bash
kubectl get deployments -n demo
# Should show: nginx deployment
```

> **Important**: This deployment exists only in the WDS. It won't run until we create a BindingPolicy.

## Step 4: Create a BindingPolicy

A BindingPolicy tells KubeStellar which workloads should go to which clusters:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: control.kubestellar.io/v1alpha1
kind: BindingPolicy
metadata:
  name: nginx-policy
  namespace: demo
spec:
  clusterSelectors:
  - matchLabels:
      location-group: edge
  downsync:
  - objectSelectors:
    - matchLabels:
        app.kubernetes.io/name: nginx
    resources:
    - namespaces
    - deployments
EOF
```

**What this does:**
- `clusterSelectors`: Targets clusters with label `location-group=edge` (both cluster1 and cluster2)
- `downsync`: Synchronizes nginx deployments and namespaces to those clusters

**Verify BindingPolicy:**
```bash
kubectl get bindingpolicies -n demo
kubectl describe bindingpolicy nginx-policy -n demo
```

## Step 5: Check Binding Status

KubeStellar creates a `Binding` object that shows which workloads matched:

```bash
kubectl get bindings -n demo
kubectl describe binding nginx-policy -n demo
```

The Binding shows:
- Which clusters matched (`clusterSelectors`)
- Which objects matched (`objectSelectors`)
- Sync status

## Step 6: Verify Deployment on WECs

Wait a few seconds for synchronization, then check your WECs:

### Check cluster1

```bash
kubectl config use-context cluster1
kubectl get namespaces | grep demo
kubectl get deployments -n demo
kubectl get pods -n demo
```

You should see:
- `demo` namespace
- `nginx` deployment
- 2 nginx pods running

### Check cluster2

```bash
kubectl config use-context cluster2
kubectl get namespaces | grep demo
kubectl get deployments -n demo
kubectl get pods -n demo
```

Same result - the deployment is synchronized to both clusters!

## Step 7: Verify Workload Status

Switch back to WDS to see aggregated status:

```bash
kubectl config use-context wds1
kubectl get deployments -n demo -o yaml
```

The status section shows information from all clusters where the deployment is running.

## Understanding What Happened

Here's the flow:

1. **WDS**: You created a Deployment object (standard Kubernetes format)
2. **BindingPolicy**: You defined which clusters should receive it
3. **ITS**: Managed the transport of workloads to WECs
4. **WECs**: Received and executed the workloads

The key insight: **You defined workloads once in the WDS, and KubeStellar synchronized them to multiple clusters automatically.**

## Step 8: Test Updates

Let's update the deployment and see it propagate:

```bash
kubectl config use-context wds1
kubectl set image deployment/nginx nginx=nginx:1.26 -n demo
```

Wait a few seconds, then check both clusters:

```bash
kubectl config use-context cluster1
kubectl get pods -n demo -o jsonpath='{.items[0].spec.containers[0].image}'
# Should show: nginx:1.26

kubectl config use-context cluster2
kubectl get pods -n demo -o jsonpath='{.items[0].spec.containers[0].image}'
# Should show: nginx:1.26
```

Both clusters updated automatically! 🎉

## Step 9: Selective Deployment

Let's deploy to only one cluster. Update the BindingPolicy:

```bash
kubectl config use-context wds1

cat <<EOF | kubectl apply -f -
apiVersion: control.kubestellar.io/v1alpha1
kind: BindingPolicy
metadata:
  name: nginx-policy
  namespace: demo
spec:
  clusterSelectors:
  - matchLabels:
      environment: production
  downsync:
  - objectSelectors:
    - matchLabels:
        app.kubernetes.io/name: nginx
    resources:
    - namespaces
    - deployments
EOF
```

Now only `cluster1` (labeled `environment=production`) will have the deployment:

```bash
kubectl config use-context cluster1
kubectl get pods -n demo
# Should show pods

kubectl config use-context cluster2
kubectl get pods -n demo
# Should show: No resources found (deployment removed)
```

## Cleanup

To clean up this demo:

```bash
# Delete from WDS (this will remove from all clusters)
kubectl config use-context wds1
kubectl delete namespace demo

# Or delete BindingPolicy first, then deployment
kubectl delete bindingpolicy nginx-policy -n demo
kubectl delete deployment nginx -n demo
```

## Key Takeaways

1. **Workloads are defined in WDS** - Use standard Kubernetes objects
2. **BindingPolicies control placement** - Use label selectors for clusters and workloads
3. **Automatic synchronization** - Changes in WDS propagate to WECs automatically
4. **Status aggregation** - View status from all clusters in one place

## Common Patterns

### Deploy to All Clusters

```yaml
spec:
  clusterSelectors:
  - {}  # Empty selector matches all clusters
```

### Deploy to Specific Cluster

```yaml
spec:
  clusterSelectors:
  - matchLabels:
      cluster-name: production-us-east-1
```

### Deploy Multiple Workloads

```yaml
spec:
  downsync:
  - objectSelectors:
    - matchLabels:
        app: frontend
  - objectSelectors:
    - matchLabels:
        app: backend
```

## Next Steps

You've successfully deployed your first multi-cluster application! Now explore:

- **[Interactive Tutorial](../tutorials/interactive-tutorial-preview.md)** - Hands-on browser-based learning
- **[Video Series](../tutorials/video-series-outline.md)** - Comprehensive video tutorials
- **[Use Cases](../use-cases/index.md)** - Real-world deployment patterns
- **[Architecture Deep Dive](../architecture/overview.md)** - Understand how it all works

## Troubleshooting

### Deployment Not Appearing on WECs

- Check BindingPolicy: `kubectl get bindingpolicies -n demo`
- Check Binding status: `kubectl describe binding -n demo`
- Verify cluster labels: `kubectl get managedclusters --show-labels` (in ITS context)
- Check ITS logs: `kubectl logs -n kubeflex-system -l app=transport-controller`

### Status Not Updating

- Wait a few seconds for synchronization
- Check controller logs: `kubectl logs -n kubeflex-system -l app=ks-controller-manager`
- Verify WEC connectivity: `kubectl get managedclusters` (in ITS context)

---

**Congratulations!** You've completed your first KubeStellar deployment! 🚀
