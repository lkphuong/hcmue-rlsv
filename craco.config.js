/* craco.config.js */
const { resolve, join } = require(`path`);

const _dir = (_path = '') => join(resolve(__dirname, 'src'), _path);

module.exports = {
	webpack: {
		alias: {
			_api: _dir('api'),
			_controls: _dir('common/components/controls'),
			_layouts: _dir('common/components/layouts'),
			_others: _dir('common/components/others'),
			_styles: _dir('common/assets/styles'),
			_assets: _dir('common/assets'),
			_components: _dir('common/components'),
			_constants: _dir('common/constants'),
			_models: _dir('common/models'),
			_axios: _dir('utils/axios'),
			_func: _dir('utils/func'),
			_hooks: _dir('utils/hooks'),
			_slices: _dir('store/slices'),
			_store: _dir('store'),
			_contexts: _dir('contexts'),
			_config: _dir('config'),
			_common: _dir('common'),
			_modules: _dir('modules'),
			_routes: _dir('routes'),
			_utils: _dir('utils'),
			_theme: _dir('theme'),
		},
	},
};
