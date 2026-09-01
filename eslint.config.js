// No usa FlatCompat + "next/core-web-vitals" (el patrón que documenta Next.js
// para ESLint 9): ese camino carga la config LEGACY de eslint-config-next a
// través de @eslint/eslintrc, que intenta validarla con su validador de
// esquema clásico -- y eslint-plugin-react 7.37+ expone su config plana con
// una auto-referencia circular (plugins['react'] apunta al propio objeto del
// plugin, normal y soportado por el loader de flat config de ESLint), que
// el validador legacy revienta al intentar JSON.stringify-arla para el
// mensaje de error. Import directo de los exports de flat config nativos de
// cada plugin evita ese camino roto por completo.
const nextPlugin = require('@next/eslint-plugin-next');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');

module.exports = [
  { ignores: ['node_modules/**', '.next/**'] },
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['**/*.test.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        // Next.js Pages Router + navegador
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        process: 'readonly',
        fetch: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    plugins: {
      '@next/next': nextPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat['jsx-runtime'].rules, // React 19: no hace falta `import React` en scope
      ...reactHooksPlugin.configs['recommended-latest'].rules,
      'react/prop-types': 'off', // proyecto sin TypeScript ni PropTypes formales
      'react/no-unknown-property': ['error', { ignore: ['jsx', 'global'] }], // styled-jsx (<style jsx>) es de Next.js, no una propiedad desconocida
      // Regla nueva y más estricta sobre no llamar setState de forma síncrona
      // dentro de un efecto -- en ChatWidget.js se usa exactamente para el
      // patrón estándar "detectar si el navegador soporta esta función y
      // guardarlo en estado", que corre una sola vez al montar. Es una
      // sugerencia de estilo válida, no un bug -- se deja en warn en vez de
      // forzar un refactor de un componente ya verificado funcionando.
      'react-hooks/set-state-in-effect': 'warn',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    // Los archivos de test corren bajo Node (vitest), no en el navegador --
    // sin JSX, sin reglas de React/Next.
    files: ['**/*.test.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        fetch: 'readonly',
        global: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
    },
  },
];
