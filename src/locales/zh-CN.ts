import menu from './zh-CN/menu';
import message from './zh-CN/message';
import pages from './zh-CN/pages';
import pwa from './zh-CN/pwa';
import settings from './zh-CN/settings';
import apikey from '@/pages/ApiKey/locales/zh-CN';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.copyright.produced': 'WECODING. All Rights Reserved.',
  'app.copyright.website': '在线预览',
  'app.copyright.helpDoc': '帮助文档',
  'app.preview.down.block': '下载此页面到本地项目',
  'app.welcome.link.fetch-blocks': '获取全部区块',
  'app.welcome.link.block-list': '基于 block 开发，快速构建标准页面',
  ...pages,
  ...menu,
  ...settings,
  ...pwa,
  ...message,
  ...apikey,
};
