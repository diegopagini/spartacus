import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import {
  NodeDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import {
  addLibraryFeature,
  addPackageJsonDependencies,
  getAppModule,
  getSpartacusSchematicsVersion,
  installPackageJsonDependencies,
  LibraryOptions as SpartacusProductConfiguratorOptions,
  readPackageJson,
  validateSpartacusInstallation,
} from '@spartacus/schematics';

export const CLI_PRODUCT_CONFIGURATOR_FEATURE = 'ProductConfigurator';
export const SPARTACUS_PRODUCT_CONFIGURATOR = '@spartacus/product-configurator';

const PRODUCT_CONFIGURATOR_SCSS_FILE_NAME = 'product-configurator.scss';
const PRODUCT_CONFIGURATOR_RULEBASED_MODULE = 'RulebasedConfiguratorModule';
const PRODUCT_CONFIGURATOR_TEXTFIELD_MODULE = 'TextfieldConfiguratorModule';
const PRODUCT_CONFIGURATOR_RULEBASED_FEATURE_NAME = 'rulebased';
const PRODUCT_CONFIGURATOR_TEXTFIELD_FEATURE_NAME = 'textfield';

const PRODUCT_CONFIGURATOR_RULEBASED_ROOT_MODULE =
  'RulebasedConfiguratorRootModule';
const PRODUCT_CONFIGURATOR_TEXTFIELD_ROOT_MODULE =
  'TextfieldConfiguratorRootModule';
const SPARTACUS_PRODUCT_CONFIGURATOR_RULEBASED =
  '@spartacus/product-configurator/rulebased';
const SPARTACUS_PRODUCT_CONFIGURATOR_TEXTFIELD =
  '@spartacus/product-configurator/textfield';

const SPARTACUS_PRODUCT_CONFIGURATOR_RULEBASED_ROOT = `${SPARTACUS_PRODUCT_CONFIGURATOR_RULEBASED}/root`;
const SPARTACUS_PRODUCT_CONFIGURATOR_TEXTFIELD_ROOT = `${SPARTACUS_PRODUCT_CONFIGURATOR_TEXTFIELD}/root`;
const SPARTACUS_PRODUCT_CONFIGURATOR_ASSETS = `${SPARTACUS_PRODUCT_CONFIGURATOR}/common/assets`;
const PRODUCT_CONFIGURATOR_TRANSLATIONS = 'configuratorTranslations';
const PRODUCT_CONFIGURATOR_TRANSLATION_CHUNKS_CONFIG =
  'configuratorTranslationChunksConfig';

export function addProductConfiguratorFeatures(
  options: SpartacusProductConfiguratorOptions
): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const packageJson = readPackageJson(tree);
    validateSpartacusInstallation(packageJson);

    const appModulePath = getAppModule(tree, options.project);

    return chain([
      addProductConfiguratorRulebasedFeature(appModulePath, options),
      addProductConfiguratorTextfieldFeature(appModulePath, options),
      addProductConfiguratorPackageJsonDependencies(packageJson),
      installPackageJsonDependencies(),
    ]);
  };
}

function addProductConfiguratorRulebasedFeature(
  appModulePath: string,
  options: SpartacusProductConfiguratorOptions
): Rule {
  return addLibraryFeature(appModulePath, options, {
    name: PRODUCT_CONFIGURATOR_RULEBASED_FEATURE_NAME,
    featureModule: {
      name: PRODUCT_CONFIGURATOR_RULEBASED_MODULE,
      importPath: SPARTACUS_PRODUCT_CONFIGURATOR_RULEBASED,
    },
    rootModule: {
      name: PRODUCT_CONFIGURATOR_RULEBASED_ROOT_MODULE,
      importPath: SPARTACUS_PRODUCT_CONFIGURATOR_RULEBASED_ROOT,
    },
    i18n: {
      resources: PRODUCT_CONFIGURATOR_TRANSLATIONS,
      chunks: PRODUCT_CONFIGURATOR_TRANSLATION_CHUNKS_CONFIG,
      importPath: SPARTACUS_PRODUCT_CONFIGURATOR_ASSETS,
    },
    styles: {
      scssFileName: PRODUCT_CONFIGURATOR_SCSS_FILE_NAME,
      importStyle: SPARTACUS_PRODUCT_CONFIGURATOR,
    },
  });
}

function addProductConfiguratorTextfieldFeature(
  appModulePath: string,
  options: SpartacusProductConfiguratorOptions
): Rule {
  return addLibraryFeature(appModulePath, options, {
    name: PRODUCT_CONFIGURATOR_TEXTFIELD_FEATURE_NAME,
    featureModule: {
      name: PRODUCT_CONFIGURATOR_TEXTFIELD_MODULE,
      importPath: SPARTACUS_PRODUCT_CONFIGURATOR_TEXTFIELD,
    },
    rootModule: {
      name: PRODUCT_CONFIGURATOR_TEXTFIELD_ROOT_MODULE,
      importPath: SPARTACUS_PRODUCT_CONFIGURATOR_TEXTFIELD_ROOT,
    },
    i18n: {
      resources: PRODUCT_CONFIGURATOR_TRANSLATIONS,
      chunks: PRODUCT_CONFIGURATOR_TRANSLATION_CHUNKS_CONFIG,
      importPath: SPARTACUS_PRODUCT_CONFIGURATOR_ASSETS,
    },
    styles: {
      scssFileName: PRODUCT_CONFIGURATOR_SCSS_FILE_NAME,
      importStyle: SPARTACUS_PRODUCT_CONFIGURATOR,
    },
  });
}

function addProductConfiguratorPackageJsonDependencies(packageJson: any): Rule {
  const spartacusVersion = `^${getSpartacusSchematicsVersion()}`;
  const dependencies: NodeDependency[] = [
    {
      type: NodeDependencyType.Default,
      version: spartacusVersion,
      name: SPARTACUS_PRODUCT_CONFIGURATOR,
    },
  ];
  return addPackageJsonDependencies(dependencies, packageJson);
}
