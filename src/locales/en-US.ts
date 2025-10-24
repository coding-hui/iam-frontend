import menu from './en-US/menu';
import message from './zh-CN/message';
import pages from './zh-CN/pages';
import pwa from './zh-CN/pwa';
import settings from './zh-CN/settings';
import apikey from '@/pages/ApiKey/locales/en-US';

export default {
  'navBar.lang': 'Language',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.copyright.produced': 'WECODING. All Rights Reserved.',
  'app.copyright.website': 'Online Preview',
  'app.copyright.helpDoc': 'Help Documentation',
  'app.preview.down.block': 'Download this page to local project',
  'app.welcome.link.fetch-blocks': 'Get all blocks',
  'app.welcome.link.block-list': 'Develop based on block, quickly build standard pages',
  ...pages,
  ...menu,
  ...settings,
  ...pwa,
  ...message,
  ...apikey,
};
