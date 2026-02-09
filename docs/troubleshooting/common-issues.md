# Common Issues (20)

This page contains **20 common issues** encountered when installing and operating KubeStellar. Each entry includes symptoms, logs, root cause, resolution, prevention, and related commands.

> Tip: Start by confirming which context you’re targeting (`wds1` vs `its1` vs a WEC context) and collecting logs from the controller pods in the hosting cluster namespace (commonly `kubeflex-system`).

---

### Issue #1: WEC Registration Fails {#issue-1-wec-registration-fails}

**Symptoms**:
- `clusteradm join` fails or times out
- `ManagedCluster` status stays `Unknown` / `Offline`

**Log Signature**:

```log
ERROR unable to join cluster: connection refused
```

**Root Cause**:
- WEC cannot reach ITS API endpoint
- Wrong hub API server passed to `clusteradm join`
- Firewall / proxy blocks OCM traffic

**Resolution Steps**:
1. Confirm ITS endpoint:

```bash
kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}' --context its1
echo
```

2. From the WEC, test connectivity (best-effort):

```bash
curl -k "$(kubectl config view -o jsonpath='{.clusters[?(@.name=="its1")].cluster.server}')" || true
```

3. Re-run join with the correct hub apiserver/token.
4. Verify OCM agent namespaces/pods exist on the WEC.

**Prevention**:
- Validate network reachability before joining
- Keep a small script that prints hub endpoint + token status

**Related Commands**:

```bash
kubectl get managedclusters --context its1
clusteradm get token --context its1
```

---

### Issue #2: Helm Chart Installation Fails {#issue-2-helm-chart-installation-fails}

**Symptoms**:
- `helm upgrade --install ... oci://ghcr.io/...` fails
- Helm cannot pull chart or images

**Log Signature**:

```log
failed to fetch oci chart: unauthorized: authentication required
```

**Root Cause**:
- Corporate proxy blocks `ghcr.io`
- Helm OCI registry auth issues
- Network/DNS problems

**Resolution Steps**:
1. Verify registry reachability:

```bash
curl -I https://ghcr.io || true
```

2. Ensure Helm supports OCI (Helm 3+ does).
3. If auth is required in your environment, perform registry login:

```bash
helm registry login ghcr.io
```

4. Retry installation.

**Prevention**:
- Document proxy and registry requirements up front
- Provide “offline mirror” instructions for restricted environments

**Related Commands**:

```bash
helm version
helm upgrade --install ks-core oci://ghcr.io/kubestellar/kubestellar/core-chart --version "$kubestellar_version"
```

---

### Issue #3: Context Creation Fails {#issue-3-context-creation-fails}

**Symptoms**:
- `kflex ctx --overwrite-existing-context wds1` fails
- Context points to the wrong cluster

**Log Signature**:

```log
error: hosting context not set
```

**Root Cause**:
- KubeFlex “hosting cluster” extension state in kubeconfig is missing or wrong

**Resolution Steps**:
1. Switch to the hosting cluster context (e.g., `kind-kubeflex`).
2. Set hosting context:

```bash
kflex ctx --set-current-for-hosting
```

3. Recreate contexts:

```bash
kflex ctx --overwrite-existing-context its1
kflex ctx --overwrite-existing-context wds1
```

**Prevention**:
- Always run `kflex ctx --set-current-for-hosting` after (re)installing via Helm

**Related Commands**:

```bash
kubectl config get-contexts
kflex version
```

---

### Issue #4: Version Compatibility Issues {#issue-4-version-compatibility-issues}

**Symptoms**:
- Pre-req checks fail
- Controllers crashloop after install

**Log Signature**:

```log
structured version ... is less than required minimum
```

**Root Cause**:
- `clusteradm` version is incompatible (too old or too new)
- Mixed versions across KubeStellar/KubeFlex

**Resolution Steps**:
1. Run the upstream pre-req checker:

```bash
bash <(curl -s https://raw.githubusercontent.com/kubestellar/kubestellar/"$kubestellar_version"/scripts/check_pre_req.sh) kflex ocm helm kubectl docker kind
```

2. Align tool versions to the documented matrix (release notes).
3. Reinstall if necessary.

**Prevention**:
- Pin versions in docs and scripts
- Add a “known good” quickstart toolchain block

**Related Commands**:

```bash
clusteradm version
kflex version
kubectl version --client
helm version
```

---

### Issue #5: BindingPolicy Not Working {#issue-5-bindingpolicy-not-working}

**Symptoms**:
- `kubectl apply -f bindingpolicy.yaml` fails
- API server says kind not recognized

**Log Signature**:

