# Spotify Web API Tests

Automated API tests for the [Spotify Web API](https://developer.spotify.com/documentation/web-api), written in TypeScript and run with [Vitest](https://vitest.dev/).

The tests authenticate using the **Client Credentials flow** and check status codes, error messages and response data for the authentication, artist and search endpoints.

## Tech stack

- TypeScript
- Vitest (test runner)
- Native `fetch` (Node.js 18+)
- dotenv (loads credentials from `.env`)
- `openapi-typescript` generated types for Spotify response objects

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (developed on Node 22)
- A Spotify Developer account and an app created in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) to get a **Client ID** and **Client Secret**

## Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone <repo-url>
   cd Spotify
   npm install
   ```

2. Create a `.env` file in the project root with your Spotify app credentials:

   ```
   CLIENTID=your_spotify_client_id
   CLIENTSECRET=your_spotify_client_secret
   ```

   > `.env` is listed in `.gitignore` — never commit your real credentials.

## Running the tests

Run the whole suite:

```bash
npm test
```

Run a single test file:

```bash
npx vitest run tests/artist.test.ts
```

## Project structure

```
tests/
├── auth.test.ts         # Token endpoint (Client Credentials flow)
├── artist.test.ts       # GET /artists/{id}
├── search.test.ts       # GET /search
├── helpers/
│   ├── auth.ts          # getToken() – fetches an access token for the tests
│   └── config.ts        # Base URLs for the API and auth endpoints
├── types/
│   └── spotify.d.ts     # Spotify API types generated from the OpenAPI spec
└── practice/
    └── map.test.ts      # JavaScript array-method practice (map, filter, flatMap)
```

## Test coverage

### Authentication — `POST https://accounts.spotify.com/api/token`

| Scenario | Expected |
| --- | --- |
| Valid client ID and secret | `200`, returns `access_token` with `token_type: Bearer` |
| Invalid client ID | `400`, `invalid_client` |
| Invalid client secret | `400`, `invalid_client` |
| Missing client ID and secret | `400`, `invalid_client` |

### Artists — `GET /v1/artists/{id}`

| Scenario | Expected |
| --- | --- |
| Invalid access token | `401`, `Missing/invalid/expired access token` |
| No access token | `401` |
| Valid token and existing artist (Radiohead) | `200`, correct `name`, `type` and `uri` |
| Artist ID that does not exist | `404`, `Resource not found` |
| Malformed artist ID | `400`, `Invalid base62 id` |

### Search — `GET /v1/search`

| Scenario | Expected |
| --- | --- |
| Search albums for "Tupac" | `200`, results include *All Eyez On Me* |

## Notes and limitations

- These are **live tests** against the real Spotify API, so they need an internet connection and valid credentials, and results can change if Spotify's catalogue or error messages change.
- The Client Credentials flow does not give access to user data, so user endpoints (playlists, library, playback) are not covered.
- Running the tests often may hit Spotify's rate limits.

## Possible improvements

- Add tests for more endpoints (albums, tracks, playlists)
- Validate full response schemas against the generated types
- Run the suite in CI (for example, GitHub Actions with credentials stored as secrets)
