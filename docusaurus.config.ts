import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'Copper App SDK',
  tagline: 'Add embedded apps to Copper',

  url: 'https://docs.copper.com',
  baseUrl: '/copper-sdk/',

  // GitHub pages deployment config.
  organizationName: 'ProsperWorks',
  projectName: 'copper-sdk',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-Hant'],
  },

  themes: ['classic'],

  plugins: [
    [
      'content-docs',
      {
        routeBasePath: '/',
        sidebarPath: './docs/sidebars.ts',
        editUrl: 'https://github.com/ProsperWorks/copper-sdk/',
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Copper App SDK',
      items: [
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          label: 'Copper',
          href: 'https://copper.com',
          position: 'right',
        },
        {
          label: 'GitHub',
          href: 'https://github.com/ProsperWorks/copper-sdk',
          position: 'right',
        },
      ],
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} Copper CRM`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
