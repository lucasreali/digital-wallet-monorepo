import { defineConfig } from 'kubb/config'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginFetch } from '@kubb/plugin-fetch'
import { pluginReactQuery } from '@kubb/plugin-react-query'

// Contrato gerado pelo BFF (`pnpm --filter bff openapi`); o front só conhece o BFF
export default defineConfig({
  input: '../bff/openapi.json',
  output: { path: './src/gen', clean: true },
  plugins: [
    pluginTs(),
    pluginFetch({ baseURL: '${import.meta.env.VITE_BFF_URL}' }),
    pluginReactQuery({ hooks: true }),
  ],
})
