import { Language, SearchEngine } from './types';

export interface UiCopy {
  search: string;
  searchPlaceholder: string;
  searchWebLabel: string;
  searchOrNavigate: string;
  addShortcut: string;
  newShortcut: string;
  closeAddShortcut: string;
  websiteUrl: string;
  name: string;
  optional: string;
  namePlaceholder: string;
  addShortcutSubmit: string;
  commands: string;
  editShortcuts: string;
  manageOrbit: string;
  searchAndGlass: string;
  settings: string;
  preferences: string;
  closeSettings: string;
  searchEngine: string;
  glassIntensity: string;
  low: string;
  normal: string;
  high: string;
  language: string;
  english: string;
  chinese: string;
  background: string;
  customImageActive: string;
  darkGlassField: string;
  chooseImage: string;
  remove: string;
  resetShortcuts: string;
  resetShortcutsConfirm: string;
  done: string;
  defaultSearchEngine: string;
  undo: string;
  localDefaultsLoaded: string;
  changesStayInTab: string;
  chooseImageFile: string;
  imageTooLarge: string;
  imageCouldNotLoad: string;
  backgroundSaved: string;
  backgroundRemoved: string;
  invalidUrl: string;
  orbitFull: string;
  duplicateShortcut: string;
  emptyTitle: string;
  emptyHint: string;
  shortcutOrbit: string;
  openSettings: string;
  editShortcutAria: (title: string) => string;
  deleteShortcutAria: (title: string) => string;
  removedShortcut: (title: string) => string;
  searchEngineNames: Record<SearchEngine, string>;
}

const englishCopy: UiCopy = {
  search: 'Search',
  searchPlaceholder: 'Search anything...',
  searchWebLabel: 'Search the web',
  searchOrNavigate: 'Search or navigate',
  addShortcut: 'Add shortcut',
  newShortcut: 'New shortcut',
  closeAddShortcut: 'Close add shortcut',
  websiteUrl: 'Website URL',
  name: 'Name',
  optional: 'optional',
  namePlaceholder: 'Example',
  addShortcutSubmit: 'Add shortcut',
  commands: 'Commands',
  editShortcuts: 'Edit shortcuts',
  manageOrbit: 'Manage your orbit',
  searchAndGlass: 'Search and glass',
  settings: 'Settings',
  preferences: 'Preferences',
  closeSettings: 'Close settings',
  searchEngine: 'Search engine',
  glassIntensity: 'Glass intensity',
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  language: 'Language',
  english: 'English',
  chinese: '中文',
  background: 'Background',
  customImageActive: 'Custom image active',
  darkGlassField: 'Dark glass field',
  chooseImage: 'Choose image',
  remove: 'Remove',
  resetShortcuts: 'Reset shortcuts',
  resetShortcutsConfirm: 'Reset all shortcuts?',
  done: 'Done',
  defaultSearchEngine: 'Default search engine',
  undo: 'Undo',
  localDefaultsLoaded: 'Local defaults loaded',
  changesStayInTab: 'Changes stay in this tab only',
  chooseImageFile: 'Choose an image file',
  imageTooLarge: 'Choose an image under 5 MB',
  imageCouldNotLoad: 'That image could not be loaded',
  backgroundSaved: 'Background saved locally',
  backgroundRemoved: 'Custom background removed',
  invalidUrl: "That URL doesn't look right.",
  orbitFull: 'Your orbit is full. Remove one shortcut first.',
  duplicateShortcut: 'That shortcut is already here.',
  emptyTitle: 'Add your first shortcut',
  emptyHint: 'Click any plus to begin',
  shortcutOrbit: 'Shortcut orbit',
  openSettings: 'Open settings',
  editShortcutAria: (title) => `${title}. Use arrow keys to reorder or Delete to remove.`,
  deleteShortcutAria: (title) => `Delete ${title}`,
  removedShortcut: (title) => `Removed ${title}`,
  searchEngineNames: {
    google: 'Google',
    bing: 'Bing',
    duckduckgo: 'DuckDuckGo',
  },
};

const chineseCopy: UiCopy = {
  search: '搜索',
  searchPlaceholder: '搜索任何内容...',
  searchWebLabel: '搜索网页',
  searchOrNavigate: '搜索或打开',
  addShortcut: '添加快捷方式',
  newShortcut: '新建快捷方式',
  closeAddShortcut: '关闭添加快捷方式',
  websiteUrl: '网站地址',
  name: '名称',
  optional: '可选',
  namePlaceholder: '例如：知乎',
  addShortcutSubmit: '添加快捷方式',
  commands: '命令',
  editShortcuts: '编辑快捷方式',
  manageOrbit: '管理快捷方式',
  searchAndGlass: '搜索与玻璃',
  settings: '设置',
  preferences: '偏好设置',
  closeSettings: '关闭设置',
  searchEngine: '搜索引擎',
  glassIntensity: '玻璃强度',
  low: '低',
  normal: '标准',
  high: '高',
  language: '语言',
  english: 'English',
  chinese: '中文',
  background: '背景',
  customImageActive: '自定义图片已启用',
  darkGlassField: '深色玻璃背景',
  chooseImage: '选择图片',
  remove: '移除',
  resetShortcuts: '重置快捷方式',
  resetShortcutsConfirm: '确定要重置所有快捷方式吗？',
  done: '完成',
  defaultSearchEngine: '默认搜索引擎',
  undo: '撤销',
  localDefaultsLoaded: '已加载本地默认设置',
  changesStayInTab: '更改仅保存在当前标签页',
  chooseImageFile: '请选择图片文件',
  imageTooLarge: '请选择 5 MB 以下的图片',
  imageCouldNotLoad: '图片无法加载',
  backgroundSaved: '背景已保存在本地',
  backgroundRemoved: '已移除自定义背景',
  invalidUrl: '网址格式不正确。',
  orbitFull: '快捷方式已满，请先删除一个。',
  duplicateShortcut: '这个快捷方式已经存在。',
  emptyTitle: '添加第一个快捷方式',
  emptyHint: '点击任意加号开始',
  shortcutOrbit: '快捷方式环',
  openSettings: '打开设置',
  editShortcutAria: (title) => `${title}。使用方向键调整顺序，或按 Delete 删除。`,
  deleteShortcutAria: (title) => `删除 ${title}`,
  removedShortcut: (title) => `已移除 ${title}`,
  searchEngineNames: {
    google: 'Google',
    bing: '必应',
    duckduckgo: 'DuckDuckGo',
  },
};

const translations: Record<Language, UiCopy> = {
  en: englishCopy,
  zh: chineseCopy,
};

export const getCopy = (language: Language): UiCopy => translations[language];
