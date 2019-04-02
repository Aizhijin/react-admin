const { override, fixBabelImports, addLessLoader,addBabelPlugins  } = require('customize-cra');

module.exports = override(
    //按需加载
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#1DA57A' },
    }),
    addBabelPlugins(
        [
            "@babel/plugin-proposal-decorators",
            {
                "legacy": true
            }
        ]
    )
);
