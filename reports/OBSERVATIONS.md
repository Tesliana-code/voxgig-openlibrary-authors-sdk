# Voxgig SDK Generator — Developer Experience Report

API: Open Library Authors API
Target: TypeScript
Environment: WSL, Node.js 20.19.4
Human work: Time-boxed exercise with AI assistance

## Results

- SDK generation: PASS
- TypeScript build: PASS
- Tests: 219 passed, 1 failed, 11 skipped
- Generated SDK dependencies: 0 reported vulnerabilities
- Generator toolchain: 3 reported vulnerabilities (2 low, 1 high)

## Issues Observed

1. Node.js compatibility:
   The generated SDK requires Node >=22.13.
   Under Node 20, the default test runner could not
   resolve the test file glob. Explicitly passing the
   compiled test files allowed the tests to execute.

2. Generated test failure:
   direct-load-author_id failed because result.ok
   was false rather than true.
   Root cause was not established within the time-box.
   Node 20 is not a supported runtime.

## Recommendations

- Check Node version earlier and provide a clear warning.
- Improve test runner compatibility diagnostics.
- Include more actionable information when generated
  operation tests fail.

## AI Assistance

AI assisted with the OpenAPI definition, generator
instructions, diagnosis, and report preparation.
The generated SDK was compiled and tested locally.
The failing test was not manually patched.

## Limitations

The OpenAPI contract covers three read-only endpoints.
No live API smoke test was performed.