```log
no matches for kind "BindingPolicy" in version "control.kubestellar.io/v1alpha1"
```

**Root Cause**:
- KubeStellar CRDs not installed in the WDS
- You are applying to the wrong context (not WDS)

**Resolution Steps**:
1. Confirm you are in the WDS context:

```bash
kubectl config current-context
```

2. Check CRDs (in WDS):

```bash
kubectl api-resources | grep -i kubestellar
```

3. If missing, verify core installation completed and WDS exists; re-run Helm install if needed.

**Prevention**:
- Add “context sanity check” callouts in docs

**Related Commands**:

```bash
kubectl get crd | grep kubestellar || true
```

---

### Issue #6: BindingPolicy Not Matching Objects {#issue-6-bindingpolicy-not-matching-objects}

**Symptoms**:
- `BindingPolicy` exists, but **nothing is selected** (no objects downsynced)
- The generated `Binding` shows **zero workload objects**

**Log Signature**:

```log
no objects matched objectSelectors
```

**Root Cause**:
- Workload labels don’t match `objectSelectors`
- Objects exist in a different namespace than you assumed
- `resources` list doesn’t include the kinds you expected

**Resolution Steps**:
1. Confirm the workload labels in the **WDS**:

```bash
kubectl --context wds1 get deploy -A --show-labels
```

2. Inspect your policy:

```bash
kubectl --context wds1 get bindingpolicy -A -o yaml | head -n 120
```

3. Inspect the generated `Binding` (concrete matches):

```bash
kubectl --context wds1 get bindings -A
kubectl --context wds1 describe binding -n <ns> <binding-name>
```

4. Fix labels to match (either the workload or the policy).

**Prevention**:
- Standardize on `app.kubernetes.io/name` and `app.kubernetes.io/part-of`
- Add a “label checklist” section to your quickstart

**Related Commands**:

```bash
kubectl --context wds1 get deploy -A --show-labels
kubectl --context wds1 get bindingpolicies -A
```

---

### Issue #7: BindingPolicy Not Matching Clusters {#issue-7-bindingpolicy-not-matching-clusters}

**Symptoms**:
- Workloads go to **no clusters** (or the wrong set)
- `Binding` shows **0 matched clusters**

**Log Signature**:

```log
clusterSelectors matched 0 clusters
```

**Root Cause**:
- `ManagedCluster` objects in the ITS are not labeled as expected
- You’re inspecting/labeling a different ITS than the one used for transport

**Resolution Steps**:
1. Inspect cluster labels (ITS context):

```bash
kubectl get managedclusters --context its1 --show-labels
```

2. Add or fix labels:

```bash
kubectl label managedcluster --context its1 cluster1 location-group=edge --overwrite
```

3. Re-evaluate `clusterSelectors`.

**Prevention**:
- Establish a standard label taxonomy: `environment`, `region`, `location-group`, `provider`

**Related Commands**:

```bash
kubectl describe managedcluster --context its1 cluster1
```

---

### Issue #8: Namespace Exists in WDS but Not on WECs {#issue-8-namespace-missing-on-wecs}

**Symptoms**:
- Workload objects appear on WECs **partially**
- Namespaced resources fail because the namespace doesn’t exist

**Log Signature**:

```log
namespaces "demo" not found
```

**Root Cause**:
- `BindingPolicy` doesn’t include `namespaces` in `resources`
- Using `createOnly` clauses incorrectly

**Resolution Steps**:
1. Add `namespaces` to policy downsync resources:

```yaml
downsync:
- objectSelectors:
  - matchLabels:
      app.kubernetes.io/name: nginx
  resources:
  - namespaces
  - deployments
```

2. Re-apply BindingPolicy and wait for sync.

**Prevention**:
- Always include `namespaces` when downsyncing namespaced objects into new namespaces

**Related Commands**:

```bash
kubectl get ns --context cluster1 | grep demo || true
```

---

### Issue #9: Status Collection Not Working {#issue-9-status-collection-not-working}

**Symptoms**:
- Workloads deploy to WECs, but **status in WDS** is missing/stale
- You can see pods on WECs, but WDS does not reflect progress

**Log Signature**:

```log
WorkStatus not found / CombinedStatus missing results
```

**Root Cause**:
- Status add-on components not healthy in ITS/WEC
- Agent cannot report status (RBAC/network)
- Collector configuration missing/misconfigured (depending on setup)

**Resolution Steps**:
1. Verify WECs are `Available` in the ITS:

```bash
kubectl --context its1 get managedclusters
```

2. Check for status-related objects in ITS (names vary by setup):

```bash
kubectl --context its1 get workstatus -A || true
kubectl --context its1 get appliedmanifestworks -A || true
```

