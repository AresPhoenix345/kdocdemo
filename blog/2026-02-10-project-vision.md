---
slug: project-vision
title: "Project Vision: From Zero to Multi-Cluster in 30 Minutes"
authors: [kubestellar]
tags: [lfx, documentation, onboarding, kubestellar]
---

## The Problem

Multi-cluster Kubernetes is powerful—but onboarding often isn’t.

New users frequently hit friction early:
- Toolchain mismatches (kubectl/helm/clusteradm/kflex versions)
- Context confusion (hosting vs WDS vs ITS vs WECs)
- “It installed, but nothing syncs” (labels/selectors don’t match)
- Troubleshooting scattered across sources

The result: **time-to-first-success** balloons from minutes to hours.

<!-- truncate -->

## The Vision

Deliver a documentation and self-service experience that feels like:

- **One clear path** to success (≤ 30 minutes)
- **Hands-on learning** without local setup (Killercoda tutorial)
- **Fast diagnosis** when things go wrong (20 common issues + error signatures)
- **Practical patterns** users can adopt immediately (use cases + migration guides)

## Why KubeStellar

KubeStellar simplifies multi-cluster operations with:

- **WDS**: define workloads and policies once using native Kubernetes objects  
- **ITS**: inventory + transport (OCM) to clusters  
- **WECs**: run workloads and report status  
- **BindingPolicy**: declare what goes where using labels  

This makes multi-cluster feel like single-cluster operations—without rewriting your manifests.

## What Success Looks Like

We measure success with outcomes that matter:

- **≤ 30 minutes** to first successful multi-cluster deployment
- **≥ 4/5** user satisfaction in external testing
- **8+** new GitHub issues from new users (signal of engagement)
- **2+** documentation PRs from users (signal of contribution readiness)

## Next Steps

- Explore the **[Quickstart Guide](/docs/quickstart)**  
- See the **[Interactive Tutorial Preview](/docs/tutorials/interactive-tutorial-preview)**  
- Use **[Troubleshooting](/docs/troubleshooting)** when blocked  

