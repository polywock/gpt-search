const { resolve } = require("path")
const { env } = require("process")
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

const tsx = {
  test: /\.tsx?$/,
  exclude: /node_modules/,
  resourceQuery: { not: [/sfx/] },
  use: "babel-loader"
}

const entry = {
  raccoon: "./src/raccoon/index.tsx",
  main: "./src/main.ts",
  preamble: "./src/preamble/index.ts",
  background: "./src/background/index.ts",
  options: "./src/options/index.tsx"
}

if (env.FIREFOX) {
  entry["mainLoader"] = "./src/mainLoader.ts"
}

const common = {
  target: "browserslist",
  entry,
  output: {
    path: resolve(__dirname, env.FIREFOX ? "buildFf": "build", "unpacked")
  },
  module: {
    rules: [
      tsx,
      {...tsx, resourceQuery: /sfx/, sideEffects: true},
      {
        sideEffects: true,
        test: /\.css$/,
        exclude: /node_modules/,
        resourceQuery: { not: [/raw/] },
        use: [
            "style-loader", 
            {
              loader: "css-loader",
              options: {
                import: true,
              }
            },
            "postcss-loader"
        ],
      },
      {
        test: /\.css$/,
        resourceQuery: /raw/,
        exclude: [/node_modules/],
        type: 'asset/source',
        use: [
          "postcss-loader"
        ]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", '.ts', '.js']
  },
  plugins: [
    new webpack.ProvidePlugin({
      gvar: [resolve(__dirname, "src", "globalVar.ts"), "gvar"]
    })
  ]
}

if (env.NODE_ENV === "production") {
  module.exports = {
    ...common,
    mode: "production",
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            }
          },
          extractComments: false,
        })
      ]
    }
  }
} else {
  module.exports = {
    ...common,
    mode: "development",
    devtool: false
  }
}