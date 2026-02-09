# Quickstart Guide

Welcome to the KubeStellar Quickstart Guide! This guide will help you get KubeStellar up and running in **30 minutes or less**, from zero to your first multi-cluster deployment.

## Overview

This quickstart guide is designed to be:
- ✅ **Fast**: Complete setup in under 30 minutes
- ✅ **Production-ready**: Uses best practices from day one
- ✅ **Validated**: Tested with real users and feedback incorporated
- ✅ **Comprehensive**: Covers all essential steps

## What You'll Learn

By the end of this guide, you will:
1. Have a working KubeStellar environment
2. Understand the core components (WDS, ITS, WECs)
3. Deploy your first application across multiple clusters
4. Know how to create and use BindingPolicies

## Prerequisites

Before you begin, make sure you have the required tools installed. See our **[Prerequisites Guide](./prerequisites.md)** for detailed installation instructions.

**Quick Checklist:**
- ✅ kubectl (v1.24+)
- ✅ Helm (v3.8+)
- ✅ Docker or container runtime
- ✅ kind or k3d for local clusters
- ✅ KubeFlex CLI (kflex) v0.7.2+
- ✅ OCM CLI (clusteradm) v0.7+

## Quick Start Path

Follow these steps in order:

1. **[Prerequisites](./prerequisites.md)** - Install required tools (10 minutes)
2. **[Installation](./installation.md)** - Set up KubeStellar core components (10 minutes)
3. **[First Deployment](./first-deployment.md)** - Deploy your first multi-cluster application (10 minutes)

**Total Time: ~30 minutes**

## What Gets Created

This quickstart creates a demonstration environment with:

- **1 Hosting Cluster**: Runs KubeFlex and KubeStellar controllers
- **1 ITS (Inventory and Transport Space)**: Manages cluster inventory
- **1 WDS (Workload Description Space)**: Where you define workloads
- **2 WECs (Workload Execution Clusters)**: Where workloads actually run

> **Note**: This is a demo environment suitable for learning and testing. For production deployments, see our [Production Guide](../architecture/overview.md).

## Expected Outcomes

After completing this quickstart, you should be able to:

- ✅ Access your WDS and ITS via kubectl
- ✅ Register WECs with your ITS
- ✅ Create BindingPolicies to control workload placement
- ✅ Deploy applications across multiple clusters
- ✅ Verify workloads are running on target clusters

## Troubleshooting

Encountering issues? Check our **[Troubleshooting Guide](../troubleshooting/index.md)** for common problems and solutions.

## Next Steps

Once you've completed the quickstart:

- Explore our **[Interactive Tutorial](../tutorials/interactive-tutorial-preview.md)**
- Watch our **[Video Series](../tutorials/video-series-outline.md)**
- Review **[Use Cases](../use-cases/index.md)** for real-world patterns
- Check out **[Migration Guides](../migration/index.md)** if coming from other platforms

## Feedback

This guide is continuously improved based on user feedback. If you encounter any issues or have suggestions, please:

- Open an issue on [GitHub](https://github.com/kubestellar/kubestellar/issues)
- Join our [Slack channel](https://cloud-native.slack.com/archives/C097094RZ3M)
- Submit a PR with improvements

---

**Ready to begin?** → [Install Prerequisites](./prerequisites.md)
