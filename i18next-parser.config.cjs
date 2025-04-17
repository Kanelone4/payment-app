// i18next-parser.config.cjs
module.exports = {
  locales: ['en', 'fr'],
  output: 'src/locales/$LOCALE/$NAMESPACE.json',
  input: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/locales/**'
  ],
  defaultNamespace: 'translation',
  keySeparator: '.',
  namespaceSeparator: ':',
  pluralSeparator: '_',
  contextSeparator: '_',
  
  // Paramètres critiques modifiés :
  defaultValue: '', // Laisse les valeurs vides au lieu d'utiliser les clés
  useKeysAsDefaultValue: false, // Désactive l'utilisation des clés comme valeurs
  createOldCatalogs: false,
  returnEmptyString: false,
  
  // Configuration des lexers
  lexers: {
    tsx: ['JsxLexer'],
    ts: ['JsxLexer'],
    default: ['JsxLexer']
  },
  
  // Paramètres supplémentaires recommandés
  lineEnding: 'auto',
  sort: true,
  verbose: true,
  failOnWarnings: false,
  customValueTemplate: null,
  skipDefaultValues: false,
  indentation: 2,
  metadata: {}
};