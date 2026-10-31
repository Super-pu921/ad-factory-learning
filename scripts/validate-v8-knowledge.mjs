import fs from "node:fs";
import assert from "node:assert/strict";

const data = JSON.parse(fs.readFileSync(new URL("../data.json", import.meta.url), "utf8"));
const app = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
const ids = (items, key = "id") => new Set(items.map((x) => x[key]));
const lessonIds = ids(data.lessons);
const componentIds = ids(data.components);
const sceneIds = ids(data.scenes);
const sourceIds = ids(data.sources);
const unique = (items, key, label) => {
  const values = items.map((x) => x[key]);
  assert.equal(new Set(values).size, values.length, `${label} 存在重复 ID`);
};
unique(data.lessons, "id", "课程");
unique(data.components, "id", "组件");
unique(data.scenes, "id", "场景");
assert.equal(data.lessons.length, 90, "课程数量必须保持 90");
assert.equal(data.components.length, 88, "组件数量必须保持 88");
assert.equal(data.scenes.length, 6, "ERP 场景数量必须保持 6");
assert.equal(data.meta.isPreview, false, "正式数据不能标记为 preview");
assert.equal(data.components.filter((x) => x.knowledge).length, 88, "每个组件都必须有知识扩展");
assert.equal(data.lessons.filter((x) => Array.isArray(x.relatedComponents) && x.relatedComponents.length).length, 90, "每门课程都必须关联组件");
for (const component of data.components) {
  assert.ok(component.knowledge.behavior, `${component.id} 缺少行为机制`);
  for (const lessonId of component.relatedLessons || []) assert.ok(lessonIds.has(lessonId), `${component.id} 关联了不存在的课程 ${lessonId}`);
  for (const sceneId of component.relatedScenes || []) assert.ok(sceneIds.has(sceneId), `${component.id} 关联了不存在的场景 ${sceneId}`);
  for (const sourceId of component.referenceIds || []) assert.ok(sourceIds.has(sourceId), `${component.id} 引用了不存在的资料 ${sourceId}`);
}
for (const lesson of data.lessons) {
  for (const componentId of lesson.relatedComponents || []) assert.ok(componentIds.has(componentId), `课程 ${lesson.id} 关联了不存在的组件 ${componentId}`);
  for (const sceneId of lesson.relatedScenes || []) assert.ok(sceneIds.has(sceneId), `课程 ${lesson.id} 关联了不存在的场景 ${sceneId}`);
  for (const sourceId of lesson.referenceIds || []) assert.ok(sourceIds.has(sourceId), `课程 ${lesson.id} 引用了不存在的资料 ${sourceId}`);
  if (lesson.deepDive) {
    assert.ok(lesson.deepDive.principle, `课程 ${lesson.id} 缺少核心机制`);
    assert.ok(lesson.deepDive.practice, `课程 ${lesson.id} 缺少实操练习`);
    assert.ok(Array.isArray(lesson.deepDive.workflow), `课程 ${lesson.id} 缺少工作步骤`);
  }
}
for (const marker of ["knowledgeSourceLinks", "relatedComponentLinks", "relatedSceneLinks", "relatedLessonLinks", "深入拓展", "进阶知识"]) {
  assert.ok(app.includes(marker), `app.js 缺少扩展展示标记：${marker}`);
}
console.log(JSON.stringify({
  lessons: data.lessons.length,
  components: data.components.length,
  scenes: data.scenes.length,
  deepDiveLessons: data.lessons.filter((x) => x.deepDive).length,
  sources: data.sources.length,
  resources: data.resources.length,
  status: "knowledge data checks passed"
}, null, 2));
