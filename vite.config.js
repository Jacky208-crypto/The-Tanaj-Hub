import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// On Vercel, files in api/ are serverless functions. `vite` doesn't know about
// them, so in dev we run the same handlers here (POST only — that's all they
// export) with the variables from .env.
function vercelApiInDev(env) {
  return {
    name: 'vercel-api-in-dev',
    configureServer(server) {
      Object.assign(process.env, env)
      server.middlewares.use('/api', async (req, res, next) => {
        try {
          const name = req.url.split('?')[0].replace(/^\/+/, '')
          if (!/^[\w-]+$/.test(name)) return next()
          const mod = await server.ssrLoadModule(`/api/${name}.js`)
          const handler = mod[req.method]
          if (!handler) { res.statusCode = 405; return res.end() }

          const chunks = []
          for await (const c of req) chunks.push(c)
          const request = new Request(`http://localhost${req.originalUrl}`, {
            method: req.method,
            headers: req.headers,
            body: chunks.length ? Buffer.concat(chunks) : undefined,
          })
          const response = await handler(request)
          res.statusCode = response.status
          response.headers.forEach((v, k) => res.setHeader(k, v))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (e) {
          next(e)
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), vercelApiInDev(loadEnv(mode, process.cwd(), ''))],
  server: {
    port: 3000,
    strictPort: true, // fail instead of silently picking another port
  },
}))
