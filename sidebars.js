/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  react: [
    {
      type: 'category',
      label: 'react',
      items: [
        'react/react/intro',
        'react/react/project-directory',
        'react/react/shared/shared',
        {
          type: 'category',
          label: 'ReactElement',
          items: [
            'react/react/ReactElement/reactelement-and-children',
            'react/react/ReactElement/component-reactelement',
            {
              type: 'category',
              label: '其他',
              items: [
                'react/react/ReactElement/others/react-entry',
                'react/react/ReactElement/others/react-base-class',
                'react/react/ReactElement/others/react-children',
                'react/react/ReactElement/others/react-debug-current-frame',
                'react/react/ReactElement/others/react-element',
                'react/react/ReactElement/others/react-element-validator',
                'react/react/ReactElement/others/react-node-update-queue',
                'react/react/ReactElement/others/react-others'
              ]
            }
          ],
        },
        {
          type: 'category',
          label: 'scheduler',
          items: [
            'react/react/scheduler/why-need-scheduler',
            'react/react/scheduler/new-scheduler',
            'react/react/scheduler/old-scheduler',
            {
              type: 'category',
              label: '其他',
              items: [
                'react/react/scheduler/others/react-is',
                'react/react/scheduler/others/scheduler-code-details',
                'react/react/scheduler/others/scheduler-tracing-subscriptions',
                'react/react/scheduler/others/scheduler-tracing' 
              ]
            }
          ],
        },
        {
          type: 'category',
          label: 'reconciler',
          items: [
            'react/react/reconciler/container-root',
            'react/react/reconciler/fiber-tree-root',
            'react/react/reconciler/schedulework',
            'react/react/reconciler/sync-async-work',
            'react/react/reconciler/performwork',
            'react/react/reconciler/performwork-on-root',
            'react/react/reconciler/expiration-time',
            'react/react/reconciler/multi-setstate',
            'react/react/reconciler/react-fiber-lazy-component',
            'react/react/reconciler/todo-list'
          ],
        },
        {
          type: 'category',
          label: 'event',
          items: [
            'react/react/event/event-bind',
            'react/react/event/event-dispatch'
          ],
        },
        'react/react/error/error-handle'
      ]
    },
    {
      type: 'category',
      label: 'react-hook-form',
      items: [
        'react/react-hook-form/react-hook-form-summary',
        'react/react-hook-form/react-hook-form-utils'
      ]
    },
    {
      type: 'category',
      label: 'react-router',
      items: [
        'react/react-router/react-router-summary',
        {
          type: 'category',
          label: '其他',
          items: [
            'react/react-router/others/react-router-matchpath',
            'react/react-router/others/react-router-route',
            'react/react-router/others/react-router-browser-hash-router',
            'react/react-router/others/react-router-router',
            'react/react-router/others/react-router-generatepath',
            'react/react-router/others/react-router-redirect',
            'react/react-router/others/react-router-switch',
            'react/react-router/others/react-router-withrouter',
            'react/react-router/others/react-router-link' 
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'react-transition',
      items: [
        'react/react-transition/react-transition-group-transition'
      ]
    }
  ]
};