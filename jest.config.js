// Jest configuration file
module.exports = {
    preset: 'ts-jest',
    transform: {},
    testEnvironment: 'node',
    setupFilesAfterEnv: ['@babel/register'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
    transformIgnorePatterns: [
        '/node_modules/',
    ],
};