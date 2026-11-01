# Deliberative Vote

A **React and TypeScript voting prototype** exploring a simple idea: let participants explain their choices alongside their votes.

Created with Lovable, using Vite, shadcn/ui, Tailwind CSS, and Supabase. This repository documents the prototype's implementation; it does not claim production usage or independently authored implementation of every component.

## Implemented flows

- Google sign-in through Supabase Auth.
- Create a poll with a title, description, options, and optional expiry date.
- Browse active polls and a separate list of the signed-in user's polls.
- Submit a vote with an optional reason; the client assigns weight 2 to a vote with a reason and 1 otherwise.
- Display results and switch between Chinese and English UI text.
- Show loading, empty, success, and error feedback.

## Code guide

| File | Responsibility |
| --- | --- |
| [VotingApp.tsx](src/pages/VotingApp.tsx) | Main screen and poll tabs |
| [CreatePollForm.tsx](src/components/CreatePollForm.tsx) | Poll creation form |
| [PollCard.tsx](src/components/PollCard.tsx) | Voting and result presentation |
| [usePolls.ts](src/hooks/usePolls.ts) | Supabase reads/writes and refresh logic |
| [useAuth.tsx](src/hooks/useAuth.tsx) | Authentication state and Google sign-in |
| [i18n.ts](src/lib/i18n.ts) | UI translations |
| [migrations](supabase/migrations) | Database schema and policies |

## Run locally

```sh
npm install
npm run dev
```

The application depends on Supabase. For an independent setup, configure your own project, review and apply the migration in `supabase/migrations`, enable Google authentication with appropriate redirect URLs, and update `src/integrations/supabase/client.ts` to point to that project. Do not use a service-role key in browser code.

```sh
npm run build
npm run lint
```

There is currently no automated test script in `package.json`. Live authentication and database availability are not guaranteed by this README.

## Prototype boundaries

Weighted voting is an experimental product rule, not a measure of argument quality. Server-side enforcement of voting rules and expiry requires validation before production use.

Poll and option creation currently use separate requests. A next iteration should make creation atomic, preserve form input when a request fails, and add tests for duplicate votes, expiry, authentication, and error recovery.
