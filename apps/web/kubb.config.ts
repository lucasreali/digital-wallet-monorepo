import { pluginFetch } from '@kubb/plugin-fetch'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginZod } from '@kubb/plugin-zod'
import { defineConfig } from 'kubb/config'

// Contrato gerado pelo BFF (`pnpm --filter bff openapi`); o front só conhece o BFF
export default defineConfig({
  input: '../bff/openapi.json',
  output: { path: './src/gen', clean: true },
  // pluginZod: schemas dos DTOs para validar os campos no TanStack Form
  plugins: [
    pluginTs(),
    pluginZod(),
    // biome-ignore lint/suspicious/noTemplateCurlyInString: Kubb copies this string verbatim into the generated client
    pluginFetch({ baseURL: '${import.meta.env.VITE_BFF_URL}' }),
    pluginReactQuery({ hooks: true }),
  ],
})
