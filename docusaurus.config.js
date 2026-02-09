// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'KubeStellar Documentation Initiative',
  tagline: '30 Minutes from Zero to Multi-Cluster Deployment',
  // Use SVG favicon to avoid binary assets in this prototype repo
  favicon: 'img/logo.svg',

  // Set the production url of your site here
  url: 'https://kubestellar-docs-demo.netlify.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'kubestellar',
  projectName: 'lfx-documentation-project',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/kubestellar/kubestellar/edit/main/kdemo/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/kubestellar/kubestellar/edit/main/kdemo/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Social card (kept simple for prototype)
      image: 'img/logo.svg',
      navbar: {
        title: 'KubeStellar Docs Initiative',
        logo: {
          alt: 'KubeStellar Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Documentation',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/kubestellar/kubestellar',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Quickstart',
                to: '/docs/quickstart',
              },
              {
                label: 'Tutorials',
                to: '/docs/tutorials',
              },
              {
                label: 'Use Cases',
                to: '/docs/use-cases',
              },
              {
                label: 'Migration Guides',
                to: '/docs/migration',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'CNCF Slack',
                href: 'https://cloud-native.slack.com/archives/C097094RZ3M',
              },
              {
                label: 'GitHub Discussions',
                href: 'https://github.com/kubestellar/kubestellar/discussions',
              },
              {
                label: 'YouTube',
                href: 'https://www.youtube.com/@kubestellar',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'LFX Mentorship',
                href: 'https://mentorship.lfx.linuxfoundation.org',
              },
              {
                label: 'KubeStellar Website',
                href: 'https://kubestellar.io',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} LFX Mentorship 2026 - KubeStellar Documentation Initiative. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'yaml', 'json'],
      },
    }),
};

module.exports = config;
