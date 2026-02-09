# Prerequisites

Before installing KubeStellar, you need to install and configure several tools. This guide will help you verify and install all prerequisites.

## Required Tools

### 1. kubectl

Kubernetes command-line tool for interacting with clusters.

**Installation:**

```bash
# macOS
brew install kubectl

# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Windows (PowerShell)
curl.exe -LO "https://dl.k8s.io/release/v1.28.0/bin/windows/amd64/kubectl.exe"
```

**Verify:**
```bash
kubectl version --client
# Should show: v1.24.0 or higher
```

### 2. Helm

Package manager for Kubernetes applications.

**Installation:**

```bash
# macOS
brew install helm

# Linux
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Windows (PowerShell)
choco install kubernetes-helm
```

**Verify:**
```bash
helm version
# Should show: v3.8.0 or higher
```

### 3. Docker or Container Runtime

Required for running local clusters with kind or k3d.

**Installation:**

- **Docker Desktop**: [Download](https://www.docker.com/products/docker-desktop)
- **Podman**: [Installation Guide](https://podman.io/getting-started/installation)

**Verify:**
```bash
docker --version
# or
podman --version
```

### 4. kind or k3d

Tools for creating local Kubernetes clusters.

**kind Installation:**

```bash
# macOS
brew install kind

# Linux/Windows
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
```

**k3d Installation:**

```bash
# macOS
brew install k3d

# Linux
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash

# Windows
choco install k3d
```

**Verify:**
```bash
kind version
# or
k3d version
```

### 5. KubeFlex CLI (kflex)

Command-line tool for managing KubeFlex control planes.

**Installation:**

```bash
# Download latest release
curl -L https://github.com/kubestellar/kubeflex/releases/latest/download/kflex-linux-amd64 -o kflex
chmod +x kflex
sudo mv kflex /usr/local/bin/

# Verify
kflex version
# Should show: v0.7.2 or higher
```

### 6. OCM CLI (clusteradm)

Open Cluster Management command-line tool.

**Installation:**

```bash
# Download latest release
curl -L https://github.com/open-cluster-management-io/clusteradm/releases/latest/download/clusteradm_linux_amd64.tar.gz | tar -xz
sudo mv clusteradm /usr/local/bin/

# Verify
clusteradm version
# Should show: v0.7.0 or higher (but less than v0.11.0)
```

## System Requirements

### Minimum Requirements

- **CPU**: 4 cores
- **RAM**: 8 GB
- **Disk**: 20 GB free space
- **OS**: Linux, macOS, or Windows (with WSL2)

### Recommended Requirements

- **CPU**: 8 cores
- **RAM**: 16 GB
- **Disk**: 50 GB free space

### macOS Specific Notes

- Docker Desktop memory allocation: 4-6 GB recommended
- For 8 GB RAM systems: Limit to 2-3 clusters or use k3d instead of kind

### Windows Specific Notes

- Use WSL2 with a Linux distribution (Fedora 43 recommended)
- Install prerequisites inside WSL2, not Windows
- Some users may need to run as root in Linux

## Network Requirements

- Internet connection for downloading images and charts
- Port 9443 available (for KubeFlex hosting cluster)
- No firewall blocking container registry access (ghcr.io)

## Verification Script

Run this script to check all prerequisites:

```bash
bash <(curl https://raw.githubusercontent.com/kubestellar/kubestellar/v0.27.1/scripts/check_pre_req.sh) kflex ocm helm kubectl docker kind
```

Expected output:
```
✔ KubeFlex (Kubeflex version: v0.8.2+)
✔ OCM CLI (clusteradm version: v0.10.x)
✔ Helm (version: v3.12+)
✔ kubectl (version: v1.28+)
✔ Docker (version: 24+)
✔ kind (version: v0.20+)
```

## Troubleshooting

### Version Conflicts

If you see version warnings:
- **OCM CLI**: Must be v0.7.0+ but less than v0.11.0
- **kubectl**: Must be v1.24.0 or higher
- **Helm**: Must be v3.8.0 or higher

### Docker Issues

- Ensure Docker daemon is running: `docker ps`
- Check Docker Desktop is started (macOS/Windows)
- Verify Docker socket permissions (Linux)

### Network Issues

- Check internet connectivity
- Verify access to ghcr.io: `curl -I https://ghcr.io`
- Check firewall rules if behind corporate proxy

## Next Steps

Once all prerequisites are installed and verified:

→ **[Continue to Installation](./installation.md)**
