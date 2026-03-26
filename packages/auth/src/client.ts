import { createAuthClient } from "better-auth/react"
import { customSessionClient } from "better-auth/client/plugins"
import type { auth } from "./auth.js"
import type {} from "better-auth/client"

export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>()],
})
