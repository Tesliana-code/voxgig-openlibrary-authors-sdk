# Open Library Authors SDK — Voxgig candidate exercise

This repository is a **time-boxed SDK generator exercise**, using the Voxgig toolchain and the official [Open Library Authors API](https://openlibrary.org/dev/docs/api/authors).

**Status: starter source only. SDK generation and tests have not been executed.** Do not describe it as a working generated SDK until those steps succeed.

## Scope

The hand-curated minimal [`spec/openapi.yaml`](spec/openapi.yaml) describes three documented public endpoints:

- `GET /search/authors.json?q=...`
- `GET /authors/{authorId}.json`
- `GET /authors/{authorId}/works.json`

This is a deliberately **partial** API contract, not the upstream official full OpenAPI file. Some response properties are intentionally omitted rather than guessed. Check the generated API types against live response examples before calling them complete.

## Generate an SDK using Voxgig

Requirements: Node.js >= 22 and network access to npm. From a fresh local checkout:

```sh
npx @voxgig/create-sdkgen openlibrary-authors -d ./spec/openapi.yaml -o ./generated -t ts -f test
cd generated/.sdk
npm run generate
cd ../ts
npm install
npm run build
npm test
```

> The precise flags and generated directory layout should be verified against the installed version and its current help output. Voxgig also documents `npm create @voxgig/sdkgen` as the guided entry point.

If a command fails, **stop or document the issue rather than manually hand-writing a substitute SDK**. Keep the original error output in the report.

## Testing and attribution

Tests should be primarily offline. If you perform a live smoke test, respect Open Library's rate limits and send an identifying User-Agent, as required by its usage guidelines. The exercise is not an endorsement by Open Library.

## Human time-box

Richard requested a maximum of **30 minutes of human work**, including recording observations. Report what was and was not completed within that limit. AI assistance is allowed, but its role and verification must be documented.

## License

MIT, see [LICENSE](LICENSE). The source API and Open Library's data have their own usage rules.

## References

- [Voxgig SDK generator](https://voxgig.com/sdk)
- [Voxgig scaffold documentation](https://www.voxgig.com/sdk/docs/create-sdkgen)
- [Open Library Authors API](https://openlibrary.org/dev/docs/api/authors)
- [Open Library API usage guidelines](https://openlibrary.org/developers/api)
