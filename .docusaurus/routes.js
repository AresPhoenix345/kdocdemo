import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/about',
    component: ComponentCreator('/about', '954'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '9fe'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '182'),
    exact: true
  },
  {
    path: '/blog/authors',
    component: ComponentCreator('/blog/authors', '0b7'),
    exact: true
  },
  {
    path: '/blog/mentorship-opportunity',
    component: ComponentCreator('/blog/mentorship-opportunity', '813'),
    exact: true
  },
  {
    path: '/blog/project-vision',
    component: ComponentCreator('/blog/project-vision', 'd70'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '287'),
    exact: true
  },
  {
    path: '/blog/tags/docs',
    component: ComponentCreator('/blog/tags/docs', '5c7'),
    exact: true
  },
  {
    path: '/blog/tags/documentation',
    component: ComponentCreator('/blog/tags/documentation', '27f'),
    exact: true
  },
  {
    path: '/blog/tags/kubernetes',
    component: ComponentCreator('/blog/tags/kubernetes', '465'),
    exact: true
  },
  {
    path: '/blog/tags/kubestellar',
    component: ComponentCreator('/blog/tags/kubestellar', '384'),
    exact: true
  },
  {
    path: '/blog/tags/lfx',
    component: ComponentCreator('/blog/tags/lfx', '4da'),
    exact: true
  },
  {
    path: '/blog/tags/mentorship',
    component: ComponentCreator('/blog/tags/mentorship', 'a11'),
    exact: true
  },
  {
    path: '/blog/tags/onboarding',
    component: ComponentCreator('/blog/tags/onboarding', 'c9e'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '790'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'c02'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '9de'),
            routes: [
              {
                path: '/docs/architecture/binding-policy',
                component: ComponentCreator('/docs/architecture/binding-policy', '2a5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/its',
                component: ComponentCreator('/docs/architecture/its', '9d4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/overview',
                component: ComponentCreator('/docs/architecture/overview', '833'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/wds',
                component: ComponentCreator('/docs/architecture/wds', 'bdc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/wecs',
                component: ComponentCreator('/docs/architecture/wecs', '35f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '61d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/migration/',
                component: ComponentCreator('/docs/migration/', '6a8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/migration/from-argocd',
                component: ComponentCreator('/docs/migration/from-argocd', 'e28'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/migration/from-cluster-api',
                component: ComponentCreator('/docs/migration/from-cluster-api', 'a54'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/migration/from-karmada',
                component: ComponentCreator('/docs/migration/from-karmada', 'f75'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/quickstart/',
                component: ComponentCreator('/docs/quickstart/', '361'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/quickstart/first-deployment',
                component: ComponentCreator('/docs/quickstart/first-deployment', 'd28'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/quickstart/installation',
                component: ComponentCreator('/docs/quickstart/installation', '52c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/quickstart/prerequisites',
                component: ComponentCreator('/docs/quickstart/prerequisites', '175'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/troubleshooting/',
                component: ComponentCreator('/docs/troubleshooting/', 'b40'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/troubleshooting/common-issues',
                component: ComponentCreator('/docs/troubleshooting/common-issues', '944'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/troubleshooting/error-reference',
                component: ComponentCreator('/docs/troubleshooting/error-reference', 'd14'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/',
                component: ComponentCreator('/docs/tutorials/', '7ab'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/interactive-tutorial-preview',
                component: ComponentCreator('/docs/tutorials/interactive-tutorial-preview', '36f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/video-series-outline',
                component: ComponentCreator('/docs/tutorials/video-series-outline', '532'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/use-cases/',
                component: ComponentCreator('/docs/use-cases/', 'de6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/use-cases/compliance',
                component: ComponentCreator('/docs/use-cases/compliance', '7e4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/use-cases/crd-sync',
                component: ComponentCreator('/docs/use-cases/crd-sync', '234'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/use-cases/edge-deployment',
                component: ComponentCreator('/docs/use-cases/edge-deployment', 'd18'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/use-cases/helm-charts',
                component: ComponentCreator('/docs/use-cases/helm-charts', '854'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/use-cases/multi-cloud',
                component: ComponentCreator('/docs/use-cases/multi-cloud', '86a'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
