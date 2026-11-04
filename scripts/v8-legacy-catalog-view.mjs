/** Offline legacy catalog view and candidate preflight. No I/O or migration. */
import {auditV8MigrationData} from './migration-audit-core.mjs';

const collections = ['lessons','components','scenes','phases','sources','templates'];
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string' && value.trim().length > 0;
const hex = (value, length) => typeof value === 'string' && new RegExp(`^[a-f0-9]{${length}}$`, 'i').test(value);
const identity = ref => JSON.stringify([ref.namespace,ref.entityType,ref.id]);
const fields = {
  root:['meta','lessons','components','scenes','phases','componentCategories','sources','resources','anti','templates'],
  meta:['version','fullLessonCount','fullComponentCount','fullSceneCount','fullStageCount','isPreview','knowledgeRevision','componentGuideCount','lessonRelationCount'],
  lessons:['id','phase','title','key','analogy','erp','pitfall','q','opts','a','why','steps','code','chapterNumber','keywords','resourceId','relatedComponents','relatedScenes','referenceIds','deepDive'],
  components:['id','category','name','en','alias','desc','analogy','erp','use','avoid','compare','demo','knowledge','relatedLessons','relatedScenes','referenceIds'],
  scenes:['id','title','desc','focus','tag','parts','why','accept'],
  phases:['id','name','desc','start','end'],
  sources:['id','name','url','role','version','checkedAt','reuse'],
  resources:['name','kind','desc','url','extra'],
  templates:['id','name','scene','parts','why','accept'],
  deepDive:['principle','workflow','practice','pitfalls','referenceIds'],
  knowledge:['behavior','states','keyboard','accessibility','responsive','testCases']
};

function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

// The input is a parsed JSON catalog, not an application state or browser profile.
function copyJson(value, ancestors = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (!value || typeof value !== 'object' || ancestors.has(value)) throw new TypeError('Catalog must contain finite, acyclic JSON values');
  if (!Array.isArray(value) && ![Object.prototype,null].includes(Object.getPrototypeOf(value))) throw new TypeError('Catalog must contain plain JSON objects');
  ancestors.add(value);
  const result = Array.isArray(value) ? [] : {};
  for (const key of Object.keys(value)) {
    // Define a data property so __proto__ remains data, never a prototype setter.
    Object.defineProperty(result,key,{value:copyJson(value[key],ancestors),enumerable:true,writable:true,configurable:true});
  }
  ancestors.delete(value);
  return result;
}

export function createLegacyCatalogView(data, source = {}) {
  const catalog = copyJson(data);
  const audit = auditV8MigrationData(catalog);
  const uninterpretedFields = [];
  const inspect = (value,known,path) => {
    if (record(value)) for (const key of Object.keys(value)) {
      if (!known.includes(key)) uninterpretedFields.push({path:[...path,key],status:'PRESERVED_UNINTERPRETED'});
    }
  };
  inspect(catalog,fields.root,[]);
  inspect(catalog?.meta,fields.meta,['meta']);
  for (const name of [...collections,'resources']) {
    if (!Array.isArray(catalog?.[name])) continue;
    catalog[name].forEach((row,index) => {
      inspect(row,fields[name],[name,index]);
      if (name === 'lessons') inspect(row?.deepDive,fields.deepDive,[name,index,'deepDive']);
      if (name === 'components') inspect(row?.knowledge,fields.knowledge,[name,index,'knowledge']);
    });
  }
  return freeze({
    kind:'LEGACY_CATALOG_VIEW',
    source:copyJson(source),
    catalog,
    audit,
    uninterpretedFields,
    migrationReadiness:{status:'BLOCKED',reasons:['Legacy view only; no verified target model or mappings','P1.3 real user records not verified','No migration or production read switch executed']}
  });
}

/** Strict namespace and ID lookup. Ambiguous or missing identities never resolve. */
export function findLegacyEntity(view, entityType, id) {
  if (!collections.includes(entityType)) return null;
  const rows = view?.catalog?.[entityType];
  if (!Array.isArray(rows)) return null;
  const matches = rows.filter(row => record(row) && row.id === id);
  return matches.length === 1 ? matches[0] : null;
}

/**
 * Candidate contract is deliberately offline and provisional, not LegacyIdMapping.
 * Targets are supplied explicitly; no IDs, versions, mappings or approvals are invented.
 */
