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

## D01–D16 teaching batch 1

The authored catalog now has **17 teaching topics / 51 layered units**: the
original Button sample plus sixteen additional topics, one in each D01–D16
domain. `teaching-manifest.json` records their exact content hashes, unit levels,
difficulties and pinned content references. It is reproducible with
`scripts/build-v8-teaching-manifest.mjs`; it does not change the original
840-entry source catalog or invent formal migrated Course entities.

| Domain | New topic | Original knowledge ID |
| --- | --- | --- |
| D01 | Icon Button | K-D01-002 |
| D02 | Grid Layout | K-D02-004 |
| D03 | Tabs | K-D03-007 |
| D04 | Text Input | K-D04-001 |
| D05 | Table | K-D05-022 |
| D06 | Toast | K-D06-004 |
| D07 | Modal | K-D07-001 |
| D08 | File Picker | K-D08-001 |
| D09 | Bar Chart | K-D09-001 |
| D10 | Map Marker | K-D10-002 |
| D11 | Flowchart | K-D11-033 |
| D12 | Approval Flow | K-D12-006 |
| D13 | CRDT | K-D13-034 |
| D14 | Tool Call Card | K-D14-043 |
| D15 | Color Contrast | K-D15-021 |
| D16 | Undo / Redo | K-D16-059 |

Each new topic has three independently authored objectives, exercises,
acceptance conditions, pitfalls and summaries, plus shared/version-pinned
principle/mechanism blocks and a runnable code example. All sixteen code
examples execute against the actual teaching mechanisms during Node tests.
The directory adds an available-teaching filter, per-domain teaching counts
and search across the new objectives.

All 48 new units have topic-specific browser controls and negative cases.
Reusable experiment mechanisms serve the three levels; the teaching goals and
acceptance conditions differ. This is content reuse, not a claim that each
layer is a different production application. Code references link to the full
interaction implementation, with W3C/MDN/research references where applicable.

Boundary examples: the map is a coordinate sketch, not a tile or distance
service; CRDT replicas are simulated in one page; the tool card runs only an
allowlisted local sum, not a real model/MCP tool; approval roles are parameters,
not authenticated identities; file selection reads metadata only and never
reads file text or uploads data. These limits are visible in the lessons.
The contrast check concerns opaque six-digit sRGB colors and one text pair,
not whole-site WCAG compliance. No arbitrary code from user input is executed.

This is a verified authored batch across all sixteen domains, **not all 833
preliminary concepts or 840 directory entries completed as courses**. Remaining
curriculum and formal migration states are reported separately.

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
& $node22 scripts/test-v8-curriculum.mjs
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
| P4 teaching standard sample | 17 topics / 51 independent layered units with pinned content | Formal target Course/Unit integration skipped while originals are missing |
| P5 domain pilot | Representative teaching experiments in all sixteen domains | Entire domain curricula and production compatibility are not claimed complete |
| P6 D01–D16 expansion | Batch 1 adds 16 topics / 48 units to the searchable directory | Remaining concepts are not marked authored or accepted merely because their entries exist |
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
The offline foundation modules do not import application initialization scripts,
open a browser, read a user profile or access localStorage/IndexedDB. The separate
directory UI reads only its static catalog; its user-triggered teaching demos run
in memory. Browser verification runs in isolated synthetic contexts.
The original default completion markers are never interpreted as demonstrated
knowledge mastery. No double-write, user identity or replacement reading path
is introduced.

T01–T03 remain static-only PASS on the original catalog. T04–T09 and T11–T16
remain NOT_RUN; T10 and production migration remain BLOCKED. New preflight unit
tests do not change these migration-test states. Existing asymmetric relations
and resource warnings are retained for review.

Publishing this release exposes the directory, sample, offline tools and source
assets through the existing repository/Pages chain. It does not replace the
old course reading authority or migrate users. Any release identifier,
CI result and Pages deployment must be reported from actual remote evidence.
Rollback, if necessary, should use a scoped revert of this release after
checking later changes; never reset or clean user work, overwrite backups,
delete storage or restore an old snapshot over newer user data.
