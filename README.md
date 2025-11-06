# React + TypeScript + Vite + TailwindCss + Shadcn + TsConfigPath

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# Setup **TSConfigPath** cho dự án frontend này:
- Cày `vite-tsconfig-paths` bằng lệnh sau:
```bash
npm i vite-tsconfig-paths
```
- Sau đó vào file `tsconfig.app.json` thêm 2 dòng sau:
```bash
{
  "compilerOptions": {
    "ignoreDeprecations": "6.0", /* thêm dòng này để báo với ts rằng ignoreDeprecations đã được cấu hình */
    "baseUrl": ".", /* Thư mục gốc của dự án */
    "paths": { /* đường dẫn thư mục */
      "@/*": ["src/*"], /* Thư mục src */
      "pages/*": ["src/pages/*"], /* Thư mục src/pages */
      "components/*": ["src/components/*"], /* Thư mục src/components */
      "assets/*": ["src/assets/*"] /* Thư mục src/assets */
    },
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```
- Còn file `vite.config.ts` thì setup như sau:
```bash
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths' // import thư viện hỗ trợ đường dẫn từ tsconfig

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],  // Sử dụng plugin để hỗ trợ React và đường dẫn từ tsconfig
})

```
Sau đó thì dùng như bình thường.

# Cày **tailwindcss** cho dự án:
```bash
npm install tailwindcss @tailwindcss/vite
```
Mở file `vite.config.ts` và setup cho dự án:
```bash
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths' // import thư viện hỗ trợ đường dẫn từ tsconfig
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // Sử dụng plugin để hỗ trợ React và đường dẫn từ tsconfig
    tailwindcss()],
})
```
Và cuối cùng thêm `@import "tailwindcss";` vào cho file **index.css** của thư mục `src` là xong.

# Cài **Shadcn** cho dự án này:
- Documentation: [Shadcn](https://ui.shadcn.com/docs/installation/vite) để dùng thư viện này bắt buộc phải có `tailwindcss` cho dự án và dự án phải là vite typescript.
- Chỉnh sửa file `tsconfig.json` thành như sau:
```bash
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": { // Shared options
    "ignoreDeprecations": "6.0",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```
- Tiếp đến sửa file `tsconfig.app.json` (vì trước đó ta đã setup TSConfigPath rồi nên bước này khỏi làm củng được.):
```bash
{
  "compilerOptions": {
    // ...
    "ignoreDeprecations": "6.0", /* thêm dòng này để báo với ts rằng ignoreDeprecations đã được cấu hình */
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
    // ...
  }
}
```
- Sau đó cày Types/node cho dự án:
```bash
npm install -D @types/node
```
Và sửa tiếp file `vite.config.ts`:
```bash
import path from "path"
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // Sử dụng plugin để hỗ trợ React và đường dẫn từ tsconfig
    tailwindcss()], // tailwind đã cày trước đó
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    }
})
```
Xong rồi giờ ta có thể khỏi tạo dự án Shadcn cho dự án của chúng ta:
```bash
npx shadcn@latest init
```
Khi chạy lệnh trên nó sẽ hỏi chúng ta dùng giao diện màu gì cho theme, ta có thể chọn màu mặc định là `Slate`, sau khi chạy xong bạn sẽ thấy có 1 file và 1 thư mục được tạo đó là file `components.json` và thư mục `lib` được tạo trong src của chúng ta.
- Vậy là đã cày Shadcn hoàn thành giờ ta có thể tải component của shadcn qua lệnh:
```bash
npx shadcn@latest add "component mà bạn muốn cài"
```
`node: lệnh trên trong dấu "" là không có muốn cày component thì bạn chỉ cần xóa 2 "" này và viết tên componet mà bạn muốn tải về`

Sau khi cài component thì trong dự án thư mục `src` sẽ có thêm 1 thư mục `component` và có thư mục `ui` bên trong chứa các component mà bạn đã tải.

# trang Web Background cho dự án: [patterncraft](https://patterncraft.fun/)



### Copyright belongs to [LianHarman](https://www.facebook.com/LianHarman/)

