module.exports = {
  contextSeparator: '_',
  createOldCatalogs: false,
  defaultNamespace: 'translation',
  defaultValue: '',
  indentation: 2,
  keepRemoved: false,
  keySeparator: '.',
  lexers: {
    ts: ['JavascriptLexer'],
    tsx: ['JsxLexer'],
    default: ['JavascriptLexer']
  },
  lineEnding: 'auto',
  locales: ['en', 'es'],
  namespaceSeparator: ':',
  output: 'src/i18n/$LOCALE.json',
  input: ['src/**/*.{ts,tsx}'],
  sort: true,
  verbose: true
};
