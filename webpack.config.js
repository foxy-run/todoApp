const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/js/script.js', // Точка входа
    output: {
        filename: 'script.js', // Имя выходного файла
        path: path.resolve(__dirname, 'dist'), // Путь для сборки
        clean: true, // Очищает папку dist перед сборкой
    },
    devServer: {
        static: path.join(__dirname, 'dist'), // Папка для сервера разработки
        port: 8080, // Порт сервера
        open: false, // Автооткрытие браузера
        hot: true, // Горячая перезагрузка
    },
    mode: 'production', // Режим сборки
    module: {
        rules: [
            {
                test: /\.scss$/i, // Обработка SCSS файлов
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                quietDeps: true, // Отключает предупреждения о зависимости
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css$/, // Обработка CSS файлов
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.png$/, // Обработка PNG файлов
                type: 'asset/resource', // Встроенный загрузчик Webpack
                generator: {
                    filename: 'images/[hash][ext][query]', // Путь для выходных файлов
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.json'], // Расширения файлов для импорта
    },
    plugins: [

        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/assets/img', to: 'images' }, // Копирует все изображения в папку dist/images
            ],
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html', // Шаблон HTML
            filename: 'index.html', // Имя выходного HTML файла
            inject: true, // Вставлять скрипты автоматически
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css', // Имя выходного CSS файла
        }),
    ],
    ignoreWarnings: [/node_modules/]
};