3. Check OCM agent + addon pods on the WEC:

```bash
kubectl --context cluster1 get pods -A | findstr /i "open-cluster-management" || true
```

4. Inspect transport/controller logs in the hosting cluster:

```bash
kubectl logs -n kubeflex-system -l app=transport-controller --tail=200
```

**Prevention**:
- Include “status expectations” and verification checks in quickstart
- Provide a “known-good” status validation script

**Related Commands**:

```bash
kubectl --context wds1 get bindings -A
kubectl --context its1 get managedclusters
```

---

### Issue #10: Workload Synchronization Issues {#issue-10-workload-synchronization-issues}

**Symptoms**:
- Changes in WDS take minutes to appear on WECs

**Log Signature**:

```log
requeueing due to backoff
```

**Root Cause**:
- Resource pressure on controllers
- High API server latency
- Many objects/clusters causing scaling pressure

**Resolution Steps**:
1. Check controller pod health and CPU/memory:

```bash
kubectl top pods -n kubeflex-system || true
```

2. Reduce noise: limit selectors, reduce object scope, test with a small workload.
3. Scale controller deployments if appropriate (prototype note).

**Prevention**:
- Provide sizing guidance for demo vs production

**Related Commands**:

```bash
kubectl get deploy -n kubeflex-system
```

---

### Issue #11: CRD Synchronization Problems {#issue-11-crd-synchronization-problems}

**Symptoms**:
- CustomResources fail to apply on WEC
- WEC reports unknown kind

**Log Signature**:

```log
no matches for kind "Foo" in version "example.com/v1"
```

**Root Cause**:
- CRD not installed on WECs
- Ordering issue: CRs delivered before CRDs

**Resolution Steps**:
1. Ensure CRDs are installed/synced before CRs.
2. Add a policy clause for CRDs first (or pre-install CRDs on WECs).

**Prevention**:
- Document CRD-first ordering strategy

**Related Commands**:

```bash
kubectl get crd --context cluster1 | grep example.com || true
```

---

### Issue #12: Helm Chart Deployment Issues {#issue-12-helm-chart-deployment-issues}

**Symptoms**:
- Helm releases inconsistent across WECs
- Values differ unintentionally

**Log Signature**:

```log
Error: rendered manifests contain a resource that already exists
```

**Root Cause**:
- Chart assumptions conflict with existing resources
- Namespace collisions
- Different cluster capabilities

**Resolution Steps**:
1. Use a dedicated namespace per release.
2. Ensure consistent value overrides for cluster-specific needs.
3. Validate with a single WEC first.

**Prevention**:
- Provide “Helm distribution pattern” docs and templates

**Related Commands**:

```bash
helm list -A --kube-context cluster1
helm list -A --kube-context cluster2
```

---

### Issue #13: Transform Configuration Errors {#issue-13-transform-configuration-errors}

**Symptoms**:
- Objects reach WECs but are malformed or rejected

**Log Signature**:

```log
admission webhook denied the request: validation failed
```

**Root Cause**:
- Transform template produces invalid YAML/fields
- WEC has stricter policies (PSA, Gatekeeper)

**Resolution Steps**:
1. Validate manifests produced by transforms.
2. Check WEC admission policies.
3. Start with minimal transforms and iterate.

**Prevention**:
- Provide “transform testing harness” instructions

**Related Commands**:

```bash
kubectl get customtransforms -A || true
kubectl logs -n kubeflex-system -l app=transport-controller
```

---

### Issue #14: Network Policies Blocking Traffic {#issue-14-network-policies-blocking-traffic}

**Symptoms**:
- WEC agents can’t reach ITS
- Workloads can’t reach dependencies

**Log Signature**:

```log
i/o timeout
```

**Root Cause**:
- Default-deny NetworkPolicy in critical namespaces
- Egress blocked to ITS endpoint

**Resolution Steps**:
1. List NetworkPolicies on WEC:

```bash
kubectl get networkpolicy -A --context cluster1
```

2. Allow required egress for OCM agents and workloads.

**Prevention**:
- Document baseline network policy requirements

**Related Commands**:

```bash
kubectl get pods -n open-cluster-management-agent --context cluster1
```

---

### Issue #15: OCM Agent Connection Issues {#issue-15-ocm-agent-connection-issues}

**Symptoms**:
- ManagedCluster goes Offline
- `open-cluster-management-agent` pods restarting

**Log Signature**:

```log
failed to get bootstrap kubeconfig
```

**Root Cause**:
- Token expired/invalid
- Hub endpoint changed
- RBAC issues on WEC

**Resolution Steps**:
1. Inspect agent pods:

