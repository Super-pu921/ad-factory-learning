# V8 implementation and release status

Updated: 2026-11-05. Scope: V2.0 overall P1–P8 roadmap.

The user has authorized continuous development, verification and release without
repeated phase approvals. This replaces the former local-only/no-publish task
restriction. It does not make unverified mappings or personal-record migrations
safe to execute. Production migration remains **BLOCKED**.

## Delivered foundation

- P3.3 static audit tools, accepted against the real repository with Node 22.
- `scripts/v8-legacy-catalog-view.mjs`: immutable, lossless legacy view; strict
  typed entity lookup; explicit candidate 1:1/1:N/N:1 preflight; evidence and
  declared snapshot matching; rejection of ambiguity, identity conflicts,
  unresolved targets, unversioned targets and self-declared VERIFIED status.
- `knowledge-catalog/source/D01-D16-V1.0.md`: byte-identical source supplied by
  the user, SHA-256
  `3d8d20fb8098ed1d483854855748b92287a8803ee0ffab644d4413bc0136323f`.
- `knowledge-catalog/catalog.json`: reproducible directory import, retaining
  all 840 original entries and seven explicitly confirmed alias groups, with
  833 preliminary canonical concepts. No original entry is deleted. The 319
  four-column D13–D16 rows have `sourceStatus: null`; no status is invented.
- New regression scripts for lossless lookup, candidate consistency, provenance,
  malformed input, catalog reproduction and original-content preservation.

These are offline tools and static directory assets. They do not constitute a
production compatibility layer, a completed curriculum or a migration engine.
The preflight validates declared candidate consistency only. Caller-supplied
commit and file hashes are evidence declarations, not cryptographic proof of
target existence, human verification or migration authorization.

## Directory interface and teaching pilot

`knowledge-catalog/index.html` now provides responsive domain filtering, search,
incremental results, original-source links, explicit alias navigation and all
thirteen D17 candidate directions. It is accessible from a new top-bar tool link
in the existing workbench; the four original main navigation items are retained.

The Button sample at `#K-D01-001` has three independent teaching units:
L1/E1 native button activation and disabling, L2/E2 busy/failure/retry behavior,
and L3/E2 a memory-only teaching quote. The three units pin and reuse exact
sample content-block versions. Each includes objectives, mechanism, executable
demo, code, exercise, acceptance conditions, pitfalls and summary. Amounts use
integer cents and input limits; the example is not a real quotation service.
Sample-local unit/block IDs do not become formal Course/Unit mappings.

No new progress persistence is provided. All interactions remain in memory, and
neither localStorage nor IndexedDB is read by the directory/sample modules.
The directory import's `authoredCourses: 0` still refers to formal Course
entities; the newly authored sample does not invent a migrated Course or
associate original progress with any sample unit.

The browser regression uses existing Playwright in isolated contexts and
synthetic sentinel storage. Chromium and WebKit, at desktop and 390px mobile
viewports, exercised the entry link, domain/search/alias behavior, keyboard
activation, failure/retry, numeric errors, viewport limits and original-storage
preservation. Separate source-failure and untrusted-text cases are covered.
These are automated browser checks, not manual acceptance in a user's profile.

## Run

Use an existing Node 22 executable by absolute path. No package installation is
required and the default system Node need not change.

```powershell
& $node22 scripts/audit-v8-migration.mjs
& $node22 scripts/test-v8-migration.mjs
& $node22 scripts/test-v8-legacy-catalog-view.mjs
& $node22 scripts/test-v8-knowledge-catalog.mjs
& $node22 scripts/test-v8-knowledge-pilot.mjs
& $node22 scripts/build-v8-knowledge-catalog.mjs
```

The catalog builder prints JSON to stdout and never writes a file itself.
The packaged JSON must match its parsed result; the test enforces this.
`sourceLine` refers to the original Markdown line. It is evidence location, not
a permanent entity ID. Alias canonicalization applies only to the seven named
groups from V2.0, never to the 88 legacy component IDs.

For a Windows local browser preview, serve `.mjs` as JavaScript:

```powershell
python -c "import http.server; http.server.SimpleHTTPRequestHandler.extensions_map['.mjs']='text/javascript'; http.server.ThreadingHTTPServer(('127.0.0.1',8766),http.server.SimpleHTTPRequestHandler).serve_forever()"
```

Open `http://127.0.0.1:8766/knowledge-catalog/`. The browser regression is
`node scripts/test-v8-knowledge-browser.mjs`; if Playwright is outside the
project, point `V8_PLAYWRIGHT_MODULE` at that existing installation. Set
`V8_CATALOG_TEST_URL` for another local port or the deployed Pages directory.
Screenshots are optional through `V8_EVIDENCE_DIR`. No package installation is
performed by the test.

