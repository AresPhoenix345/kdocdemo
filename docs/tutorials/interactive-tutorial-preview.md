# Interactive Tutorial Preview

The KubeStellar Interactive Tutorial is a browser-based learning environment powered by [Killercoda](https://killercoda.com/). No local installation required - everything runs in your browser!

## Overview

This interactive tutorial provides a hands-on learning experience where you can:

- ✅ Practice KubeStellar operations in a real environment
- ✅ Get instant feedback on your actions
- ✅ Learn through guided exercises
- ✅ Access contextual help and hints
- ✅ Verify your understanding automatically

## Learning Objectives

By completing this tutorial, you will:

1. Understand KubeStellar's core architecture
2. Create and configure WDS and ITS spaces
3. Register and label Workload Execution Clusters
4. Write effective BindingPolicies
5. Deploy applications across multiple clusters
6. Monitor and troubleshoot deployments

## Tutorial Structure

### Module 1: Environment Exploration (10 minutes)

**What you'll do:**
- Explore your pre-configured KubeStellar environment
- Understand the relationship between WDS, ITS, and WECs
- Learn to navigate between contexts
- Verify component health

**Key Commands:**
```bash
kubectl config get-contexts
kubectl get managedclusters --context its1
kubectl api-resources --context wds1
```

**Verification Check:**
- ✅ List all available contexts
- ✅ Identify WDS and ITS contexts
- ✅ Verify cluster registration

### Module 2: Creating Your First WDS (10 minutes)

**What you'll do:**
- Create a new Workload Description Space
- Configure kubeconfig access
- Understand WDS capabilities
- Create your first namespace

**Key Commands:**
```bash
kflex create wds-tutorial --type vcluster
kflex ctx wds-tutorial
kubectl create namespace demo
```

**Verification Check:**
- ✅ WDS created successfully
- ✅ Context configured correctly
- ✅ Can create resources in WDS

### Module 3: Registering Clusters (15 minutes)

**What you'll do:**
- Register a new WEC with your ITS
- Apply meaningful labels
- Verify registration status
- Understand labeling strategies

**Key Commands:**
```bash
clusteradm get token --context its1
clusteradm join --hub-token-file token.yaml --cluster-name my-cluster
kubectl label managedcluster my-cluster environment=production
```

**Verification Check:**
- ✅ Cluster appears in ITS inventory
- ✅ Labels applied correctly
- ✅ OCM agent running on WEC

### Module 4: Writing BindingPolicies (15 minutes)

**What you'll do:**
- Understand BindingPolicy structure
- Write cluster selectors
- Define object selectors
- Test policy matching

**Example Policy:**
```yaml
apiVersion: control.kubestellar.io/v1alpha1
kind: BindingPolicy
metadata:
  name: web-app-policy
spec:
  clusterSelectors:
  - matchLabels:
      environment: production
  downsync:
  - objectSelectors:
    - matchLabels:
        app: web-app
    resources:
    - deployments
    - services
```

**Verification Check:**
- ✅ Policy created successfully
- ✅ Binding object generated
- ✅ Correct clusters matched
- ✅ Correct objects matched

### Module 5: Deploying and Verifying (15 minutes)

**What you'll do:**
- Deploy a sample application
- Verify synchronization to WECs
- Check deployment status
- Troubleshoot common issues

**Deployment Example:**
```bash
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  labels:
    app: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
EOF
```

**Verification Check:**
- ✅ Deployment created in WDS
- ✅ Synchronized to target WECs
- ✅ Pods running on WECs
- ✅ Status aggregated in WDS

## Features

### Automated Verification

Each module includes automated checks that verify:
- Commands executed correctly
- Resources created as expected
- Configurations applied properly
- System state matches objectives

### Contextual Hints

Get help when you need it:
- Hover over commands for explanations
- Click "Hint" buttons for guidance
- Access reference documentation
- See example solutions

### Progress Tracking

- Track your progress through modules
- Resume where you left off
- Review completed exercises
- Earn completion badges

## Prerequisites

**None!** The tutorial environment includes:
- Pre-configured KubeStellar installation
- Multiple clusters ready to use
- All tools pre-installed
- Sample workloads available

## Estimated Completion Time

- **Total**: 45-60 minutes
- **Module 1**: 10 minutes
- **Module 2**: 10 minutes
- **Module 3**: 15 minutes
- **Module 4**: 15 minutes
- **Module 5**: 15 minutes

## Access the Tutorial

The interactive tutorial will be available at:

**🔗 [Killercoda KubeStellar Tutorial](https://killercoda.com/kubestellar/scenario/kubestellar-basics)**

> **Note**: The tutorial link will be activated when the mentorship project begins.

## What's Included

### Pre-Configured Environment

- 1 Hosting cluster (KubeFlex)
- 1 ITS (Inventory and Transport Space)
- 1 WDS (Workload Description Space)
- 3 WECs (Workload Execution Clusters)
- All tools installed (kubectl, helm, kflex, clusteradm)

### Sample Workloads

- Example deployments
- Sample services
- ConfigMaps and Secrets
- Custom resources

### Reference Materials

- Command cheat sheet
- YAML examples
- Architecture diagrams
- Troubleshooting tips

## Tips for Success

1. **Read the instructions carefully** - Each step builds on the previous
2. **Use hints when stuck** - They're there to help you learn
3. **Experiment** - Try variations to deepen understanding
4. **Take notes** - Document what you learn
5. **Review verification** - Understand why checks pass or fail

## Troubleshooting

### Environment Issues

If the tutorial environment isn't loading:
- Refresh your browser
- Clear browser cache
- Try a different browser
- Check your internet connection

### Command Errors

If commands fail:
- Check syntax carefully
- Verify you're in the correct context
- Review error messages
- Use hints for guidance

### Verification Failures

If checks don't pass:
- Review what you did
- Compare with expected state
- Check resource status
- Try the hint system

## Next Steps

After completing the interactive tutorial:

1. **[Video Series](./video-series-outline.md)** - Deep dive into concepts
2. **[Use Cases](../use-cases/index.md)** - Apply to real scenarios
3. **[Architecture Docs](../architecture/overview.md)** - Understand internals
4. **[Troubleshooting](../troubleshooting/index.md)** - Handle edge cases

## Feedback

Help us improve the tutorial:

- Report bugs or issues
- Suggest improvements
- Share what worked well
- Request additional modules

---

**Ready to start?** The interactive tutorial will be available soon! 🎮
