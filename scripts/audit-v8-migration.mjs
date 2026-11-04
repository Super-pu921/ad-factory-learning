#!/usr/bin/env node
/** No writes. Prints exactly one UTF-8 JSON report to stdout. */
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {auditV8MigrationData} from './migration-audit-core.mjs';

const inputUrl = new URL('../data.json',import.meta.url);
let report;
try {
  const bytes = readFileSync(inputUrl);
  const data = JSON.parse(bytes.toString('utf8'));
  const result = auditV8MigrationData(data);
  report={...result,generatedAt:new Date().toISOString(),source:{
    path:'data.json',sha256:createHash('sha256').update(bytes).digest('hex'),
    knowledgeRevision:data?.meta?.knowledgeRevision??null,bytes:bytes.length
  }};
} catch (e) {
  report={schemaVersion:'1.0',tool:'v8-migration-static-readonly-audit',
    generatedAt:new Date().toISOString(),source:{path:'data.json',sha256:null},
    baseline:null,checks:[{id:'C00',status:'FAIL',message:'Cannot read/parse static data.json',errors:[e.message]}],
    warnings:[],testCases:Array.from({length:16},(_,i)=>({id:'T'+String(i+1).padStart(2,'0'),status:i===0?'FAIL':(i===1||i===2||i===9)?'BLOCKED':'NOT_RUN'})),
    migrationReadiness:{status:'BLOCKED',reasons:['Static source unavailable','P1.3 not verified','No migration engine or authorization']}
  };
  process.stderr.write(`Read-only audit error: ${e.message}\n`);
}
process.stdout.write(JSON.stringify(report,null,2)+'\n');
process.exitCode=report.checks.some(c=>c.status==='FAIL')?1:0;
