import { ILayout, ILayoutCSSClasses, ILayoutHTMLAttributes, ILayoutCSSVariables } from './_Models'
import { DefaultConfig } from './_LayoutConfig'

const LAYOUT_CONFIG_KEY = 'LayoutConfig';

const getLayoutFromLocalStorage = (): ILayout => {
  const ls = localStorage.getItem(LAYOUT_CONFIG_KEY);
  if (ls) {
    try {
      return JSON.parse(ls) as ILayout;
    } catch (er) {
      console.error(er);
    }
  }
  return DefaultConfig;
};

const setLayoutIntoLocalStorage = (config: ILayout) => {
  try {
    localStorage.setItem(LAYOUT_CONFIG_KEY, JSON.stringify(config));
  } catch (er) {
    console.error(er);
  }
};

const getEmptyCssClasses = (): ILayoutCSSClasses => {
  return {
    header: [],
    headerContainer: [],
    headerMobile: [],
    headerMenu: [],
  };
};

const getEmptyHTMLAttributes = () => {
  return {
    asideMenu: new Map(),
    headerMobile: new Map(),
    headerMenu: new Map(),
    headerContainer: new Map(),
    pageTitle: new Map(),
  };
};

const getEmptyCSSVariables = () => {
  return {
    body: new Map(),
  };
};

class LayoutSetup {
  public static isLoaded: boolean = false;
  public static config: ILayout = getLayoutFromLocalStorage();
  public static classes: ILayoutCSSClasses = getEmptyCssClasses();
  public static attributes: ILayoutHTMLAttributes = getEmptyHTMLAttributes();
  public static cssVariables: ILayoutCSSVariables = getEmptyCSSVariables();

  private static initCSSClasses(): void {
    LayoutSetup.classes = getEmptyCssClasses();
  }

  private static initHTMLAttributes(): void {
    LayoutSetup.attributes = Object.assign({}, getEmptyHTMLAttributes());
  }

  private static initCSSVariables(): void {
    LayoutSetup.cssVariables = getEmptyCSSVariables();
  }

  private static initConfig(config: ILayout): ILayout {
    let updatedConfig = LayoutSetup.initLayoutSettings(config);
    updatedConfig = LayoutSetup.initToolbarSetting(updatedConfig);
    return LayoutSetup.initWidthSettings(updatedConfig);
  }

  private static initLayoutSettings(config: ILayout): ILayout {
    const updatedConfig = { ...config };

    // Nettoyer les classes du body en évitant les valeurs vides
    const bodyClasses = document.body.classList.value.split(' ').filter((cssClass) => cssClass.trim() !== '');
    bodyClasses.forEach((cssClass) => document.body.classList.remove(cssClass));

    // Nettoyer les attributs du body
    const bodyAttributes = document.body.getAttributeNames().filter((t) => t.startsWith('data-'));
    bodyAttributes.forEach((attr) => document.body.removeAttribute(attr));

    // Réinitialiser les styles et appliquer les nouveaux attributs
    document.body.setAttribute('style', '');
    document.body.setAttribute('id', 'kt_app_body');
    document.body.setAttribute('data-kt-app-layout', updatedConfig.layoutType);
    document.body.setAttribute('data-kt-name', 'metronic');
    document.body.classList.add('app-default');

    const pageWidth = updatedConfig.app?.general?.pageWidth;
    if (['light-header', 'dark-header'].includes(updatedConfig.layoutType)) {
      if (pageWidth === 'default') {
        const header = updatedConfig.app?.header;
        if (header?.default) {
          header.default.container = 'fixed';
        }

        const toolbar = updatedConfig.app?.toolbar;
        if (toolbar) {
          toolbar.container = 'fixed';
        }

        const content = updatedConfig.app?.content;
        if (content) {
          content.container = 'fixed';
        }

        const footer = updatedConfig.app?.footer;
        if (footer) {
          footer.container = 'fixed';
        }

        return {
          ...updatedConfig,
          app: { ...updatedConfig.app, header, toolbar, content, footer },
        };
      }
    }
    return updatedConfig;
  }

  private static initToolbarSetting(config: ILayout): ILayout {
    const updatedConfig = { ...config };

    if (updatedConfig.app?.header?.default?.content === 'page-title') {
      if (updatedConfig.app?.toolbar) {
        updatedConfig.app.toolbar.display = false;
      }
    } else if (updatedConfig.app?.pageTitle) {
      updatedConfig.app.pageTitle.description = false;
      updatedConfig.app.pageTitle.breadCrumb = true;
    }

    return updatedConfig;
  }

  private static initWidthSettings(config: ILayout): ILayout {
    const updatedConfig = { ...config };
    const pageWidth = updatedConfig.app?.general?.pageWidth;
    if (!pageWidth || pageWidth === 'default') {
      return config;
    }

    if (updatedConfig.app?.header?.default) {
      updatedConfig.app.header.default.container = pageWidth;
    }
    if (updatedConfig.app?.toolbar) {
      updatedConfig.app.toolbar.container = pageWidth;
    }
    if (updatedConfig.app?.content) {
      updatedConfig.app.content.container = pageWidth;
    }
    if (updatedConfig.app?.footer) {
      updatedConfig.app.footer.container = pageWidth;
    }

    return updatedConfig;
  }

  public static updatePartialConfig(fieldsToUpdate: Partial<ILayout>): ILayout {
    const config = LayoutSetup.config;
    const updatedConfig = { ...config, ...fieldsToUpdate };
    LayoutSetup.initCSSClasses();
    LayoutSetup.initCSSVariables();
    LayoutSetup.initHTMLAttributes();
    LayoutSetup.isLoaded = false;
    LayoutSetup.config = LayoutSetup.initConfig({ ...updatedConfig });
    LayoutSetup.isLoaded = true;
    return updatedConfig;
  }

  public static setConfig(config: ILayout): void {
    setLayoutIntoLocalStorage(config);
  }

  public static bootstrap = (() => {
    LayoutSetup.updatePartialConfig(LayoutSetup.config);
  })();
}

export {
  LayoutSetup,
  getLayoutFromLocalStorage,
  setLayoutIntoLocalStorage,
  getEmptyCssClasses,
  getEmptyCSSVariables,
  getEmptyHTMLAttributes,
};
