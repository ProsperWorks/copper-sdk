import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Copper App SDK',
  tagline: 'Add embedded apps to Copper',

  url: 'https://docs.copper.com',
  baseUrl: '/',

  // GitHub pages deployment config.
  // organizationName: 'ProsperWorks',
  // projectName: 'copper-sdk',

  // onBrokenLinks: 'throw',
  // onBrokenMarkdownLinks: 'warn',

  // i18n: {
  //   defaultLocale: 'en',
  //   locales: ['en'],
  // },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          // sidebarPath: './sidebars.ts',
          // editUrl:
          //   'https://github.com/ProsperWorks/copper-sdk/',
        },
        blog: false,
        // theme: {
        //   customCss: './src/css/custom.css',
        // },
      } satisfies Preset.Options,
    ],
  ],

  // themeConfig: {
  //   navbar: {
  //     title: 'Copper App SDK',
  //     items: [
  //       {
  //         type: 'docSidebar',
  //         sidebarId: 'tutorialSidebar',
  //         position: 'left',
  //         label: 'Tutorial',
  //       },
  //     ],
  //   },
  //   footer: {
  //     style: 'dark',
  //     copyright: `Copyright © ${new Date().getFullYear()} Copper CRM`,
  //   },
  //   prism: {
  //     theme: prismThemes.github,
  //     darkTheme: prismThemes.dracula,
  //   },
  // } satisfies Preset.ThemeConfig,
};

export default config;
