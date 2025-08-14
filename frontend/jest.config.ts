import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testMatch: [
    "<rootDir>/tests/**/*.test.{ts,tsx}",
    "<rootDir>/src/**/*.test.{ts,tsx}",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          resolveJsonModule: true,
          target: "es2020",
          module: "esnext",
          jsx: "react-jsx",
          moduleResolution: "node",
          isolatedModules: true
        },
      },
    ],
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png|jpg|jpeg)$": "jest-transform-stub",
  },
  transformIgnorePatterns: ["node_modules/(?!(@testing-library/react)/)"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/build/", "/dist/"],
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  globals: {
    "import.meta": {
      env: {
        DEV: false,
      },
    },
  },
};

export default config;
