# Error Reference

This page is a quick “lookup table” for common error signatures you’ll see while working with KubeStellar, especially during setup and first syncs.

## How to Use This Page

1. Copy the error string (or the most unique part of it).
2. Find the closest matching signature below.
3. Run the “Next commands” block to gather the minimum useful diagnostics.
4. Jump to the relevant entry in **[Common Issues](./common-issues.md)**.

---

## `no matches for kind "BindingPolicy" in version "control.kubestellar.io/v1alpha1"`

**Meaning**: The KubeStellar CRDs aren’t available in the API server you’re talking to (or you’re on the wrong context).

**Likely Causes**:
- You’re applying to a WEC or hosting cluster context (not the WDS)
- WDS isn’t created/initialized yet

**Next commands**:

```bash
kubectl config current-context
kubectl api-resources | grep -i kubestellar || true
```

**See**: Issue #5 in `common-issues.md`.

---

## `Error from server (Forbidden): ... is forbidden`

**Meaning**: RBAC denied your request.

**Likely Causes**:
- Using a low-privilege kubeconfig identity
- Missing role/rolebinding or clusterrolebinding

**Next commands**:

```bash
kubectl config current-context
kubectl auth can-i create bindingpolicies.control.kubestellar.io -A
kubectl auth can-i get managedclusters -A --context its1 || true
```

**See**: Issue #16.

---

## `unauthorized: authentication required` (Helm / OCI / GHCR)

**Meaning**: Helm couldn’t pull an OCI chart from GHCR due to auth.

**Likely Causes**:
- Registry requires login (enterprise policy)
- Proxy rewriting requests

**Next commands**:

```bash
helm version
helm registry login ghcr.io
curl -I https://ghcr.io || true
```

**See**: Issue #2.

---

## `connection refused` / `i/o timeout` during `clusteradm join`

**Meaning**: The WEC can’t reach the ITS/hub endpoint (or it’s wrong).

**Likely Causes**:
- Wrong hub apiserver address
- Firewall/proxy/network policy blocking traffic

**Next commands**:

```bash
kubectl config view -o jsonpath='{.clusters[?(@.name=="its1")].cluster.server}'
echo
kubectl get managedclusters --context its1
```

**See**: Issue #1 and #14.

---

## `namespaces "<ns>" not found`

**Meaning**: A namespaced object arrived without its namespace.

**Likely Causes**:
- BindingPolicy downsync doesn’t include `namespaces`

**Next commands**:

```bash
kubectl get bindingpolicy -A -o yaml | head -n 80
kubectl get ns --context cluster1 | head
```

**See**: Issue #8.

---

## `FailedScheduling` / `insufficient cpu` / `insufficient memory`

**Meaning**: The WEC can’t schedule pods due to capacity constraints.

**Likely Causes**:
- Small local clusters (kind/k3d) with low resources
- Too many clusters on a laptop

**Next commands**:

```bash
kubectl get nodes --context cluster1
kubectl get pods -n demo --context cluster1
kubectl describe pod -n demo --context cluster1 -l app.kubernetes.io/name=nginx
```

**See**: Issue #9.

---

## `failed to decode object: unknown field`

**Meaning**: Version skew—client/controller/CRD schemas don’t match.

**Likely Causes**:
- Upgraded controllers but not CRDs (or vice versa)
- Stale objects using old schema

**Next commands**:

```bash
helm list -A
helm history ks-core || true
kubectl get crd | grep -i kubestellar || true
```

**See**: Issue #19.

---

## `hosting context not set` (kflex)

**Meaning**: KubeFlex CLI doesn’t know which cluster is “hosting”.

**Likely Causes**:
- Haven’t run `kflex ctx --set-current-for-hosting` after install

**Next commands**:

```bash
kubectl config current-context
kflex ctx --set-current-for-hosting
kubectl config get-contexts | head
```

**See**: Issue #3.

