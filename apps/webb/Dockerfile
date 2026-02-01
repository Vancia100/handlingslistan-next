FROM node:22-alpine AS base

RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app

#PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ---
FROM base AS prepare
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN yarn global add turbo@^2
RUN pnpm add -global turbo@^2.7.1
COPY . .
# Add lockfile and package.json's of isolated subworkspace
# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune webb --docker

# ---
FROM base AS builder

RUN apk add --no-cache openssl
# First install the dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# Build the project
COPY --from=prepare /app/out/full/ .

RUN pnpm exec turbo build

# CMD ["ls", "apps/webb/.next/standalone"]
# ---
FROM base AS runner
# Don't run production as root for security reasons
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


COPY --from=builder --chown=nextjs:nodejs /app/apps/webb/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/webb/.next/static ./apps/webb/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/webb/public ./apps/webb/public
USER nextjs

ENV HOSTNAME 0.0.0.0
ENV NODE_ENV production
EXPOSE 3000
CMD ["node", "apps/webb/server.js"]