```bash
kubectl get pods -n open-cluster-management-agent --context cluster1
kubectl logs -n open-cluster-management-agent --context cluster1 -l app=klusterlet --tail=200
```

2. Re-join the WEC with a fresh token if needed.

**Prevention**:
- Rotate tokens carefully; document rejoin procedure

**Related Commands**:

```bash
clusteradm get token --context its1
clusteradm join --help
```

---

### Issue #16: Authentication/Authorization Errors {#issue-16-auth-authorization}

**Symptoms**:
- `Forbidden` when reading/writing resources in WDS/ITS
- Setup steps fail even though contexts exist

**Log Signature**:

```log
Error from server (Forbidden): ... is forbidden: User ... cannot ...
```

**Root Cause**:
- Missing RBAC in WDS/ITS
- Wrong kubeconfig context/user identity

**Resolution Steps**:
1. Confirm identity:

```bash
kubectl auth whoami || true
```

2. Check access:

```bash
kubectl auth can-i create bindingpolicies.control.kubestellar.io -A
```

3. Fix RBAC or use a privileged context for setup.

**Prevention**:
- Provide pre-made RBAC roles for common personas (platform admin, app team)

**Related Commands**:

```bash
kubectl get clusterrolebinding | head
```

---

### Issue #17: Multi-Tenancy Conflicts (Quota + Namespace) {#issue-17-multi-tenancy-conflicts}

**Symptoms**:
- Pods not created; events mention **quota exceeded**
- Unexpected collisions from shared namespaces

**Log Signature**:

```log
exceeded quota: compute-resources
```

**Root Cause**:
- Namespace quotas too strict on a WEC
- Multiple teams targeting the same namespace/resource names

**Resolution Steps**:
1. Inspect ResourceQuota:

```bash
kubectl get resourcequota -n demo --context cluster1 -o yaml
```

2. Increase quota or reduce requested resources.
3. Adopt unique namespaces per team/app and consistent naming.

**Prevention**:
- Provide recommended quotas for tutorial namespaces

**Related Commands**:

```bash
kubectl describe quota -n demo --context cluster1
```

---

### Issue #18: Storage Issues {#issue-18-storage-issues}

**Symptoms**:
- Pods stuck `Pending` due to PVC issues
- Events show missing `StorageClass` or volume provisioning failures

**Log Signature**:

```log
failed to provision volume with StorageClass
```

**Root Cause**:
- No default `StorageClass` on the WEC
- Cloud CSI not installed / misconfigured
- Storage policies block provisioning

**Resolution Steps**:
1. Check PVC events:

```bash
kubectl --context cluster1 get pvc -A
kubectl --context cluster1 describe pvc -n <ns> <pvc-name>
```

2. Check StorageClasses:

```bash
kubectl --context cluster1 get storageclass
```

3. Install/enable a CSI driver or set a default StorageClass.

**Prevention**:
- Validate WEC baseline capabilities before onboarding (CNI + DNS + StorageClass)
- Provide “WEC readiness checks” in onboarding docs

**Related Commands**:

```bash
kubectl get ns --context cluster1
```

---

### Issue #19: Upgrade Problems {#issue-19-upgrade-problems}

**Symptoms**:
- After upgrade, policies stop syncing or controllers crashloop

**Log Signature**:

```log
failed to decode object: unknown field
```

**Root Cause**:
- CRD schema changes
- Mixed controller versions across components

**Resolution Steps**:
1. Review release notes and upgrade path.
2. Upgrade CRDs first if required.
3. Restart controller deployments after upgrade.

**Prevention**:
- Provide explicit upgrade playbooks + compatibility notes

**Related Commands**:

```bash
helm history ks-core
kubectl rollout status deploy -n kubeflex-system --all
```

---

### Issue #20: Cleanup and Uninstallation {#issue-20-cleanup-and-uninstallation}

**Symptoms**:
- Reinstall fails due to leftover resources
- Old contexts remain in kubeconfig

**Log Signature**:

```log
cannot re-use a name that is still in use
```

**Root Cause**:
- Kind/k3d clusters still exist
- Helm release not fully removed
- kubeconfig contexts not deleted

**Resolution Steps**:
1. Remove Helm release:

```bash
helm uninstall ks-core || true
```

2. Delete demo clusters and contexts:

```bash
kind delete cluster --name kubeflex || true
kind delete cluster --name cluster1 || true
kind delete cluster --name cluster2 || true
kubectl config delete-context its1 || true
kubectl config delete-context wds1 || true
```

3. Re-run install from scratch.

**Prevention**:
- Provide a one-command cleanup script for demos

**Related Commands**:

```bash
kubectl config get-contexts
helm list -A
```

