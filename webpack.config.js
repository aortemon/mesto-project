const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // Минификация CSS

module.exports = {
  entry: {
    main: './src/components/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.[contenthash].js',  // Хеширование имени JS файла для предотвращения кэширования
    publicPath: '/mesto-project/',  // Используется для указания базового пути для всех ресурсов
  },
  mode: 'production',  // Установить режим production для оптимизаций
  devServer: {
    static: path.resolve(__dirname, './dist'),
    open: true,
    compress: true,
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/, // Путь с регулярным выражением для исключения node_modules
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/, // Поддержка изображений
        type: 'asset/resource', // Для изображений и шрифтов используем asset/resource
        generator: {
          filename: 'images/[name].[hash][ext][query]', // Генерация файлов с хешем
        }
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/, // Поддержка шрифтов
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash][ext][query]', // Генерация файлов с хешем
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // Экстракция CSS в отдельный файл
          'css-loader', // Загружает и обрабатывает CSS
          'postcss-loader' // Использование PostCSS для автопрефиксов
        ]
      },
    ]
  },
  optimization: {
    minimize: true, // Включаем минимизацию
    minimizer: [
      new CssMinimizerPlugin(), // Минификация CSS
      new TerserPlugin(), // Минификация JS
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'  // Указываем шаблон HTML
    }),
    new CleanWebpackPlugin(), // Очистка директории dist перед сборкой
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css' // Хеширование имен CSS файлов
    }), // Экстракция CSS в отдельный файл
  ]
}