The legacy view API takes parsed static catalog JSON and explicit source
metadata. It copies and freezes the result, preserves unknown fields with
uninterpreted-field diagnostics, never changes either relation direction, and
never looks up resources by array position. Scene/template namespaces remain
separate even when IDs match. Raw string content is data, never executed.

Candidate groups use a provisional offline contract: `groupId`, `role`
(`IDENTITY`, `CONTENT_CONTRIBUTION` or `REFERENCE`), `cardinality`,
`reviewStatus: CANDIDATE`, `sourceSnapshot`, `evidence`, `sources` and `targets`.
References retain namespace, entity type and typed ID; targets also require a
version and a matching explicit declaration. A PASS means this provisional
consistency check passed. `verifiedMappingCount` remains zero in all results.
No Course, CourseUnit, ContentBlock, LearningProgress or KnowledgeProgress is
created. No candidate IDs are promoted to permanent model identities.

## Overall roadmap: actual state

| Overall phase | Actual state | Remaining work |
| --- | --- | --- |
| P1 repository/storage inventory | Static repository verified; P1.3 incomplete | Original computer record backup, actual IDs and record associations; no browser/profile accessed by these tools |
| P2 formal mapping | Source structure and candidate consistency tooling implemented | Frozen PRD/technical-design originals; target organization, ID/version rules, evidence-backed legacy-to-knowledge mappings and resource semantics |
| P3 compatibility | Offline immutable legacy view implemented | Approved target contract, production read authority/failure policy, tested integration and rollback; no production switch exists |
| P4 teaching standard sample | Button sample implemented and browser-tested in three layers | Formal target Course/Unit integration skipped while originals are missing |
| P5 domain pilot | One D01 knowledge sample exercised | Wider domain teaching and production compatibility are not claimed complete |
| P6 D01–D16 expansion | 840-entry directory imported and searchable | Full authored curriculum and verified links remain incomplete; directory entries are not completed lessons |
| P7 D17 | Candidate only | Official scope and knowledge IDs; no D17 formal IDs invented, G10 remains in D14 |
| P8 full acceptance/release | Foundation checks only | All content, compatibility, personal-record protection, backup, rollback and release gates; current static release is not P1–P8 completion |

## Missing inputs skipped by user instruction

The available V2.0 handoff quotes twelve frozen PRD decisions, but the actual
PRD V1.3 and P2.5 technical-design V1.0 originals have not been supplied or
located in the checked local document directories. The specified Codex chat
`01a1a04d-80c4-7b63-a725-0e73faf96216`, its local check package and its linked
planning chat `6ae95d0b-7534-83ec-8cf6-e19036738fc6` were also read. They expose
V0.1 and older P2 design drafts, but not the V1.3/P2.5 originals or a real P1.3
backup. PRD V0.1 is an unfrozen older draft and must not replace them.

The user has explicitly instructed that genuinely missing inputs be skipped.
Those work items are recorded as SKIPPED_MISSING_INPUT, rather than blocking
independent directory, teaching-sample and verification work. No substitute
original or personal backup is generated. Migration test T10 remains BLOCKED;
skipping its prerequisite is not an executed test or a migration permission.

Required unresolved inputs are: the original design documents; whether each
legacy Lesson maps to a Course, a CourseUnit or a grouped structure; stable
target IDs and content-version rules; authoritative 88-component-to-knowledge
mapping; the meaning of numeric `resourceId`; Scene/template correspondence;
and P1.3 backup coverage and real-record validation. The 13 D17 candidate
subdomains are not an approved final teaching catalog. Permission to work
continuously removes repeated phase approval, but cannot supply missing facts.

## Data protection and release boundary

The existing `app.js`, `data.json`, `styles.css`, `sw.js`, old labs,
QA directories, storage keys and default read/write behavior are unchanged.
`index.html` gains only a top-bar link to the new directory.
The new tools do not import application initialization scripts, open a browser,
read a user profile, execute a Demo or access localStorage/IndexedDB.
The original default completion markers are never interpreted as demonstrated
knowledge mastery. No double-write, user identity or replacement reading path
is introduced.

T01–T03 remain static-only PASS on the original catalog. T04–T09 and T11–T16
remain NOT_RUN; T10 and production migration remain BLOCKED. New preflight unit
tests do not change these migration-test states. Existing asymmetric relations
and resource warnings are retained for review.

Publishing this foundation makes the offline tools and original directory
assets available through the existing repository/Pages chain; it does not
activate a new production interface or migrate users. Any release identifier,
CI result and Pages deployment must be reported from actual remote evidence.
Rollback, if necessary, should use a scoped revert of this release after
checking later changes; never reset or clean user work, overwrite backups,
delete storage or restore an old snapshot over newer user data.
