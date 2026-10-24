FROM node:22-alpine AS base

RUN apk update

WORKDIR /app

#PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack install --global pnpm@10

FROM base AS prepare
# Replace <your-major-version> with the major version installed in your repository. For example:
RUN pnpm add --global turbo@^2.7.1
COPY . .
# Add lockfile and package.json's of isolated subworkspace
# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune @hndl/database --docker

# ---
FROM base AS builder

RUN apk add --no-cache openssl ca-certificates
# First install the dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# Build the project
COPY --from=prepare /app/out/full/ .

RUN pnpm --filter @hndl/database exec prisma generate
CMD ["pnpm", "run", "db:deploy"]