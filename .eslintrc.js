module.exports = {
	extends: [
		'eslint:recommended',
	],
	env: {
		// commonjs:true,
		es6:true,
		node:true,
		mocha:true,
	},
	globals: {
		ROOT_PATH: true,
		CustomError: true,
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': ['error'],

		'no-cond-assign': 'off',
		'no-constant-condition': 'off',
		'no-mixed-spaces-and-tabs': 'off',
		'no-regex-spaces': 'off',
		'no-unused-vars': 'off',
		'no-useless-escape': 'off',
		'require-atomic-updates': 'off',

		'prefer-const': 'warn',

		'brace-style': 'error',
		'comma-dangle': ['error', {
			'arrays': 'always-multiline',
			'objects': 'always-multiline',
			'imports': 'ignore',
			'exports': 'ignore',
			'functions': 'ignore'
		}],
		'eqeqeq': 'error',
		'func-call-spacing': 'error',
		'indent': ['error', 'tab', {"SwitchCase": 1}],
		'key-spacing': 'error',
		'keyword-spacing': 'error',
		'no-array-constructor': 'error',
		'no-duplicate-imports': 'error',
		'no-eval': 'error',
		'no-floating-decimal': 'error',
		'no-implied-eval': 'error',
		'no-new-object': 'error',
		'no-param-reassign': 'error',
		'no-path-concat': 'error',
		'no-return-await': 'error',
		'no-self-compare': 'error',
		'no-trailing-spaces': 'error',
		'no-var': 'error',
		'quotes': ['error', 'single'],
		'yoda': 'error',
	},
};