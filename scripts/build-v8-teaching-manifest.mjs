import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {buttonPilot} from '../knowledge-catalog/button-pilot.mjs';
import {curriculum} from '../knowledge-catalog/curriculum.mjs';

export function buildTeachingManifest() {
  const lessons=[buttonPilot,...curriculum];
  const topics=lessons.map(lesson=>({knowledgeId:lesson.knowledgeId,domain:lesson.knowledgeId.slice(2,5),title:lesson.title,version:lesson.version,
    contentSha256:createHash('sha256').update(JSON.stringify(lesson)).digest('hex'),
    units:lesson.units.map(unit=>({id:unit.id,level:unit.level,difficulty:unit.difficulty,title:unit.title,blockRefs:unit.blockRefs}))}));
  return {schemaVersion:'1.0',scope:'INDEPENDENT_TEACHING_CONTENT',statistics:{originalDirectoryEntries:840,teachingTopics:topics.length,layeredUnits:topics.reduce((sum,topic)=>sum+topic.units.length,0),coveredDomains:new Set(topics.map(topic=>topic.domain)).size,formalMigratedCourses:0},
    domains:Array.from({length:16},(_,i)=>{const id=`D${String(i+1).padStart(2,'0')}`;return {id,teachingTopics:topics.filter(topic=>topic.domain===id).length};}),topics,
    productionMigration:'BLOCKED',progressPersistence:'NONE',missingOriginals:'SKIPPED_MISSING_INPUT'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)process.stdout.write(JSON.stringify(buildTeachingManifest(),null,2)+'\n');
