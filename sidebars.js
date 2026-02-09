/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be configured from your docs directory structure.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Quickstart Guide',
      items: [
        'quickstart/index',
        'quickstart/prerequisites',
        'quickstart/installation',
        'quickstart/first-deployment',
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        'tutorials/index',
        'tutorials/interactive-tutorial-preview',
        'tutorials/video-series-outline',
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: [
        'troubleshooting/index',
        'troubleshooting/common-issues',
        'troubleshooting/error-reference',
      ],
    },
    {
      type: 'category',
      label: 'Use Cases',
      items: [
        'use-cases/index',
        'use-cases/edge-deployment',
        'use-cases/multi-cloud',
        'use-cases/compliance',
        'use-cases/crd-sync',
        'use-cases/helm-charts',
      ],
    },
    {
      type: 'category',
      label: 'Migration Guides',
      items: [
        'migration/index',
        'migration/from-argocd',
        'migration/from-karmada',
        'migration/from-cluster-api',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/wds',
        'architecture/its',
        'architecture/wecs',
        'architecture/binding-policy',
      ],
    },
  ],
};

module.exports = sidebars;
