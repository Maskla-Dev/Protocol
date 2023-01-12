const path = require("path");
const htmlPlugin = require("html-webpack-plugin");

const currentMode = "development"

const tsResolve = {
    extensions: [".ts", ".tsx", ".js"],
    extensionAlias: {
        ".js": [".js", ".ts"],
        ".cjs": [".cjs", ".cts"],
        ".mjs": [".mjs", ".mts"]
    }
};

const tsRule = {
    test: /\.([cm]?ts|tsx$)/,
    loader: "ts-loader",
};

const sassRule = {
    test: /\.scss$/i,
    exclude: /node_modules/,
    use: [
        "style-loader",
        { loader: "css-loader", options: { modules: true, sourceMap: true } },
        { loader: "resolve-url-loader" },
        { loader: "sass-loader", options: { sourceMap: true, webpackImporter: true } },
    ]
}

const cssRule = {
    test: /\.css$/i,
    use: [
        "css-modules-typescript-loader",
        {
            loader: "css-loader",
            options: {
                url: true
            }
        },
    ]
}

const fontRule = {
    test: /\.ttf$/i,
    exclude: /node_modules/,
    type: 'asset',
    generator: {
        filename: 'assets/fonts/[name][ext]'
    }

}

const rendererConfig = {
    mode: currentMode,
    target: "electron-renderer",
    entry: {
        main: "./src/renderer/init.renderer.ts"
    },
    output: {
        path: path.resolve(__dirname, "app", "renderer"),
        filename: "renderer.js",
        assetModuleFilename: "assets/[hash][ext][query]",
        clean: true
    },
    resolve: tsResolve,
    module: {
        rules: [tsRule, sassRule, cssRule, fontRule]
    },
    plugins: [new htmlPlugin()]
};

const mainConfig = {
    mode: currentMode,
    target: "electron-main",
    entry: {
        main: "./src/main.ts"
    },
    output: {
        path: path.resolve(__dirname, "app"),
        filename: "main.js",
    },
    resolve: tsResolve,
    module: {
        rules: [tsRule]
    }
}

const preloadConfig = {
    mode: currentMode,
    target: "electron-preload",
    entry: {
        main: "./src/preload/main.preload.ts"
    },
    output: {
        path: path.resolve(__dirname, "app", "preload"),
        filename: "preload.js",
        clean: true
    },
    resolve: tsResolve,
    module: {
        rules: [tsRule]
    }
}

module.exports = [mainConfig, rendererConfig, preloadConfig];