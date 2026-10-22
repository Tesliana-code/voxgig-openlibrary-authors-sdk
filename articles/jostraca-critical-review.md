# Jostraca and the Second-Run Problem: A Critical Review

*Code generation is impressive for about thirty seconds. Regeneration, after developers have edited the output, is where trust is won or lost.*

A generator's first run is usually the easy part. It writes directories, configuration files, source modules, tests, and perhaps documentation. The result looks convincing in a demo. Then a developer changes something in the generated output, the input specification evolves, and someone runs the generator again.

What gets overwritten? What gets preserved? Who decides when two changes are incompatible?

[Jostraca](https://github.com/jostraca/jostraca) is an open-source project that takes those questions seriously. It describes files and folders as a component tree, separates declaration from writing to disk, and offers explicit strategies for handling existing files. I approached it while reviewing the tooling behind the Voxgig SDK generator, but this is a review of Jostraca's design—not a claim that every SDK-generator issue originates in Jostraca.

## A directory tree built from ordinary code

Jostraca's TypeScript API uses components named `Project`, `Folder`, `File`, and `Content`. This example follows the project's documented API:

```js
import { Jostraca, Project, Folder, File, Content } from 'jostraca'

const generator = Jostraca({ model: { service: { name: 'edge-api' } } })

await generator.generate({ folder: './out' }, () => {
  Project({ folder: 'edge-api' }, () => {
    File({ name: 'package.json' }, () => {
      Content('{ "name": "$$service.name$$", "type": "module" }\n')
    })
    Folder({ name: 'src' }, () => {
      File({ name: 'server.js' }, () => {
        Content('export const ready = true\n')
      })
    })
  })
})
```

Rather than inventing loops and conditionals inside a special template language, the generator can use JavaScript's own control flow. Jostraca also supports templates with slots, while keeping the source template valid in its own language.

That is attractive. A developer can debug the generator with familiar tools. On the other hand, it is still *programming*: deeply nested component calls, filesystem conventions, conditional output, and multiple input models can become as difficult to maintain as any ordinary application. Avoiding a template dialect does not automatically produce a simple generator.

The project's two-phase model—define the output tree, then build it—is a useful architectural choice. It creates room to reason about what should be written before touching files. But I would still want generated output reviewed like any other code change.

## The destructive default

Jostraca's own [tutorial](https://github.com/jostraca/jostraca/blob/main/docs/tutorial.md) contains a revealing example. A generator creates a shell configuration file. A developer adds `DEBUG=1` manually. The generator then changes the port and runs again.

Under the default `write` behavior, the manual line disappears.

That is not necessarily a bug. For files explicitly owned by the generator, overwriting may be exactly right. The danger is when ownership is unclear. A team can treat generated code as editable source, while its generation tool treats the same file as disposable output.

Jostraca supports a three-way merge mode using the previous generated version as the common base. Its tutorial shows a configuration along these lines:

```js
const generator = Jostraca({
  existing: { txt: { write: true, merge: true } },
})
```

With that strategy, an unrelated hand-added line can survive alongside an updated generated port. Conflicting edits to the same lines are represented with conflict markers and reported in the generation result rather than silently guessed away.

That behavior is valuable. It makes the boundary between generator changes and human changes visible. The repository also documents other modes, including `preserve`, `diff`, and `present`.

One detail especially caught my attention: the tutorial warns that enabling `present` without disabling `write` can overwrite the file you intended to protect. The documented safer combination is:

```js
const generator = Jostraca({
  existing: { txt: { write: false, present: true } },
})
```

This is an honest warning, and a legitimate developer-experience concern. A preservation mode should make destructive combinations difficult to select accidentally—or at least impossible to misunderstand. I would investigate how visible that warning is to developers who do not read the tutorial from start to finish.

## A successful merge is not a correct program

Even when a three-way merge preserves all intended text, it cannot promise semantic compatibility.

Suppose a developer manually adds a tracing call to a generated client. A new generator version changes the client interface. The merge retains the tracing call, but that method no longer exists.

The merge worked; the software does not.

My ideal regeneration pipeline would report four distinct outcomes:

1. The generator completed.
2. Existing-file conflicts were resolved or surfaced.
3. The generated code compiled.
4. Behavioral tests passed.

A green first step says little about the fourth. This is not a unique flaw in Jostraca. It is a limitation of treating file-level transformations as evidence of application correctness.

## What I saw in the Voxgig SDK exercise

In a separate, time-boxed exercise, I used the Voxgig SDK generator to produce a TypeScript SDK for three read-only Open Library Authors endpoints. The generation completed, and the generated TypeScript project built successfully.

Testing was more complicated. My environment ran Node.js 20.19.4, while the generated package specified Node.js 22.13 or newer. The default test command did not work under that unsupported runtime. Running the compiled test files explicitly produced **219 passing tests, one failing test, and 11 skipped tests**.

The single failure concerned an author-loading operation whose result was not successful when the test expected it to be. I did not determine the underlying cause within the exercise's time limit, and no live API smoke test was performed.

These observations do **not** establish a Jostraca defect. They involve the larger Voxgig generation and testing pipeline and an unsupported Node.js version. They are useful here for a different reason: they demonstrate why successful generation and successful compilation must not be conflated with an independently validated SDK.

The original report is available in the [exercise repository](https://github.com/Tesliana-code/voxgig-openlibrary-authors-sdk/blob/main/reports/OBSERVATIONS.md).

## What I would test before depending on it

Jostraca's documentation claims that its TypeScript and Go implementations produce byte-identical output for the same logical input, and says a shared specification corpus checks parity. That is an ambitious and testable property. I have reviewed the documentation, but I have not independently reproduced that result.

My first practical evaluation would focus on regeneration, not initial generation:

- Generate an ordinary source file from a fixed model.
- Modify the file by hand and change the model independently.
- Regenerate with the documented merge configuration.
- Inspect the diff, any conflict reports, and the final compiled program.
- Repeat with both sides editing the same line.

I would also test a corrupted or missing merge baseline, a partially completed generation, and the behavior when a file contains a protection marker. A documentation example that works under ideal conditions is encouraging; predictable failure behavior is what makes a tool trustworthy in a team.

## Verdict

Jostraca deserves attention because it treats regeneration as a design problem rather than an afterthought. Ordinary-language component definitions, explicit existing-file strategies, and documented three-way merging are sensible choices.

My main criticism is that the configuration surface carries consequential defaults. Developers must understand which files are generator-owned, which are human-owned, and what each regeneration mode actually does. The project's own `present`-plus-`write` warning illustrates why this matters.

I am positive about the architectural direction, but I would not recommend any code-generation stack on the strength of a successful first run alone. Its second run—and the tests that follow—are the evidence I would want.

*Scope note: This is a documentation- and code-informed technical review, not a report of having independently benchmarked Jostraca's merge modes.*

**References:** [Jostraca repository](https://github.com/jostraca/jostraca) · [Jostraca tutorial](https://github.com/jostraca/jostraca/blob/main/docs/tutorial.md) · [Component reference](https://github.com/jostraca/jostraca/blob/main/docs/reference-components.md) · [Voxgig exercise report](https://github.com/Tesliana-code/voxgig-openlibrary-authors-sdk/blob/main/reports/OBSERVATIONS.md)
