/* craco.config.js */
const { resolve, join } = require(`path`);

const _dir = (_path = "") => join(resolve(__dirname, "src"), _path);

module.exports = {
  webpack: {
    alias: {
      _api: _dir("api"),
      _controls: _dir("common/components/controls"),
      _layouts: _dir("common/components/layouts"),
      _others: _dir("common/components/others"),
      _components: _dir("common/components"),
      _styles: _dir("common/assets/styles"),
      _constants: _dir("common/constants"),
      _assets: _dir("common/assets"),
      _models: _dir("common/models"),
      _config: _dir("config"),
      _routes: _dir("routes"),
      _axios: _dir("utils/axios"),
      _func: _dir("utils/func"),
      _hooks: _dir("utils/hooks"),
      _modules: _dir("modules"),
      _common: _dir("common"),
      _theme: _dir("theme"),
      _utils: _dir("utils"),
    },
  },
};
