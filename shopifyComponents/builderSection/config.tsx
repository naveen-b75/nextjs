import { Builder, BuilderElement } from '@builder.io/react';
import dynamic from 'next/dynamic';

const defaultElement: BuilderElement = {
  '@type': '@builder.io/sdk:Element',
  responsiveStyles: {
    large: {
      // TODO: always apply these if not given
      position: 'relative',
      display: 'flex',
      alignItems: 'stretch',
      flexDirection: 'column',
      height: '400px'
    }
  },
  children: [
    {
      '@type': '@builder.io/sdk:Element',
      responsiveStyles: {
        large: {
          marginTop: '50px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column'
        }
      },
      component: {
        name: 'Text',
        options: {
          text: 'I am a slide'
        }
      }
    }
  ]
};

const defaultButton: BuilderElement = {
  '@type': '@builder.io/sdk:Element',
  responsiveStyles: {
    large: {
      position: 'relative',
      display: 'flex',
      alignItems: 'stretch',
      flexDirection: 'column',
      height: '30px'
    }
  }
};

const defaultTab = {
  '@type': '@builder.io/sdk:Element',
  responsiveStyles: {
    large: {
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingTop: '10px',
      paddingBottom: '10px',
      minWidth: '100px',
      textAlign: 'center',
      // TODO: add to all
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
      userSelect: 'none'
    }
  },
  component: {
    // Builder:text
    name: 'Text',
    options: {
      text: 'New tab'
    }
  }
};

const defaultTabsElement = {
  '@type': '@builder.io/sdk:Element',
  responsiveStyles: {
    large: {
      height: '200px',
      display: 'flex',
      marginTop: '20px',
      flexDirection: 'column'
    }
  },
  component: {
    name: 'Text',
    options: {
      text: 'New tab content '
    }
  }
};

Builder.registerComponent(
  dynamic(() => import('../Button')),
  {
    name: 'StartProjectButton',
    image: 'https://cdn-icons-png.flaticon.com/512/5453/5453665.png',
    inputs: [
      {
        name: 'buttonText',
        type: 'string',
        defaultValue: 'Start Your Project'
      },
      {
        name: 'buttonSize',
        type: 'string',
        enum: ['small', 'medium', 'large'],
        defaultValue: 'large'
      },
      {
        name: 'buttonType',
        type: 'string',
        enum: ['primary', 'secondary', 'tertiary'],
        defaultValue: 'primary'
      }
    ]
  }
);

Builder.register('insertMenu', {
  name: 'Magento Components',
  items: [{ name: 'StartProjectButton' }]
});

Builder.registerComponent(
  dynamic(() => import('../../builder/MegaMenu')),
  {
    name: 'MegaMenu',
    image: 'https://cdn-icons-png.flaticon.com/512/1828/1828859.png',
    inputs: [
      {
        name: 'menus',
        type: 'list',
        defaultValue: [
          {
            title: 'Shirts',
            path: '/about-us'
          }
        ],
        subFields: [
          {
            name: 'title',
            type: 'string',
            defaultValue: 'Shirts'
          },
          {
            name: 'path',
            type: 'string',
            defaultValue: '/about-us'
          },
          {
            name: 'hasChildren',
            type: 'boolean',
            defaultValue: false
          },
          {
            name: 'children',
            type: 'list',
            //@ts-ignore example provided by Builder to convert value to string in subfields
            showIf: `options.get('hasChildren') === true`,
            defaultValue: [
              {
                title: 'Short Sleeve',
                path: '/about-us'
              }
            ],
            subFields: [
              {
                name: 'title',
                type: 'string',
                defaultValue: 'Shirts'
              },
              {
                name: 'path',
                type: 'string',
                defaultValue: '/about-us'
              },
              {
                name: 'hasChildren',
                type: 'boolean',
                defaultValue: false
              },
              {
                name: 'children',
                type: 'list',
                //@ts-ignore example provided by Builder to convert value to string in subfields
                showIf: `options.get('hasChildren') === true`,
                defaultValue: [
                  {
                    title: 'Short Sleeve',
                    path: '/about-us'
                  }
                ],
                subFields: [
                  {
                    name: 'title',
                    type: 'string',
                    defaultValue: 'Shirts'
                  },
                  {
                    name: 'path',
                    type: 'string',
                    defaultValue: '/about-us'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
);