export function preflightLegacyMappingCandidates(view, candidates = [], targets = []) {
  const diagnostics = [];
  const fail = (code,path) => diagnostics.push({code,path,status:'FAIL'});
  const blocked = (code,path) => diagnostics.push({code,path,status:'BLOCKED'});
  if (!record(view) || view.kind !== 'LEGACY_CATALOG_VIEW') fail('INVALID_VIEW','view');
  if (!Array.isArray(candidates)) fail('CANDIDATES_NOT_ARRAY','candidates');
  if (!Array.isArray(targets)) fail('TARGETS_NOT_ARRAY','targets');
  const source = view?.source;
  const sourceReady = record(source) && text(source.repository) && hex(source.commit,40) && hex(source.sha256,64);
  if (!sourceReady) blocked('SOURCE_PROVENANCE_INCOMPLETE','view.source');
  if (!Array.isArray(view?.audit?.checks) || !view.audit.checks.length ||
    view.audit.checks.some(check => !record(check) || check.status !== 'PASS')) blocked('SOURCE_CATALOG_INVALID','view.audit');
  const validRef = ref => record(ref) && text(ref.namespace) && text(ref.entityType) &&
    (text(ref.id) || Number.isInteger(ref.id));
  const targetCounts = new Map();
  for (const [index,target] of (Array.isArray(targets) ? targets : []).entries()) {
    if (!validRef(target) || !text(target.version)) { fail('INVALID_TARGET_DECLARATION',`targets[${index}]`); continue; }
    const key = identity(target);
    targetCounts.set(key,(targetCounts.get(key) || 0) + 1);
    if (targetCounts.get(key) > 1) fail('DUPLICATE_TARGET_IDENTITY',`targets[${index}]`);
  }
  const groups = new Set();
  const exclusiveSources = new Map();
  const exclusiveTargets = new Map();
  for (const [index,group] of (Array.isArray(candidates) ? candidates : []).entries()) {
    const path = `candidates[${index}]`;
    if (!record(group)) { fail('INVALID_GROUP',path); continue; }
    if (!text(group.groupId)) fail('MISSING_GROUP_ID',path);
    else if (groups.has(group.groupId)) fail('DUPLICATE_GROUP_ID',path);
    else groups.add(group.groupId);
    if (!['IDENTITY','CONTENT_CONTRIBUTION','REFERENCE'].includes(group.role)) fail('INVALID_GROUP_ROLE',path);
    if (group.reviewStatus !== 'CANDIDATE') fail('UNSUPPORTED_REVIEW_STATUS',path);
    if (!Array.isArray(group.evidence) || !group.evidence.length || !group.evidence.every(text)) blocked('MISSING_EVIDENCE',path);
    if (!record(group.sourceSnapshot) || !sourceReady ||
      group.sourceSnapshot.repository !== source.repository ||
      group.sourceSnapshot.commit !== source.commit || group.sourceSnapshot.sha256 !== source.sha256) blocked('SOURCE_SNAPSHOT_MISMATCH',path);
    const from = Array.isArray(group.sources) ? group.sources : [];
    const to = Array.isArray(group.targets) ? group.targets : [];
    if (!from.length || !to.length) fail('EMPTY_GROUP_MEMBERS',path);
    const cardinality = from.length === 1 && to.length === 1 ? '1:1' :
      from.length === 1 && to.length > 1 ? '1:N' : from.length > 1 && to.length === 1 ? 'N:1' : null;
    if (!cardinality || group.cardinality !== cardinality) fail('INVALID_CARDINALITY',path);
    const sourceKeys = new Set(), targetKeys = new Set();
    for (const [memberIndex,ref] of from.entries()) {
      const memberPath = `${path}.sources[${memberIndex}]`;
      if (!validRef(ref)) { fail('INVALID_SOURCE_REFERENCE',memberPath); continue; }
      const key = identity(ref);
      if (sourceKeys.has(key)) fail('DUPLICATE_SOURCE_MEMBER',memberPath);
      sourceKeys.add(key);
      if (ref.namespace !== 'legacy' || !findLegacyEntity(view,ref.entityType,ref.id)) fail('UNRESOLVED_SOURCE',memberPath);
      if (group.role === 'IDENTITY') {
        if (exclusiveSources.has(key)) fail('CONFLICTING_SOURCE_IDENTITY',memberPath);
        else exclusiveSources.set(key,group.groupId);
      }
    }
    for (const [memberIndex,ref] of to.entries()) {
      const memberPath = `${path}.targets[${memberIndex}]`;
      if (!validRef(ref) || !text(ref.version)) { blocked('UNRESOLVED_TARGET',memberPath); continue; }
      const key = identity(ref);
      if (targetKeys.has(key)) fail('DUPLICATE_TARGET_MEMBER',memberPath);
      targetKeys.add(key);
      if (targetCounts.get(key) !== 1 || !targets.some(target => validRef(target) && identity(target) === key && target.version === ref.version)) blocked('UNRESOLVED_TARGET',memberPath);
      if (group.role === 'IDENTITY') {
        if (exclusiveTargets.has(key)) fail('CONFLICTING_TARGET_IDENTITY',memberPath);
        else exclusiveTargets.set(key,group.groupId);
      }
    }
  }
  return freeze({
    scope:'OFFLINE_CANDIDATE_PREFLIGHT',
    status:diagnostics.some(item => item.status === 'FAIL') ? 'FAIL' : diagnostics.length ? 'BLOCKED' : 'PASS',
    diagnostics,
    candidateCount:Array.isArray(candidates) ? candidates.length : 0,
    verifiedMappingCount:0,
    migrationReadiness:{status:'BLOCKED',reasons:['Candidate consistency is not formal mapping verification','P1.3 real user records not verified','No migration engine or production read switch']}
  });
}
