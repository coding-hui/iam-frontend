import menu from './en-US/menu';
import message from './en-US/message';
import pages from './en-US/pages';
import pwa from './en-US/pwa';
import settings from './en-US/settings';
import apikey from '@/pages/ApiKey/locales/en-US';
import application from '@/pages/Application/locales/en-US';
import policy from '@/pages/Policy/locales/en-US';
import transfer from '@/components/Transfer/locales/en-US';

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
  ...application,
  ...policy,
  ...transfer,
};
