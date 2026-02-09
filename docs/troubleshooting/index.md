# Troubleshooting Guide

This comprehensive troubleshooting guide covers 20 common issues you might encounter when using KubeStellar, along with their symptoms, root causes, and step-by-step resolutions.

## Quick Diagnostic Commands

Start with these commands to gather system information:

```bash
# Check KubeStellar installation
kubectl api-resources | grep kubestellar

# Verify contexts
kubectl config get-contexts

# Check controller health
kubectl get pods -n kubeflex-system

# Verify cluster registration
kubectl get managedclusters --context its1

# Check BindingPolicies
kubectl get bindingpolicies --all-namespaces
```

## Common Issues

### Installation & Setup

- [Issue #1: WEC Registration Fails](./common-issues.md#issue-1-wec-registration-fails)
- [Issue #2: Helm Chart Installation Fails](./common-issues.md#issue-2-helm-chart-installation-fails)
- [Issue #3: Context Creation Fails](./common-issues.md#issue-3-context-creation-fails)
- [Issue #4: Version Compatibility Issues](./common-issues.md#issue-4-version-compatibility-issues)

### BindingPolicy & Synchronization

- [Issue #5: BindingPolicy Not Working](./common-issues.md#issue-5-bindingpolicy-not-working)
- [Issue #6: BindingPolicy Not Matching Objects](./common-issues.md#issue-6-bindingpolicy-not-matching-objects)
- [Issue #7: BindingPolicy Not Matching Clusters](./common-issues.md#issue-7-bindingpolicy-not-matching-clusters)
- [Issue #8: Namespace Missing on WECs](./common-issues.md#issue-8-namespace-missing-on-wecs)
- [Issue #9: Status Collection Not Working](./common-issues.md#issue-9-status-collection-not-working)

### Workload Deployment

- [Issue #10: Workload Synchronization Issues](./common-issues.md#issue-10-workload-synchronization-issues)
- [Issue #11: CRD Synchronization Problems](./common-issues.md#issue-11-crd-synchronization-problems)
- [Issue #12: Helm Chart Deployment Issues](./common-issues.md#issue-12-helm-chart-deployment-issues)
- [Issue #13: Transform Configuration Errors](./common-issues.md#issue-13-transform-configuration-errors)

### Network & Connectivity

- [Issue #14: Network Policies Blocking Traffic](./common-issues.md#issue-14-network-policies-blocking-traffic)
- [Issue #15: OCM Agent Connection Issues](./common-issues.md#issue-15-ocm-agent-connection-issues)

### Resource Management

- [Issue #16: Authentication/Authorization Errors](./common-issues.md#issue-16-auth-authorization)
- [Issue #17: Multi-Tenancy Conflicts](./common-issues.md#issue-17-multi-tenancy-conflicts)
- [Issue #18: Storage Issues](./common-issues.md#issue-18-storage-issues)

### Operations

- [Issue #19: Upgrade Problems](./common-issues.md#issue-19-upgrade-problems)
- [Issue #20: Cleanup and Uninstallation](./common-issues.md#issue-20-cleanup-and-uninstallation)

## Troubleshooting Workflow

When encountering an issue:

1. **Identify Symptoms**
   - Error messages
   - Unexpected behavior
   - Missing resources

2. **Check Logs**
   ```bash
   # Controller logs
   kubectl logs -n kubeflex-system -l app=ks-controller-manager
   
   # Transport controller logs
   kubectl logs -n kubeflex-system -l app=transport-controller
   
   # OCM agent logs (on WEC)
   kubectl logs -n open-cluster-management-agent -l app=klusterlet
   ```

3. **Verify State**
   ```bash
   # Check resource status
   kubectl get all --all-namespaces
   
   # Verify cluster health
   kubectl get managedclusters --context its1
   
   # Check Binding status
   kubectl get bindings --all-namespaces
   ```

4. **Apply Solutions**
   - Follow issue-specific resolution steps
   - Check related issues
   - Review prevention tips

## Getting Help

If you can't resolve an issue:

1. **Check Documentation**
   - Review relevant guides
   - Search for similar issues

2. **Community Support**
   - [GitHub Issues](https://github.com/kubestellar/kubestellar/issues)
   - [CNCF Slack (#kubestellar-dev)](https://cloud-native.slack.com/archives/C097094RZ3M)
   - [GitHub Discussions](https://github.com/kubestellar/kubestellar/discussions)

3. **Provide Information**
   - Error messages
   - Steps to reproduce
   - Environment details
   - Logs (sanitized)

## Prevention Best Practices

- ✅ Always verify prerequisites before installation
- ✅ Use consistent versioning across components
- ✅ Label clusters meaningfully
- ✅ Test BindingPolicies in non-production first
- ✅ Monitor controller logs regularly
- ✅ Keep backups of important configurations
- ✅ Document your setup and changes

---

**Browse specific issues:** → [Common Issues](./common-issues.md)
