| Feature         | Local Development      | Production Deployment          | Prod. Considrations        |
| --------------- | ---------------------- | ------------------------------ | -------------------------- |
| Next.js         | `pnpm dev`             | Deployed to Vercel             |                            |
| Rust Backend    | `cargo watch -x run`   | Deployed to Hostinger VPS      | Render, Fly.io, or similar |
| Convex Database | `pnpm exec convex dev` | Deployed to Vercel & Convexdev |                            |
| Clerk Auth      | Clerk                  | Clerk                          |                            |
| File Storage    | Uploadthing            | Uploadthing                    |                            |

### Run Locally for Development
- Run `pnpm dev`
- Starts Next.js dev server using `pnpm dev:next`
- Starts local Convex database using `pnpm dev:convex`
- Starts Rust backend using `cargo watch -x run`

Deploy using Github CI/CD Actions.

Next.js
Convex.dev
Clerk Auth
Rust
Axum
Hostinger
Uploadthing