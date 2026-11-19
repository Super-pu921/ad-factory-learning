# V8 implementation and release status

Scope: V2.0 overall P1–P8 roadmap.

## Current teaching release

The [main component library](https://super-pu921.github.io/ad-factory-learning/index.html#/components)
lists the runnable teaching topics by D01–D16 domain and retains the original
88 demo entries. The main library and global search open the layered demos.
The P7 [legacy review](V8-LEGACY-COMPONENT-REVIEW.md) records source evidence
and unverified Knowledge candidates for the 88 originals. Formal mappings are
pending semantic and version review. D17 still has 13 candidate subdomains.

## Remaining 513 concepts accounted for

The registry now contains **821 canonical teaching topics / 2463 L1–L3 units**.
The unchanged 320-topic baseline is protected by per-topic content hashes.
This batch adds 501 runnable, bounded teaching mechanisms; 12 topics are
explicitly `SKIPPED_MISSING_INPUT`, with reasons and required inputs displayed
in the catalog and manifest. The 833 canonical concepts are fully accounted
for. See [the current per-ID inventory](V8-COMPONENTS-CURRENT.md).

New mechanisms include independently checked QR/Code39, restricted real
PDF/OOXML parsing, synthetic native media, opaque-origin arithmetic sandbox,
business invariants, collaboration transforms, native browser engineering
examples, accessibility semantics, Intl and scoped themes. A teaching demo is
not a production backend, arbitrary-code execution service or model inference.
The skips include missing payment/model/device contracts, three real network
transport endpoints and cross-engine Background Sync support.

Original data.json, courses, 88 legacy demos and business labs are retained.
Learning progress is not persisted or migrated by the catalog. A small set of
explicit-save demos use only their own synthetic topic sandbox keys; they do
not enumerate existing storage. Synthetic map cache uses its own cache name.
Production migration remains **BLOCKED**; formal migrated Course count is 0.

Local acceptance completed on Node 22: all 64 required syntax/regression
commands passed, including 501 executed new example snippets and negative
cases. The 501 additions completed 6012 directory interaction scenarios
(L1/L2/L3, Chromium/WebKit, 1440px/390px). Scoped revisions completed another
500 scenarios covering refresh persistence, media, overlays, CSV/mapping,
real map assets and plain-text paste protection. The unchanged old teaching
bank and workbench entry also passed browser regression. Deployment and live
acceptance are recorded separately; local PASS does not claim a release.

The sections below are historical delivery snapshots. Their counts and
memory-only statements describe those earlier batches, not the current total.

The user has authorized continuous development, verification and release without
repeated phase approvals. This replaces the former local-only/no-publish task
restriction. It does not make unverified mappings or personal-record migrations
safe to execute. Production migration remains **BLOCKED**.

## 320 runnable teaching components (2026-11-13)

The catalog now registers **320 unique canonical teaching components / 960
L1–L3 units**: the unchanged 65-topic baseline, 175 basic additions and 80
advanced additions. All retain the original knowledge IDs and source titles.
The complete per-ID inventory, domain totals, implementation locations and
layer links are in [V8-COMPONENTS-320.md](V8-COMPONENTS-320.md).

This is a bounded, interactive teaching implementation for each concept, not
320 new production backend services. A component is counted once per canonical
knowledge ID; its three units are not three components. The original 88 demo
Components remain intact and are not summed with the new registry because an
authoritative old-to-new mapping is still missing. The remaining 513 canonical
concepts are NOT_IMPLEMENTED, not silently marked complete.

The workbench prominently names the runnable component count and searches the
teaching manifest by title/knowledge ID alongside the separately labelled old
library. A selected teaching result opens its real L1 demo. A duplicate blur
change event no longer replaces the clicked result before navigation. Static
summary failures and delayed responses retain the original usable library.

The additions cover real DOM controls, CSS/container layouts, local navigation,
validated forms, immutable data-grid operations, finite feedback states, SVG
charts, coordinate/graph mechanisms and bounded engineering algorithms. Each
new topic has executable example code, a pinned expected output, a working
interactive mechanism, positive/negative cases and separate L1/L2/L3 goals,
exercises and acceptance conditions. Timers, event listeners and object URLs
are released when a unit is disposed. Export creates only fictional teaching
content in an in-memory Blob; no existing user file is read or overwritten.

Node checks and browser evidence are produced by the actual release run;
this source status does not substitute for successful execution. The existing
Node 22 CI now includes both new mechanism suites and the 320/960 manifest
checks. Browser suites separately exercise the 255 additions at all three
layers in Chromium/WebKit on desktop/390px, plus the original 65-topic checks.
Per-ID/level/browser results are retained externally as case-results.json.

PRD V1.3/P2.5 originals, P1.3 real-record evidence, production backend contracts,
authoritative old-component mappings and D17 approval remain missing or
unapproved. Their dependent implementation is SKIPPED_MISSING_INPUT, while
unimplemented algorithms such as QR/Barcode are simply NOT_IMPLEMENTED.
Production migration remains BLOCKED, formal migrated Courses remain zero,
and no new progress persistence or production reading switch is introduced.

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

Batch 1 delivered **17 teaching topics / 51 layered units**: the
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
The directory includes an available-teaching filter, per-domain teaching counts
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

## D01–D16 teaching batch 2 and unit navigation

Batch 2 adds **16 topics / 48 layered units**, bringing the authored directory
to **33 topics / 99 units**. Every domain now has at least two teaching topics;
D01 has three including the original Button pilot. The original 840 source
entries and 833 preliminary concepts are unchanged. The first 17 topics retain
their exact content versions and hashes. No remaining directory entry is marked
as authored merely because it appears in the directory.

| Domain | New topic | Original knowledge ID |
| --- | --- | --- |
| D01 | Link | K-D01-003 |
| D02 | Flex Layout | K-D02-003 |
| D03 | Pagination | K-D03-008 |
| D04 | Number Input | K-D04-003 |
| D05 | Statistic | K-D05-004 |
| D06 | Progress | K-D06-013 |
| D07 | Popover | K-D07-011 |
| D08 | JSON Editor | K-D08-045 |
| D09 | Line Chart | K-D09-005 |
| D10 | Layer Manager | K-D10-013 |
| D11 | Snap to Grid | K-D11-007 |
| D12 | Kanban Board | K-D12-001 |
| D13 | Typing Indicator | K-D13-009 |
| D14 | Conversation Branch | K-D14-007 |
| D15 | Number Formatting | K-D15-031 |
| D16 | Debounce | K-D16-004 |

Each topic has three independently authored objectives, exercises, acceptance
conditions, pitfalls and summaries, pinned shared blocks, an executable example
with expected output and a topic-specific interactive experiment. A shared
experiment serves its three different teaching goals. All 32 batch-topic code
examples execute in Node tests. Mechanism tests cover empty sets, invalid input,
unchanged source collections, integer decimal parsing, zero baselines, safe
navigation, text-only JSON previews and timer cancellation with a fake clock.

Links such as `#K-D03-008/L2` open the specified unit, survive refresh and can be
copied from each unit's share/review link. Old `#K-D03-008` links still open L1;
unknown levels fall back to L1. Changing levels updates the current address
without writing progress or adding an entry to browser history for every tab.
Both the original Button pilot and all batch topics use this navigation.

Batch 2 limits are visible in each experiment. The progress bar counts five
simulated steps, not saved learning progress. The popover is a bounded custom
nonmodal example, not a full positioning engine. JSON formatting is syntax-only
and reads no files, executes no code and imports no records. Line-chart points
use equal teaching intervals and make no predictions. Layers and snapping use
fictional coordinate sketches. The board has keyboard controls and adjacent
state transitions, without drag/drop or real tasks. Typing and branches use
local fictional messages without accounts, network sessions or AI calls.
Number formatting is limited to three locales and explicit decimal input;
debounce schedules only local filtering and does not claim request-race safety.

The browser regression exercises all **32 batch topics × 3 layers × 4 browser/
viewport combinations = 384 unit scenarios**, plus layer-link refresh/fallback,
the teaching-only filter, viewport limits and synthetic-storage preservation.
The original directory/Button browser regression remains separate. Browser
results are release evidence only when actually executed and recorded; the CI
workflow runs Node checks, not the browser suite.

## D01–D16 teaching batch 3 and independent teaching filters

Batch 3 adds **16 topics / 48 layered units**, bringing the directory to
**49 topics / 147 units**. Each D01–D16 domain now has at least three authored
topics; D01 also retains the original Button pilot. The previous 33 topics
retain their exact content versions and hashes. This is authored teaching
coverage, not a count of migrated Course entities or a completed full catalog.

| Domain | New topic | Original knowledge ID |
| --- | --- | --- |
| D01 | Badge | K-D01-013 |
| D02 | Aspect Ratio | K-D02-009 |
| D03 | Breadcrumb | K-D03-001 |
| D04 | Checkbox Group | K-D04-014 |
| D05 | Timeline | K-D05-006 |
| D06 | Retry Panel | K-D06-023 |
| D07 | Tooltip | K-D07-013 |
| D08 | CSV Import Preview | K-D08-055 |
| D09 | Donut Chart | K-D09-009 |
| D10 | GeoJSON Viewer | K-D10-017 |
| D11 | Zoom / Pan | K-D11-004 |
| D12 | Step Wizard | K-D12-008 |
| D13 | Comment Resolution | K-D13-017 |
| D14 | Structured Output | K-D14-013 |
| D15 | Reduced Motion | K-D15-015 |
| D16 | Request Cancellation | K-D16-006 |

The directory can filter by L1/L2/L3 and E1–E5 independently, together with
domain, text and available-teaching filters. Level and difficulty must match
the **same unit**; matching L1 in one unit and E2 in another is insufficient.
Selecting a filtered topic opens its first matching unit. Untaught entries
cannot match an authored teaching level or difficulty. No new filter or
learning state is persisted, and no new difficulty is inferred for original
directory entries. Original directory statuses remain source facts.
Filter input made while the static catalog is still loading is retained and
applied when loading completes; it does not attempt to render an absent source.

CSV preview reads only manually entered text and implements a bounded
two-column `id,qty` teaching contract with quoted commas/newlines, doubled
quotes, LF/CRLF, unique IDs and integer quantities. It imports nothing and
executes no spreadsheet formulas. GeoJSON preview supports only up to five
two-dimensional Point features in a FeatureCollection; it uses a coordinate
sketch without real tiles, files or map services. Neither is a universal
importer or complete format implementation.

Retry and cancellation use local timers. Busy attempts cannot duplicate,
retries are capped at five and pending work is cancelled on disposal. Cancelling
the local simulation does not promise server rollback. Tooltip document
listeners are removed when its unit is left. Reduced-motion behavior is scoped
to one experiment and respects system preference unless explicitly overridden
within that experiment; it does not change the OS or assert whole-site WCAG
compliance. The wizard previews a memory-only draft; comment resolution and
structured-output examples use fictional data without accounts, AI services,
production writes or progress associations.

The full authored batch browser suite now covers **48 topics × 3 layers × 4
browser/viewport contexts = 576 unit scenarios**, plus independent filter
intersections, empty results, filtered unit navigation, deep links and disposal.
The original directory/Button regression remains separate. Only recorded actual
executions establish PASS; neither this scope description nor CI's Node-only
checks establish browser or real-device acceptance on their own.

## D01–D16 teaching batch 4 and shareable filter state

Batch 4 adds **16 topics / 48 layered units**, bringing authored coverage to
**65 topics / 195 units**. Every domain has at least four teaching topics;
D01 also retains the original Button pilot. The previous 49 topic objects,
unit metadata, content hashes and versions are preserved.

| Domain | New topic | Original knowledge ID |
| --- | --- | --- |
| D01 | Rating | K-D01-017 |
| D02 | Box | K-D02-002 |
| D03 | Accordion | K-D03-018 |
| D04 | Radio Group | K-D04-016 |
| D05 | Comparison | K-D05-005 |
| D06 | Empty State | K-D06-009 |
| D07 | Focus Restoration | K-D07-030 |
| D08 | File Metadata | K-D08-017 |
| D09 | Scatter Plot | K-D09-010 |
| D10 | Feature Inspector | K-D10-018 |
| D11 | Multi Selection | K-D11-006 |
| D12 | Advanced Filter | K-D12-004 |
| D13 | Edit Lock | K-D13-029 |
| D14 | Prompt Variables | K-D14-012 |
| D15 | Date Formatting | K-D15-030 |
| D16 | Request Timeout | K-D16-016 |

All units keep independent objectives, exercises, three acceptance conditions,
pitfalls and summaries with pinned content references. The 64 batch-topic code
examples actually execute during Node tests. Reused experiments cover different
teaching goals without being presented as separate production applications.

The catalog now records directory filter state in its own URL using `domain`,
`q`, `level`, `difficulty` and `teaching` parameters. The current-filter link
can be copied/shared, refresh restores the conditions, and browser back/forward
restores same-document filter state. A reset action returns to the full
directory. Default and unsupported parameter values are omitted; search text is
bounded to 100 UTF-16 code units. Query strings remain inert text. Unit deep
links preserve the directory filters. This uses browser navigation state only;
no localStorage, IndexedDB, progress state or original-course reading path is
introduced. Ordinary changes replace the current history entry rather than
adding one per keystroke.

The new examples keep explicit limits: ratings are not mastery or real reviews;
the box calculation excludes margins; comparison reports separate fictional
price/time deltas without an overall purchase recommendation; metadata comes
from manually entered fictional fields and reads no file. The scatter plot
does not infer causality. Point inspection and object selection preserve source
identity/geometry. Advanced task filtering is local AND logic. Edit locks use a
manually advanced teaching clock and provide no distributed mutual exclusion
or real identity verification. Prompt variables perform one allowlisted text
replacement without recursion, code evaluation, model calls or a general prompt
injection defense. Date formatting uses strict canonical UTC input years
1900–2100 and explicit
display timezones without changing OS settings. Timeout uses cancellable local
timers and makes no claim of server-side rollback.

The authored batch browser suite covers **64 topics × 3 layers × 4 browser/
viewport contexts = 768 unit scenarios**, plus filter URL round trips,
refresh/back-forward/reset, malformed parameters, slow-load input, deep links,
keyboard focus and synthetic-storage preservation. The original directory and
Button suite remains separate. Only recorded actual checks establish PASS;
this static release does not complete the remaining curriculum, migration or
P1–P8 acceptance requirements.

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
| P4 teaching standard sample | Button pilot with three separately accepted layered units | Formal target Course/Unit integration awaits the source contracts |
| P5 domain pilot | Runnable samples shipped in all sixteen domains | Formal compatibility and migration gates remain separate |
| P6 D01–D16 expansion | 821 topics / 2463 units in the released component library | 12 concepts require the inputs listed in the teaching manifest |
| P7 D17 and legacy component review | 13 D17 candidates and a source-backed review of all 88 legacy components | D17 scope approval and formal legacy mapping review |
| P8 full acceptance and release | Teaching and workbench releases verified | Formal compatibility, personal-record evidence, backup and rollback gates remain open |

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

## Workbench directory entry and coverage clarification (2026-11-12)

The original component library still contains **88 working demo entries**.
The newer knowledge directory contains **840 source entries** (833 preliminary
concepts), with **65 authored teaching topics / 195 L1–L3 units** so far.
These measures overlap and must not be added together or reported as hundreds
of completed components. At that November 12 entry-only release, the goal of more than 300 usable
components had **not** been met; that release added no teaching topic or demo.
The later 320-component expansion is recorded separately above.

The workbench component landing page now shows a prominent directory card
with separate links to the full catalog and teaching-only results. Counts come
from the existing static teaching manifest, so future content releases do not
require a second hardcoded teaching total. If it cannot load, both links and
the original library still work, without displaying invented counts. An in-flight
response updates only the coverage text and never rerenders a user's current
page. The original library is explicitly labelled as 88 demos, and its search
continues to search that library. The global top-bar shortcut now includes
visible text, including on lesson detail pages.

Existing browser checks additionally exercise both new entry paths, original
search/category totals, mobile layout, a failed summary fetch and a delayed
response arriving across navigation. Tests use new isolated browser contexts;
no user profile, actual saved learning record or migration is involved.

## Data protection and release boundary

`data.json`, `sw.js`, old labs, QA directories, storage keys and default
read/write behavior are unchanged. The November 12 workbench update adds
visible directory/teaching links and reads the static teaching manifest for
coverage text and teaching-component search in `app.js`, with contained styles
and a labelled top-bar link.
It does not replace the original component list, search or course reading.
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
