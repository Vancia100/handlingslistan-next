import { createAuthClient } from "better-auth/react"
import { customSessionClient } from "better-auth/client/plugins"
import type { auth } from "./auth.js"

export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>()],
  baseURL: "http://localhost:3001/auth",
  fetchOptions: {
    credentials: "include",
  },
})
