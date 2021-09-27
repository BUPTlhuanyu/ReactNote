const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'React Note',
  tagline: '',

  url: 'https://BUPTlhuanyu.github.io', // Your website URL
  baseUrl: '/ReactNote/',

  projectName: 'BUPTlhuanyu.github.io', // Usually your repo name.
  organizationName: 'BUPTlhuanyu', // Usually your GitHub org/user name.

  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/BUPTlhuanyu/ReactNote/tree/master',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/BUPTlhuanyu/ReactNote/tree/master',
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
      navbar: {
        title: 'React Note',
        logo: {
          alt: 'React Note Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'react/react/intro',
            position: 'left',
            label: 'React',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/BUPTlhuanyu',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} BUPTlhuanyu, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
});
