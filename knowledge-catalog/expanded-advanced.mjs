/** Local, deterministic teaching mechanisms. No network, storage, file or account access. */
const clone = value => JSON.parse(JSON.stringify(value));
const fail = message => { throw new Error(message); };
const num = (value, name = '数值') => typeof value === 'number' && Number.isFinite(value) ? value : fail(`${name}须为有限数字`);
const positive = value => num(value) > 0 ? value : fail('数值须大于零');
const integer = value => Number.isInteger(num(value)) && value >= 0 ? value : fail('须为非负整数');
const list = value => Array.isArray(value) && value.length > 0 && value.length <= 200 ? value : fail('数组须含1–200项');
const numbers = value => list(value).map(item => num(item));
const nonnegative = value => numbers(value).map(item => item >= 0 ? item : fail('数据须非负'));
const point = value => Array.isArray(value) && value.length === 2 ? value.map(item => num(item)) : fail('坐标须为[x,y]');
const points = value => list(value).map(point);
const sum = value => value.reduce((a, b) => a + b, 0);
const round = value => Math.round(value * 1000) / 1000 || 0;
const range = count => Array.from({ length: count }, (_, i) => i);
const unique = value => [...new Set(value)];
const string = value => typeof value === 'string' ? value : fail('须为文字');
const rows = value => list(value).map(row => row && typeof row === 'object' && !Array.isArray(row) ? row : fail('须为对象行'));
const inside = (p, box) => p[0] >= box[0] && p[0] <= box[2] && p[1] >= box[1] && p[1] <= box[3];
const box = value => Array.isArray(value) && value.length === 4 && value.every(v => Number.isFinite(v)) && value[0] <= value[2] && value[1] <= value[3] ? value : fail('边界须为[minX,minY,maxX,maxY]');
const colors = ['#2563eb', '#ea580c', '#059669', '#9333ea', '#be123c', '#0e7490'];
function quantile(sorted, q) { const p = (sorted.length - 1) * q, i = Math.floor(p); return sorted[i] + (sorted[Math.min(i + 1, sorted.length - 1)] - sorted[i]) * (p - i); }
function graph(input) {
  const nodes = list(input.nodes).map(string), edges = list(input.edges).map(edge => { if (!Array.isArray(edge) || edge.length !== 2 || !edge.every(id => nodes.includes(id))) fail('连线端点必须存在'); return edge; });
  if (unique(nodes).length !== nodes.length) fail('节点ID重复');
  return { nodes, edges };
}
function topo(nodes, edges) {
  const order = [], indegree = new Map(nodes.map(n => [n, edges.filter(e => e[1] === n).length])), queue = nodes.filter(n => !indegree.get(n));
  while (queue.length) { const n = queue.shift(); order.push(n); for (const [, to] of edges.filter(e => e[0] === n)) { indegree.set(to, indegree.get(to) - 1); if (!indegree.get(to)) queue.push(to); } }
  return { order, cyclic: order.length !== nodes.length };
}
const models = {
  'stacked-bar': i => { const a = nonnegative(i.a), b = nonnegative(i.b); if (a.length !== b.length) fail('系列长度须一致'); return { segments: a.map((v, n) => [v, b[n]]), totals: a.map((v, n) => v + b[n]) }; },
  'horizontal-bar': i => { const values = nonnegative(i.values); return { bars: values.map((value, index) => ({ id: index + 1, value })).sort((a, b) => b.value - a.value) }; },
  'grouped-bar': i => { const a = nonnegative(i.a), b = nonnegative(i.b); if (a.length !== b.length) fail('系列长度须一致'); return { groups: a.map((v, n) => [v, b[n]]), maximum: Math.max(...a, ...b) }; },
  'area': i => { const values = nonnegative(i.values); return { points: values.map((v, n) => [n, v]), baseline: 0, trapezoidArea: round(values.slice(1).reduce((t, v, n) => t + (v + values[n]) / 2, 0)) }; },
  'stacked-area': i => { const a = nonnegative(i.a), b = nonnegative(i.b); if (a.length !== b.length) fail('系列长度须一致'); return { lower: a.map((v, n) => [n, v]), upper: a.map((v, n) => [n, v + b[n]]), total: sum(a) + sum(b) }; },
  'pie': i => { const values = nonnegative(i.values), total = positive(sum(values)); let angle = 0; return { total, sectors: values.map(value => { const start = angle; angle += value / total * 360; return { value, start: round(start), end: round(angle), share: round(value / total) }; }) }; },
  'bubble': i => ({ bubbles: rows(i.rows).map(r => ({ x: num(r.x), y: num(r.y), value: positive(r.value), radius: round(Math.sqrt(r.value) * 4) })) }),
  'radar': i => { const values = nonnegative(i.values), max = positive(i.maximum); if (values.length < 3 || values.some(v => v > max)) fail('至少三维且不能超过上限'); return { vertices: values.map((v, n) => [round(Math.sin(n / values.length * Math.PI * 2) * v / max), round(-Math.cos(n / values.length * Math.PI * 2) * v / max)]), values }; },
  'heatmap': i => { const matrix = list(i.matrix).map(nonnegative); if (matrix.some(r => r.length !== matrix[0].length)) fail('矩阵须等宽'); const maximum = Math.max(...matrix.flat(), 1); return { matrix, intensities: matrix.map(r => r.map(v => round(v / maximum))) }; },
  'histogram': i => { const values = numbers(i.values), width = positive(i.width); if (values.some(v => v < 0)) fail('此样例仅接受非负样本'); const count = Math.floor(Math.max(...values) / width) + 1; if (count > 100) fail('桶数最多100'); const bins = range(count).map(n => ({ from: n * width, to: (n + 1) * width, count: 0 })); values.forEach(v => bins[Math.floor(v / width)].count++); return { bins, count: values.length }; },
  'boxplot': i => { const sorted = numbers(i.values).sort((a, b) => a - b), q1 = quantile(sorted, .25), median = quantile(sorted, .5), q3 = quantile(sorted, .75), spread = q3 - q1, kept = sorted.filter(v => v >= q1 - 1.5 * spread && v <= q3 + 1.5 * spread); return { q1, median, q3, low: kept[0], high: kept.at(-1), outliers: sorted.filter(v => !kept.includes(v)) }; },
  'treemap': i => { const groups = rows(i.groups).map(g => ({ name: string(g.name), values: nonnegative(g.values) })), total = positive(sum(groups.flatMap(g => g.values))); let x = 0; return { total, rectangles: groups.flatMap(g => { const groupTotal = positive(sum(g.values)), width = groupTotal / total, left = x; x += width; let y = 0; return g.values.map((v, n) => { const top = y; y += v / groupTotal; return { group: g.name, leaf: n + 1, value: v, x: round(left), y: round(top), width: round(width), height: round(v / groupTotal) }; }); }) }; },
  'funnel': i => { const values = nonnegative(i.values); if (!values[0] || values.some((v, n) => n && v > values[n - 1])) fail('阶段数量须逐步不增'); return { stages: values.map((v, n) => ({ value: v, conversion: round(n ? v / (values[n - 1] || 1) : 1), retained: round(v / values[0]) })) }; },
  'gauge': i => { const value = num(i.value), target = positive(i.target); if (value < 0 || value > target) fail('指标须在0与目标之间'); return { value, target, ratio: round(value / target), angle: round(-90 + value / target * 180), reached: value >= target }; },
  'waterfall': i => { let running = num(i.start); const bars = numbers(i.changes).map(change => { const start = running; running += change; return { start, end: running, change }; }); return { initial: i.start, bars, final: running }; },
  'candlestick': i => ({ candles: rows(i.rows).map(r => { const open = num(r.open), high = num(r.high), low = num(r.low), close = num(r.close); if (low > Math.min(open, close) || high < Math.max(open, close)) fail('最低最高须包住开收值'); return { open, high, low, close, direction: close >= open ? '上涨' : '下跌' }; }) }),
  'calendar': i => { const days = rows(i.days).map(r => ({ day: integer(r.day), value: num(r.value) })); if (days.some(r => r.day < 1 || r.day > 28 || r.value < 0) || unique(days.map(r => r.day)).length !== days.length) fail('日期须为1–28且不可重复'); return { cells: range(28).map(n => ({ day: n + 1, column: n % 7, row: Math.floor(n / 7), value: days.find(d => d.day === n + 1)?.value ?? 0 })) }; },
  'bullet': i => { const actual = num(i.actual), target = positive(i.target), maximum = positive(i.maximum); if (actual < 0 || actual > maximum || target > maximum) fail('实际和目标须在量程内'); return { actual, target, maximum, ratio: round(actual / maximum), gap: actual - target }; },
  'sparkline': i => { const values = numbers(i.values); return { points: values.map((v, n) => [n, v]), min: Math.min(...values), max: Math.max(...values), change: values.at(-1) - values[0] }; },
  'error-bar': i => ({ intervals: rows(i.rows).map(r => ({ value: num(r.value), low: num(r.value) - Math.abs(num(r.error)), high: r.value + Math.abs(r.error) })) }),
  'polar': i => ({ points: rows(i.rows).map(r => { const angle = num(r.angle), radius = positive(r.radius); return { angle, radius, x: round(Math.cos(angle * Math.PI / 180) * radius), y: round(Math.sin(angle * Math.PI / 180) * radius) }; }) }),
  'range': i => ({ intervals: rows(i.rows).map(r => { const low = num(r.low), high = num(r.high); if (low > high) fail('下限不得大于上限'); return { low, high, midpoint: (low + high) / 2 }; }) }),
  'legend': i => { const a = nonnegative(i.a), b = nonnegative(i.b); if (a.length !== b.length || typeof i.showA !== 'boolean' || typeof i.showB !== 'boolean') fail('系列长度与开关无效'); return { visible: [i.showA ? 'A' : null, i.showB ? 'B' : null].filter(Boolean), series: [i.showA ? a : null, i.showB ? b : null].filter(Boolean), sourceCount: a.length + b.length }; },
  'axis': i => { const min = num(i.minimum), max = num(i.maximum), steps = positive(integer(i.steps)); if (max <= min || steps > 20) fail('范围或刻度数无效'); return { ticks: range(steps + 1).map(n => round(min + (max - min) * n / steps)), positions: numbers(i.values).map(v => round((v - min) / (max - min))), minimum: min, maximum: max }; },
  'data-zoom': i => { const values = numbers(i.values), start = integer(i.start), end = integer(i.end); if (start > end || end >= values.length) fail('缩放索引超界'); return { start, end, visible: values.slice(start, end + 1).map((v, n) => [n + start, v]), sourceCount: values.length }; },
  'map-view': i => { const center = point(i.center), scale = positive(i.scale); return { center, scale, points: points(i.points).map(p => [round((p[0] - center[0]) * scale + 180), round(100 - (p[1] - center[1]) * scale)]) }; },
  'clustering': i => { const input = points(i.points), cell = positive(i.cell), groups = new Map(); input.forEach(p => { const key = `${Math.floor(p[0] / cell)},${Math.floor(p[1] / cell)}`; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(p); }); return { clusters: [...groups].map(([key, ps]) => ({ key, count: ps.length, center: [round(sum(ps.map(p => p[0])) / ps.length), round(sum(ps.map(p => p[1])) / ps.length)] })), sourceCount: input.length }; },
  'map-expression': i => { const threshold = num(i.threshold); return { features: rows(i.features).map(r => ({ id: string(r.id), value: num(r.value), color: r.value >= threshold ? '#be123c' : '#2563eb' })), threshold }; },
  'route': i => { const input = points(i.points); if (input.length < 2) fail('路线至少两个点'); return { points: input, lengths: input.slice(1).map((p, n) => round(Math.hypot(p[0] - input[n][0], p[1] - input[n][1]))), start: input[0], end: input.at(-1) }; },
  'route-edit': i => { const input = points(i.points), index = integer(i.index), replacement = point(i.replacement); if (index >= input.length) fail('节点索引超界'); const next = input.map((p, n) => n === index ? replacement : p); return { before: input, points: next, changedIndex: index, length: round(sum(next.slice(1).map((p, n) => Math.hypot(p[0] - next[n][0], p[1] - next[n][1])))) }; },
  'geofence': i => { const boundary = box(i.boundary), path = points(i.path); let previous = false; return { boundary, path, events: path.map((p, n) => { const current = inside(p, boundary), event = current === previous ? '保持' : current ? '进入' : '离开'; previous = current; return { step: n, inside: current, event }; }) }; },
  'choropleth': i => { const cuts = numbers(i.cuts); if (cuts.some((v, n) => n && v <= cuts[n - 1]) || cuts.length > 5) fail('阈值须递增且最多5项'); return { regions: rows(i.regions).map(r => ({ id: string(r.id), value: num(r.value), band: cuts.filter(c => r.value >= c).length })), cuts }; },
  'measurement': i => { const ps = points(i.points); if (ps.length < 3) fail('多边形至少三个点'); return { points: ps, area: round(Math.abs(sum(ps.map((p, n) => p[0] * ps[(n + 1) % ps.length][1] - p[1] * ps[(n + 1) % ps.length][0]))) / 2), perimeter: round(sum(ps.map((p, n) => Math.hypot(p[0] - ps[(n + 1) % ps.length][0], p[1] - ps[(n + 1) % ps.length][1])))) }; },
  'spatial-query': i => { const boundary = box(i.boundary), ps = points(i.points); return { boundary, points: ps, matches: ps.map((p, n) => inside(p, boundary) ? n : null).filter(n => n !== null) }; },
  'camera': i => { const bounds = box(i.bounds), width = positive(i.width), height = positive(i.height), padding = num(i.padding); if (padding < 0 || padding * 2 >= Math.min(width, height) || bounds[0] === bounds[2] || bounds[1] === bounds[3]) fail('边界或内边距无效'); return { center: [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2], scale: round(Math.min((width - 2 * padding) / (bounds[2] - bounds[0]), (height - 2 * padding) / (bounds[3] - bounds[1]))), bounds, width, height, padding }; },
  'selection': i => { const boundary = box(i.boundary); return { boundary, shapes: rows(i.shapes).map(r => ({ id: string(r.id), bounds: box(r.bounds) })), selected: i.shapes.filter(r => r.bounds[0] >= boundary[0] && r.bounds[1] >= boundary[1] && r.bounds[2] <= boundary[2] && r.bounds[3] <= boundary[3]).map(r => r.id) }; },
  'alignment': i => { const moving = point(i.moving), guides = numbers(i.guides), tolerance = num(i.tolerance); if (tolerance < 0) fail('容差须非负'); const nearest = [...guides].sort((a, b) => Math.abs(a - moving[0]) - Math.abs(b - moving[0]))[0], snapped = Math.abs(nearest - moving[0]) <= tolerance; return { before: moving, point: [snapped ? nearest : moving[0], moving[1]], guide: snapped ? nearest : null }; },
  'ruler': i => { const origin = num(i.origin), scale = positive(i.scale), step = positive(i.step), count = integer(i.count); if (count > 20) fail('刻度最多20'); return { ticks: range(count + 1).map(n => ({ world: origin + n * step, pixel: n * step * scale })), scale }; },
  'clipboard': i => { const shapes = rows(i.shapes), offset = point(i.offset); if (unique(shapes.map(s => string(s.id))).length !== shapes.length) fail('ID须唯一'); const used = new Set(shapes.map(s => s.id)); const copies = shapes.map(s => { let id = `${s.id}-copy`; while (used.has(id)) id += '-copy'; used.add(id); return { id, x: num(s.x) + offset[0], y: num(s.y) + offset[1] }; }); return { originals: shapes, copies }; },
  'canvas-history': i => { const initial = num(i.initial), undo = [], redo = []; let value = initial; const trace = rows(i.actions).map(a => { if (a.type === 'move') { undo.push(value); value += num(a.by); redo.length = 0; } else if (a.type === 'undo') { if (undo.length) { redo.push(value); value = undo.pop(); } } else if (a.type === 'redo') { if (redo.length) { undo.push(value); value = redo.pop(); } } else fail('未知历史操作'); return value; }); return { value, trace, undoCount: undo.length, redoCount: redo.length }; },
  'shape-editor': i => { const x = num(i.x), y = num(i.y), width = positive(i.width), height = positive(i.height), rotation = num(i.rotation); return { x, y, width, height, rotation, area: width * height, center: [x + width / 2, y + height / 2] }; },
  'connector': i => { const from = box(i.from), to = box(i.to); return { from, to, points: [[from[2], (from[1] + from[3]) / 2], [to[0], (to[1] + to[3]) / 2]] }; },
  'resizer': i => { const requested = point(i.requested), minimum = point(i.minimum), maximum = point(i.maximum); if (minimum.some((v, n) => v <= 0 || v > maximum[n])) fail('尺寸限制无效'); return { requested, size: requested.map((v, n) => Math.max(minimum[n], Math.min(maximum[n], v))), minimum, maximum }; },
  'grouping': i => { const offset = point(i.offset), children = rows(i.children).map(r => ({ id: string(r.id), x: num(r.x), y: num(r.y) })); return { offset, local: children, world: children.map(r => ({ id: r.id, x: r.x + offset[0], y: r.y + offset[1] })) }; },
  'node-validation': i => { const allowed = { source: ['out'], processor: ['in', 'out'], sink: ['in'] }; return { nodes: rows(i.nodes).map(r => { const validType = Object.hasOwn(allowed, r.type), ports = list(r.ports).map(string); return { id: string(r.id), type: string(r.type), ports, valid: validType && ports.every(p => allowed[r.type].includes(p)) && unique(ports).length === ports.length }; }) }; },
  'edge-validation': i => { const g = graph(i); return { ...g, ...topo(g.nodes, g.edges), selfLoops: g.edges.filter(e => e[0] === e[1]).length, duplicateEdges: g.edges.length - unique(g.edges.map(e => e.join(':'))).length }; },
  'auto-layout': i => { const g = graph(i), result = topo(g.nodes, g.edges), gap = positive(i.gap); if (result.cyclic) fail('自动布局仅接受DAG'); const levels = new Map(); result.order.forEach(n => levels.set(n, Math.max(0, ...g.edges.filter(e => e[1] === n).map(e => levels.get(e[0]) + 1)))); const counts = new Map(); return { ...g, positions: result.order.map(id => { const depth = levels.get(id), row = counts.get(depth) || 0; counts.set(depth, row + 1); return { id, x: depth * gap, y: row * gap }; }) }; },
  'routing': i => { const from = point(i.from), to = point(i.to), via = num(i.via); return { points: [from, [via, from[1]], [via, to[1]], to], length: Math.abs(via - from[0]) + Math.abs(to[1] - from[1]) + Math.abs(to[0] - via) }; },
  'serialization': i => { const nodes = rows(i.nodes).map(r => ({ id: string(r.id), x: num(r.x), y: num(r.y) })); if (unique(nodes.map(n => n.id)).length !== nodes.length) fail('节点ID重复'); const json = JSON.stringify({ version: 1, nodes }); return { json, restored: JSON.parse(json).nodes, same: JSON.stringify(nodes) === JSON.stringify(JSON.parse(json).nodes) }; },
  'dependency': i => { const g = graph(i); return { ...g, ...topo(g.nodes, g.edges) }; },
  'throttle': i => { const times = nonnegative(i.times), interval = positive(i.interval); if (times.some((t, n) => n && t < times[n - 1])) fail('事件时间须有序'); let last = -Infinity; return { accepted: times.filter(t => { if (t - last < interval) return false; last = t; return true; }), interval }; },
  'cache': i => { const ttl = positive(i.ttl), now = num(i.now), entries = rows(i.entries).map(r => ({ key: string(r.key), value: r.value, expires: num(r.at) + ttl })); return { entries: entries.map(r => ({ ...r, fresh: now < r.expires })), readable: entries.filter(r => now < r.expires).map(r => r.key) }; },
  'invalidation': i => { const tag = string(i.tag), entries = rows(i.entries).map(r => ({ key: string(r.key), tags: list(r.tags).map(string) })); return { invalidated: entries.filter(r => r.tags.includes(tag)).map(r => r.key), remaining: entries.filter(r => !r.tags.includes(tag)).map(r => r.key) }; },
  'cache-key': i => { const resource = string(i.resource), params = i.params; if (!params || Array.isArray(params) || typeof params !== 'object' || Object.values(params).some(v => !['string', 'number', 'boolean'].includes(typeof v))) fail('参数须为标量对象'); return { key: `${encodeURIComponent(resource)}?${Object.keys(params).sort().map(k => `${encodeURIComponent(k)}=${encodeURIComponent(String(params[k]))}`).join('&')}` }; },
  'normalization': i => { const entities = {}, ids = []; rows(i.rows).forEach(r => { const id = string(r.id); if (Object.hasOwn(entities, id) || ['__proto__', 'constructor', 'prototype'].includes(id)) fail('重复或保留ID'); ids.push(id); entities[id] = { ...r }; }); return { ids, entities }; },
  'eviction': i => { const capacity = positive(integer(i.capacity)); if (capacity > 20) fail('容量最多20'); const cache = new Map(), evicted = []; list(i.accesses).map(string).forEach(key => { cache.delete(key); cache.set(key, true); if (cache.size > capacity) { const oldest = cache.keys().next().value; cache.delete(oldest); evicted.push(oldest); } }); return { oldestToNewest: [...cache.keys()], evicted }; },
  'backoff': i => { const base = positive(i.base), cap = positive(i.cap), attempts = integer(i.attempts); if (attempts > 20 || cap < base) fail('次数或上限无效'); return { delays: range(attempts).map(n => Math.min(cap, base * 2 ** n)), total: sum(range(attempts).map(n => Math.min(cap, base * 2 ** n))) }; },
  'idempotency': i => { const seen = new Set(), ledger = [], trace = []; rows(i.requests).forEach(r => { const key = string(r.key), amount = num(r.amount), duplicate = seen.has(key); trace.push({ key, amount, duplicate }); if (!duplicate) { seen.add(key); ledger.push({ key, amount }); } }); return { executions: ledger.length, total: sum(ledger.map(r => r.amount)), ledger, trace }; },
  'transaction': i => { const balance = num(i.balance), changes = numbers(i.changes); let working = balance; const trace = []; for (const c of changes) { working += c; trace.push(working); if (working < 0) return { committed: false, balance, attempted: trace }; } return { committed: true, balance: working, attempted: trace }; },
  'partial-failure': i => { const values = numbers(i.values), divisor = num(i.divisor); return { results: values.map((v, index) => divisor === 0 || v < 0 ? { index, status: '失败', reason: divisor === 0 ? '除数为零' : '样例不接受负数' } : { index, status: '成功', value: v / divisor }) }; },
  'optimistic-lock': i => { let value = string(i.initial), version = integer(i.version); const writes = rows(i.writes).map(r => { const accepted = integer(r.version) === version; if (accepted) { value = string(r.value); version++; } return { expected: r.version, accepted, version }; }); return { value, version, writes }; },
  'last-write': i => { const writes = rows(i.writes).map(r => ({ actor: string(r.actor), time: num(r.time), value: string(r.value) })); writes.sort((a, b) => a.time - b.time || (a.actor < b.actor ? -1 : a.actor > b.actor ? 1 : 0)); return { winner: writes.at(-1), discarded: writes.slice(0, -1) }; },
  'merge': i => { const base = i.base, local = i.local, remote = i.remote; if (![base, local, remote].every(v => v && typeof v === 'object' && !Array.isArray(v))) fail('合并输入须为对象'); const merged = {}, conflicts = []; unique([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)]).forEach(k => { if (['__proto__', 'constructor', 'prototype'].includes(k)) fail('保留键'); const b = JSON.stringify(base[k]), l = JSON.stringify(local[k]), r = JSON.stringify(remote[k]); if (l === r || r === b) merged[k] = local[k]; else if (l === b) merged[k] = remote[k]; else conflicts.push(k); }); return { merged, conflicts }; },
  'event-sourcing': i => { let balance = num(i.initial); const events = rows(i.events).map(r => { const amount = positive(r.amount); if (!['deposit', 'withdraw'].includes(r.type)) fail('未知事件'); balance += r.type === 'deposit' ? amount : -amount; return { type: r.type, amount, balance }; }); return { balance, events }; },
  'reconciliation': i => { const left = rows(i.left), right = rows(i.right); [left, right].forEach(rs => { if (unique(rs.map(r => string(r.id))).length !== rs.length) fail('重复ID'); rs.forEach(r => num(r.amount)); }); return { differences: unique([...left, ...right].map(r => r.id)).flatMap(id => { const a = left.find(r => r.id === id), b = right.find(r => r.id === id); return a?.amount === b?.amount ? [] : [{ id, left: a?.amount ?? null, right: b?.amount ?? null, delta: (a?.amount || 0) - (b?.amount || 0) }]; }) }; },
  'state-machine': i => { let state = 'idle'; const transitions = { idle: { start: 'running' }, running: { pause: 'paused', finish: 'done' }, paused: { resume: 'running' }, done: {} }; const trace = list(i.events).map(string).map(event => { const next = transitions[state][event]; const accepted = Boolean(next); if (accepted) state = next; return { event, accepted, state }; }); return { state, trace }; },
  'transition-validation': i => { const transitions = { draft: ['submit'], submitted: ['approve', 'reject'], approved: [], rejected: ['revise'] }, targets = { submit: 'submitted', approve: 'approved', reject: 'rejected', revise: 'draft' }; let state = string(i.initial); if (!Object.hasOwn(transitions, state)) fail('未知初态'); return { trace: list(i.events).map(string).map(event => { const before = state, accepted = transitions[state].includes(event); if (accepted) state = targets[event]; return { before, event, accepted, after: state }; }), get state() { return state; } }; },
  'dirty-form': i => { const initial = i.initial, current = i.current; if (![initial, current].every(v => v && typeof v === 'object' && !Array.isArray(v))) fail('表单须为对象'); const changed = unique([...Object.keys(initial), ...Object.keys(current)]).filter(k => JSON.stringify(initial[k]) !== JSON.stringify(current[k])); return { dirty: changed.length > 0, changed, canLeaveWithoutWarning: changed.length === 0 }; },
  'command': i => { let position = num(i.initial); const executed = [], trace = rows(i.commands).map(c => { if (c.type === 'move') { const by = num(c.by); position += by; executed.push(by); } else if (c.type === 'undo') { if (executed.length) position -= executed.pop(); } else fail('未知命令'); return position; }); return { position, trace, undoable: executed.length }; },
  'batch': i => { const size = positive(integer(i.size)), values = numbers(i.values); if (size > 100) fail('批量最多100'); return { batches: range(Math.ceil(values.length / size)).map(n => values.slice(n * size, (n + 1) * size)), total: sum(values) }; },
  'bulk-recovery': i => { const previous = rows(i.previous).map(r => { if (!['success', 'failed'].includes(r.status)) fail('无效状态'); return { id: string(r.id), status: r.status }; }), retry = list(i.retry).map(string); return { retried: previous.filter(r => r.status === 'failed' && retry.includes(r.id)).map(r => r.id), results: previous.map(r => ({ ...r, status: r.status === 'failed' && retry.includes(r.id) ? 'success' : r.status })) }; },
  'masking': i => { const value = string(i.value), keep = integer(i.keep); if (keep > value.length) fail('保留位数超出文本长度'); return { masked: '*'.repeat(value.length - keep) + value.slice(value.length - keep), length: value.length }; },
  'virtualization': i => { const count = integer(i.count), height = positive(i.rowHeight), viewport = positive(i.viewport), scroll = num(i.scroll), overscan = integer(i.overscan); if (count > 100000 || scroll < 0 || scroll > Math.max(0, count * height - viewport) || overscan > 10) fail('窗口参数超界'); const start = Math.max(0, Math.floor(scroll / height) - overscan), end = Math.min(count, Math.ceil((scroll + viewport) / height) + overscan); return { start, end, indexes: range(end - start).map(n => n + start), top: start * height, bottom: (count - end) * height, totalHeight: count * height }; },
  'memoization': i => { const cache = new Map(); let computations = 0; const outputs = list(i.inputs).map(v => { const key = integer(v); if (key > 30) fail('阶乘样例上限30'); if (!cache.has(key)) { computations++; cache.set(key, range(key).reduce((a, n) => a * (n + 1), 1)); } return cache.get(key); }); return { outputs, computations, hits: i.inputs.length - computations }; },
  'injection': i => { const quantity = positive(integer(i.quantity)), cents = integer(i.cents), strategy = string(i.strategy), providers = { standard: subtotal => 0, localPickup: subtotal => subtotal >= 10000 ? 0 : 500 }; if (!Object.hasOwn(providers, strategy)) fail('未知注入策略'); const subtotal = quantity * cents; return { strategy, subtotal, delivery: providers[strategy](subtotal), total: subtotal + providers[strategy](subtotal) }; },
  'repository': i => { const records = new Map(rows(i.records).map(r => [string(r.id), { ...r }])), id = string(i.id), action = string(i.action); if (!['find', 'update'].includes(action)) fail('仓储仅支持find/update'); if (!records.has(id)) return { found: false, records: [...records.values()] }; if (action === 'update') records.set(id, { ...records.get(id), name: string(i.name) }); return { found: true, record: records.get(id), records: [...records.values()] }; },
  'service': i => { const stock = integer(i.stock), quantity = positive(integer(i.quantity)); return quantity > stock ? { accepted: false, stock, reason: '库存不足' } : { accepted: true, stock: stock - quantity, reserved: quantity }; },
  'event-bus': i => { const subscriptions = rows(i.subscriptions).map(r => ({ topic: string(r.topic), subscriber: string(r.subscriber) })); return { deliveries: rows(i.events).flatMap(e => { const topic = string(e.topic); return subscriptions.filter(s => s.topic === topic).map(s => ({ subscriber: s.subscriber, topic, payload: e.payload })); }), published: i.events.length }; },
  'configuration': i => { const defaults = i.defaults, overrides = i.overrides; if (![defaults, overrides].every(v => v && typeof v === 'object' && !Array.isArray(v))) fail('配置须为对象'); const unknown = Object.keys(overrides).filter(k => !Object.hasOwn(defaults, k)); if (unknown.length) fail(`未知配置:${unknown.join(',')}`); Object.keys(overrides).forEach(k => { if (typeof overrides[k] !== typeof defaults[k]) fail('覆盖值类型不符'); }); return { effective: { ...defaults, ...overrides }, overridden: Object.keys(overrides) }; },
  'logging': i => { const levels = ['debug', 'info', 'warn', 'error'], threshold = levels.indexOf(i.threshold); if (threshold < 0) fail('未知日志级别'); const entries = rows(i.entries).map(e => { if (!levels.includes(e.level)) fail('未知日志级别'); return { level: e.level, message: string(e.message) }; }); return { visible: entries.filter(e => levels.indexOf(e.level) >= threshold), suppressed: entries.filter(e => levels.indexOf(e.level) < threshold).length }; }
};

const specifications = [];
function define(id, title, key, concept, observation, input, changed, assertion, boundary, task) {
  specifications.push({ knowledgeId: id, title, kind: `advanced-${key}`, principle: concept, mechanism: observation,
    limits: `纯内存本地教学。${boundary} 不连接生产服务，不读取或保存用户数据。`,
    observe: `观察${observation}`, interact: `修改输入中的${Object.keys(changed).join('、')}后运行，对比图形和结构结果。`,
    verify: assertion, apply: task, invariant: boundary, invalid: '点击“检验负例”提交缺少必需字段的对象，必须出现错误且清除过期图形。',
    input, changed: { ...clone(input), ...changed }, invalidInput: {}, references: [] });
}

// Each visual uses the actual computed geometry, rather than an image or a label switch.
define('K-D09-002','Stacked Bar 堆叠柱状图','stacked-bar','同一类别的多个非负系列沿共同基线累计。','各段高度与类别总高。',{a:[20,40,30],b:[10,20,35]},{b:[30,10,15]},'每列总高等于两系列之和；改变B不会改变A段。','仅支持同量纲非负数据。','将第二系列翻倍并核对每类总数。');
define('K-D09-003','Horizontal Bar 横向条形图','horizontal-bar','水平长度表示数值，排序重新组织类别但保留原始身份。','条长与降序编号。',{values:[15,45,30]},{values:[70,45,30]},'最大值排首位，编号随原记录而非当前行号。','本例从零起点比较，不截断数轴。','让类别1成为最大项并定位其编号。');
define('K-D09-004','Grouped Bar 分组柱状图','grouped-bar','同类系列并列共享量尺，便于横向比较。','每组两根独立柱。',{a:[20,40,30],b:[10,20,35]},{a:[50,15,25]},'每组保留A/B两柱，系列不累计。','本例要求系列类别数一致。','调整A并找出B较高的类别。');
define('K-D09-006','Area Chart 面积图','area','曲线与零基线围出的面积强调累计量感。','闭合填充及梯形积分。',{values:[10,30,20,40]},{values:[10,10,10,10]},'常量10的四点序列梯形面积为30。','等间距采样；面积不是样本数值之和。','比较平稳序列和峰值序列的面积。');
define('K-D09-007','Stacked Area 堆叠面积图','stacked-area','上层从下层累计边界开始，显示总量随序列变化。','两层边界与总高度。',{a:[10,20,15,25],b:[20,10,25,15]},{b:[10,10,10,10]},'上边界逐点等于A+B，不将B画到零基线。','仅使用等距非负系列，不提供百分比模式。','使B恒定并观察下层波动如何传到上边界。');
define('K-D09-008','Pie Chart 饼图','pie','圆周角按各项占总量比例分配。','扇区角度与占比。',{values:[20,30,50]},{values:[50,25,25]},'扇区角覆盖360度；首项50/100占半圆。','总量须大于零，负数不适用于占比。','将第一类调整为一半并核对半圆。');
define('K-D09-011','Bubble Chart 气泡图','bubble','横纵坐标表达两维，气泡面积表达第三维。','半径按数值平方根增长。',{rows:[{x:20,y:30,value:4},{x:50,y:60,value:16},{x:80,y:40,value:9}]},{rows:[{x:20,y:30,value:16},{x:50,y:60,value:16}]},'数值从4变16，半径从8变16而非扩大四倍。','三维均为教学数值，气泡可能重叠。','用同位置的4与16验证面积编码。');
define('K-D09-012','Radar Chart 雷达图','radar','多个同标度指标沿等角轴展开。','多边形顶点相对量程。',{values:[60,80,40,70,90],maximum:100},{values:[100,100,100,100,100]},'满量程顶点落到外圈，维度数保持不变。','各维须共享0到maximum尺度。','将所有维度满量程并核对外轮廓。');
define('K-D09-013','Heatmap 热力图','heatmap','矩阵位置保留二维关系，色彩强度反映数值。','每格数值与归一化强度。',{matrix:[[1,4,2],[3,8,5]]},{matrix:[[8,4,2],[3,1,5]]},'最大值强度为1，格子文字与强度同步。','按本矩阵最大值缩放，不跨图比较颜色。','移动高值并追踪热点格子。');
define('K-D09-014','Histogram 直方图','histogram','连续样本按固定区间分桶统计频数。','左闭右开桶和计数。',{values:[1,2,5,6,9,10],width:5},{width:3},'各桶频数之和等于样本数，边界5进入第二桶。','非负样本，最多100个桶。','改变桶宽观察分布而不改变样本总数。');
define('K-D09-015','Boxplot 箱线图','boxplot','四分位箱与须区分中心、离散与异常点。','中位数、四分位和1.5IQR异常值。',{values:[1,2,3,4,5,6,7,30]},{values:[1,2,3,4,5,6,7,8]},'30为异常值；替换为8后异常集合为空。','四分位采用线性插值；不代表分布密度。','替换极端值并比较箱体与须。');
define('K-D09-016','Treemap 矩形树图','treemap','父组宽度与子项高度共同编码层级面积。','嵌套矩形的面积份额。',{groups:[{name:'材料',values:[30,20]},{name:'人工',values:[20,30]}]},{groups:[{name:'材料',values:[60,20]},{name:'人工',values:[10,10]}]},'所有矩形面积合计约为1，组占比随组总量变化。','采用两层切片布局，舍入可能产生千分位误差。','让材料占80%并核对组宽。');
define('K-D09-018','Funnel 漏斗图','funnel','逐步不增的阶段数量显示转化与流失。','阶段宽度、相邻转化和总留存。',{values:[100,70,35,20]},{values:[100,80,60,40]},'第二阶段转化为0.8，最终留存为0.4。','各阶段必须同一批次且数量不递增。','比较两组流程哪一步流失最多。');
define('K-D09-019','Gauge 仪表盘','gauge','量程将单指标映射到弧线上一个角度。','指针角与目标比例。',{value:60,target:100},{value:100},'达到目标时ratio为1、角度90且reached为true。','指标必须在0到目标之间，不自动截断越界值。','把指标调到目标并确认阈值状态。');
define('K-D09-020','Waterfall 瀑布图','waterfall','每次增减从前一个累计值继续，连接起点与终点。','浮动柱起终点及累计结果。',{start:100,changes:[30,-20,40]},{changes:[-30,10,-20]},'终值等于起值加全部增减，负值柱向下。','变化量可为负，不等同于独立类别柱。','追踪三次增减如何从100得到60。');
define('K-D09-021','Candlestick K 线图','candlestick','影线给出高低范围，实体编码开收区间和方向。','开高低收与上涨下跌。',{rows:[{open:30,high:60,low:20,close:50},{open:55,high:65,low:25,close:35}]},{rows:[{open:30,high:60,low:20,close:25}]},'收低于开时方向为下跌，影线仍覆盖实体。','仅演示OHLC几何，不用于金融建议。','构造下跌蜡烛并核对高低包围开收。');
define('K-D09-027','Calendar Heatmap 日历热力图','calendar','日期固定到周网格，再以活动值编码强度。','28天内的行列位置及缺失日零值。',{days:[{day:1,value:2},{day:8,value:8},{day:15,value:4}]},{days:[{day:7,value:10},{day:14,value:5}]},'第7天在首行末列，第14天在第二行末列。','固定四周教学日历，非真实月份或用户活动。','将活动集中周末并验证列位置。');
define('K-D09-028','Bullet Chart 子弹图','bullet','实际条、目标线与量程背景分层显示。','实际宽度与目标差。',{actual:65,target:80,maximum:100},{actual:90},'实际90比目标80多10，条宽占量程0.9。','actual和target均须在同一量程内。','先未达标再超过目标，比较差值正负。');
define('K-D09-029','Sparkline 迷你趋势图','sparkline','小型线条保留序列形状，并用文字补足数值背景。','首尾差与极值标记。',{values:[10,15,12,20,18]},{values:[20,15,12,10,5]},'首尾差为-15，最小值5、最大值20。','等间距小序列，不替代精确读数表格。','比较上升与下降序列并解释首尾差。');
define('K-D09-031','Error Bar 误差线图','error-bar','中心估计值与对称误差共同表达不确定区间。','上下界和中心点。',{rows:[{value:30,error:5},{value:60,error:12}]},{rows:[{value:30,error:20},{value:60,error:2}]},'误差扩大只改变区间宽度，不改变中心估计。','误差值取绝对值；不声称任何置信水平。','让两项中心不变，仅比较误差。');
define('K-D09-032','Polar Chart 极坐标图','polar','角度和半径转换成二维笛卡尔坐标。','角度方向与半径距离。',{rows:[{angle:0,radius:20},{angle:90,radius:40},{angle:180,radius:30}]},{rows:[{angle:270,radius:40},{angle:45,radius:30}]},'270度半径40对应约[0,-40]。','角度按度输入，零度朝右，正向数学逆时针。','验证四个直角方向并比较半径。');
define('K-D09-035','Range Chart 区间图','range','上下限作为一段区间展示，而非误认为两个独立测量。','上下界、中点和长度。',{rows:[{low:20,high:40},{low:35,high:75}]},{rows:[{low:20,high:80},{low:35,high:45}]},'第一项中点50且跨度60，低限不得超过高限。','不附加概率或误差解释。','扩大首项区间并核对中点变化。');
define('K-D09-036','Chart Legend 图例','legend','图例以系列身份控制可见视图，源数据保持完整。','A/B显隐与源数据总数。',{a:[10,30,20],b:[20,15,40],showA:true,showB:true},{showA:false},'隐藏A后只剩B，sourceCount仍为6。','两系列固定身份，不删除隐藏系列数据。','关闭再开启A，确认数值未改变。');
define('K-D09-038','Chart Axis 坐标轴','axis','数轴用定义域将数值归一化到绘图区。','刻度间隔及超界点位置。',{minimum:0,maximum:100,steps:5,values:[20,60,90]},{minimum:20,maximum:80,steps:3},'新刻度为20、40、60、80，值90的位置超过1。','本例不截断数据；视图区外点需从结果读取。','缩小量程并解释为何原数据会越界。');
define('K-D09-040','Chart Data Zoom 数据缩放','data-zoom','索引窗口改变可见数据区间，保留原序列。','可见点的原始索引与源长度。',{values:[10,20,15,30,25,40],start:0,end:5},{start:2,end:4},'窗口只显示索引2到4的三点，源长度仍6。','闭区间索引，超界输入拒绝。','放大中间三点后恢复全部点。');

define('K-D10-001','Map View 地图视图','map-view','世界坐标通过中心和比例转换为视口坐标。','中心平移与缩放后的点位。',{center:[50,50],scale:2,points:[[20,30],[50,50],[80,70]]},{center:[20,30],scale:3},'新中心点[20,30]映射到视口中心[180,100]。','平面虚构地图，无地理投影、瓦片和定位。','把第一个点移到视口中心。');
define('K-D10-003','Marker Clustering 标记聚合','clustering','空间网格桶将邻近点聚成计数标记。','桶大小、聚合中心与数量守恒。',{points:[[10,10],[15,15],[70,60],[75,65]],cell:50},{cell:5},'缩小网格后簇数增加，各簇计数总和仍为4。','网格聚合不等同于基于屏幕距离的聚类。','比较50与5单位网格的拆分结果。');
define('K-D10-019','Map Expression 地图表达式','map-expression','数值条件派生每个要素的展示样式。','阈值两侧的颜色和原始值。',{features:[{id:'北区',value:20},{id:'南区',value:70},{id:'西区',value:45}],threshold:50},{threshold:30},'阈值降到30后西区和南区进入高值色。','仅有预定义比较表达式，不执行输入代码。','调整阈值并记录哪些区域越过分界。');
define('K-D10-021','Route Visualization 路线展示','route','有序坐标串形成起终点明确的折线路径。','逐段距离与方向。',{points:[[10,10],[40,10],[40,50]]},{points:[[10,10],[10,50],[40,50],[70,80]]},'段长按欧氏距离计算，有序点决定起终位置。','平面单位，无导航、路况或真实里程。','增加中间节点并逐段复核路径。');
define('K-D10-022','Route Editing 路线编辑','route-edit','替换一个节点后重新派生路线长度。','修改前后节点与路径。',{points:[[10,10],[40,10],[70,60]],index:1,replacement:[40,60]},{replacement:[10,60]},'仅指定索引点改变，其余节点保持原值。','节点编辑仅在内存，未做路网吸附。','移动中间节点并比较总长。');
define('K-D10-023','Geofence 地理围栏','geofence','区域包含结果的前后变化产生进入和离开事件。','运动点与状态转换序列。',{boundary:[20,20,60,60],path:[[10,30],[30,30],[50,50],[80,50]]},{boundary:[0,0,100,100]},'放大围栏后首步进入，后续全部保持；边界算内部。','矩形平面围栏，起始假定在外部。','改变围栏边界，解释进入离开事件减少的原因。');
define('K-D10-025','Choropleth Map 分级统计地图','choropleth','数值按有序阈值划分离散颜色等级。','区域数值与等级编号。',{regions:[{id:'甲区',value:15},{id:'乙区',value:45},{id:'丙区',value:90}],cuts:[30,60]},{cuts:[10,50]},'15跨过首阈值后属于等级1，90属于等级2。','虚构等面积区域，不隐含真实地理或人口归一化。','改分级阈值并比较等级变化。');
define('K-D10-027','Spatial Measurement 空间测量','measurement','鞋带公式求多边形面积，边长之和求周长。','闭合轮廓面积与周长。',{points:[[10,10],[50,10],[50,40],[10,40]]},{points:[[10,10],[70,10],[70,40],[10,40]]},'矩形60×30的面积1800、周长180。','仅简单平面多边形；不验证自交，不作地球测量。','只扩大宽度并核对面积和周长。');
define('K-D10-028','Spatial Query 空间查询','spatial-query','包含判定派生范围内要素索引。','矩形边界内外的点。',{boundary:[20,20,60,60],points:[[10,10],[30,30],[60,60],[80,50]]},{boundary:[0,0,40,40]},'新范围命中索引0和1，边界点包含在内。','仅轴对齐矩形点查询，无空间数据库。','移动查询范围并对照命中点身份。');
define('K-D10-029','Map Camera 地图视角控制','camera','边界拟合以两轴最小可用比例保证完整可见。','中心、留白与限制缩放比例。',{bounds:[10,10,90,50],width:360,height:200,padding:20},{padding:50},'增加内边距会降低比例，但中心保持[50,30]。','二维平面拟合，不含倾斜或三维投影。','给地图增加留白并核对完整边界仍可见。');

define('K-D11-005','Selection Box 框选','selection','框选用完全包含规则选取形状，结果按稳定ID表示。','选择框与各形状边界。',{boundary:[0,0,60,60],shapes:[{id:'A',bounds:[10,10,30,30]},{id:'B',bounds:[50,30,80,70]}]},{boundary:[0,0,100,100]},'扩大范围后A与B均选中；部分相交不会选中。','本例明确采用完全包含，不使用交叉框选。','让选框只包住A再覆盖全部。');
define('K-D11-008','Alignment Guides 对齐辅助线','alignment','移动坐标接近参考线时按容差吸附。','吸附前后横坐标和命中参考线。',{moving:[47,40],guides:[20,50,80],tolerance:5},{moving:[62,40]},'47吸附到50，62超出容差保持原位。','只沿X轴吸附，距离相同按输入顺序选择。','分别尝试容差内外的两个点。');
define('K-D11-012','Canvas Ruler 标尺','ruler','世界单位按视图比例换成像素间距。','刻度标签与实际像素位置。',{origin:10,scale:2,step:10,count:5},{scale:3},'比例从2到3后刻度间距从20变30，世界值不变。','仅线性横标尺，无屏幕DPI校准。','放大视图并验证标尺数值不变。');
define('K-D11-014','Canvas Clipboard 画布剪贴板','clipboard','复制保留原对象并为副本分配新ID和偏移。','原对象、副本身份和位置差。',{shapes:[{id:'A',x:10,y:20},{id:'B',x:60,y:40}],offset:[15,10]},{offset:[35,25]},'所有副本ID唯一，原始坐标不受复制偏移影响。','仅内部复制模型，不访问系统剪贴板。','制作一份有固定偏移的副本并追溯原对象。');
define('K-D11-015','Canvas Undo / Redo 画布撤销重做','canvas-history','历史栈保存旧状态，撤销与重做在两个栈之间转移。','位置轨迹和两个栈的长度。',{initial:20,actions:[{type:'move',by:10},{type:'move',by:20},{type:'undo'},{type:'redo'}]},{actions:[{type:'move',by:10},{type:'undo'},{type:'move',by:5},{type:'redo'}]},'撤销后新移动会清空重做栈，最终位置25。','数值位置历史，非图形宿主的实际Undo。','从撤销分支新建移动并确认旧重做失效。');
define('K-D11-017','Shape Editor 图形编辑器','shape-editor','图形属性派生尺寸、面积、中心与变换。','实际矩形及旋转中心。',{x:20,y:20,width:60,height:30,rotation:0},{width:90,rotation:30},'宽90高30的面积2700，旋转不改变面积。','仅矩形，旋转围绕自身中心。','扩大宽度并旋转，检查面积不随角度变化。');
define('K-D11-019','Connector 连线工具','connector','连线端点从图形边界连接点派生，随节点位置变化。','右侧输出点到左侧输入点。',{from:[10,20,50,60],to:[100,50,140,90]},{to:[130,10,170,50]},'目标节点移动后终点随左边中点更新。','固定右出左入，无障碍避让。','移动目标节点并核对端点仍贴边。');
define('K-D11-026','Node Resizer 节点调整大小','resizer','请求尺寸通过最小最大约束得到有效尺寸。','请求框和受约束节点。',{requested:[80,50],minimum:[40,30],maximum:[120,90]},{requested:[200,10]},'200×10请求被限制为120×30。','独立宽高限制，不保持纵横比。','把请求同时推到上限和下限之外。');
define('K-D11-027','Node Grouping 节点分组','grouping','子节点保留局部坐标，父组平移统一产生世界位置。','局部位置与世界位置。',{offset:[20,20],children:[{id:'A',x:10,y:10},{id:'B',x:50,y:30}]},{offset:[50,40]},'所有世界坐标按相同差量移动，局部坐标不变。','单层平移分组，不含旋转和嵌套矩阵。','移动父组并验证两子节点相对间距。');
define('K-D11-028','Node Validation 节点校验','node-validation','节点类型规定可拥有的输入输出端口集合。','各节点端口与通过状态。',{nodes:[{id:'A',type:'source',ports:['out']},{id:'B',type:'sink',ports:['in']}]},{nodes:[{id:'A',type:'source',ports:['in']},{id:'B',type:'processor',ports:['in','out']}]},'source上的in端口不通过，processor双端口通过。','本例只校验类型和端口，不执行任何节点。','给源节点误配输入端口并修正。');
define('K-D11-029','Edge Validation 连线校验','edge-validation','有向边校验端点、重复和环，环会阻断拓扑完成。','连线关系及拓扑处理数量。',{nodes:['A','B','C'],edges:[['A','B'],['B','C']]},{edges:[['A','B'],['B','C'],['C','A']]},'新增C到A后cyclic为true。','仅有向图结构，不代替端口业务类型校验。','构造一个三节点环并定位无法排序的原因。');
define('K-D11-030','Auto Layout 自动布局','auto-layout','DAG层级由最长前驱路径决定，同层节点另排一行。','层深横坐标和同层纵坐标。',{nodes:['A','B','C','D'],edges:[['A','B'],['A','C'],['B','D']],gap:70},{gap:100},'增加gap只改变间距，不改变拓扑先后。','仅支持DAG和从左到右布局，不处理循环图。','调大间距并确认D始终在B之后。');
define('K-D11-031','Edge Routing 连线路径规划','routing','正交折线路径通过指定竖向通道连接两点。','水平竖直线段和曼哈顿长度。',{from:[10,20],to:[120,80],via:60},{via:150},'中间两点共用via横坐标，通道在外侧时路径更长。','不自动避障，通道由输入指定。','比较通道位于端点之间和之外的长度。');
define('K-D11-032','Diagram Serialization 图形序列化','serialization','只序列化明确的版本和节点字段，再恢复等值对象。','JSON快照与恢复后的节点。',{nodes:[{id:'A',x:10,y:20},{id:'B',x:60,y:40}]},{nodes:[{id:'A',x:30,y:40},{id:'C',x:90,y:60}]},'恢复节点与规范化输入等值，same为true。','只在内存中处理JSON，不写文件或存储。','调整节点后检查快照和恢复图一致。');
define('K-D11-040','Dependency Graph 依赖关系图','dependency','入度为零的节点先处理，逐步释放其后继。','拓扑顺序与环检测。',{nodes:['备料','制作','安装'],edges:[['备料','制作'],['制作','安装']]},{edges:[['备料','制作'],['制作','安装'],['安装','备料']]},'无环时按依赖输出全部节点，有环时cyclic为true。','只分析结构，不会实际调度任务。','增加循环依赖并解释任务为何无法开始。');

define('K-D16-005','Throttle 节流','throttle','首事件通过后，固定间隔内的后续事件被抑制。','时间戳与实际接受事件。',{times:[0,30,90,110,220],interval:100},{interval:50},'间隔50时通过0、90、220，110被90抑制。','确定性首沿节流，不使用真实计时器。','比较50与100毫秒策略的执行次数。');
define('K-D16-017','Cache Management 缓存管理','cache','缓存项有效期由写入时刻加TTL决定。','当前时刻与可读取键。',{entries:[{key:'A',value:1,at:0},{key:'B',value:2,at:80}],ttl:100,now:90},{now:120},'时刻120时A过期而B仍可读。','模拟时钟与内存条目，无浏览器缓存访问。','推动时钟跨过首项期限。');
define('K-D16-018','Cache Invalidation 缓存失效','invalidation','标签关联依赖，匹配标签的缓存条目一起失效。','被失效键与剩余键。',{entries:[{key:'list',tags:['orders']},{key:'detail',tags:['orders','one']},{key:'users',tags:['users']}],tag:'orders'},{tag:'users'},'使users失效时订单两键保留。','标签匹配模型，不发送远程重新获取请求。','更新不同资源并检查失效范围。');
define('K-D16-019','Cache Key 缓存键设计','cache-key','规范化参数顺序并编码，避免对象插入顺序造成不同键。','排序后参数与编码结果。',{resource:'orders',params:{page:1,status:'待审'}},{params:{status:'待审',page:2}},'页码改变会改变键；相同参数不同顺序得到相同键。','只支持扁平标量参数，不自动推断身份范围。','比较第二页和第一页面的缓存身份。');
define('K-D16-023','Data Normalization 数据规范化','normalization','有序ID列表分离展示顺序，实体映射提供身份定位。','ids与entities的一对一关系。',{rows:[{id:'A',name:'甲'},{id:'B',name:'乙'}]},{rows:[{id:'B',name:'乙新版'},{id:'A',name:'甲'}]},'行顺序变化只改变ids顺序，实体仍按ID定位。','重复与保留ID拒绝，非完整关系数据库。','重排行并修改B，确认身份无串位。');
define('K-D16-029','Cache Eviction 缓存淘汰','eviction','LRU每次访问将键移到最近端，超量淘汰最久未用项。','访问序列与从旧到新的缓存顺序。',{capacity:2,accesses:['A','B','A','C']},{accesses:['A','B','C','B','D']},'最终顺序B、D，淘汰A再C。','容量限于20，键值仅演示身份顺序。','重访B并核对它免于下一次淘汰。');
define('K-D16-032','Exponential Backoff 指数退避','backoff','每次等待翻倍，达到上限后保持封顶。','各次等待与累计时间。',{base:100,cap:1000,attempts:5},{attempts:7},'等待序列100、200、400、800、1000、1000、1000。','仅计划等待，不执行请求或真实延时；不含抖动。','增加尝试次数并检查封顶生效。');
define('K-D16-036','Idempotency 幂等性','idempotency','同一幂等键重复出现只执行第一次。','原请求数、执行台账和累计量。',{requests:[{key:'one',amount:20},{key:'one',amount:20},{key:'two',amount:30}]},{requests:[{key:'one',amount:20},{key:'one',amount:99},{key:'two',amount:30}]},'one重复请求不会再次累加，总计仍50。','教学采用首值保留；生产还需参数一致性、持久化及并发保障。','用相同键不同金额验证首值保留边界。');
define('K-D16-038','Transaction Handling 事务处理','transaction','先在工作副本应用全部变化，任何余额负值则整体撤回。','尝试轨迹与最终提交余额。',{balance:100,changes:[-30,20,-10]},{changes:[-30,-80,50]},'中途变负时committed为false，最终余额仍100。','内存原子模型，不代表真实数据库隔离性。','触发中途失败并验证没有部分扣减。');
define('K-D16-040','Partial Failure Handling 部分失败处理','partial-failure','每项独立结算成功或失败，结果保留原索引。','成功值与单项失败原因。',{values:[10,-5,30],divisor:5},{divisor:0},'除数为零时三项均失败，原索引仍可追溯。','本地同步计算，无远程服务重试。','比较单项负数失败与全局除零失败。');
define('K-D16-044','Optimistic Lock 乐观锁','optimistic-lock','写入只有携带当前版本号才被接受，成功后版本递增。','两个写入的版本与接受结果。',{initial:'原稿',version:1,writes:[{version:1,value:'甲稿'},{version:1,value:'乙稿'}]},{writes:[{version:1,value:'甲稿'},{version:2,value:'乙稿'}]},'第二次使用版本2可成功，最终版本3、值乙稿。','单进程版本比较教学，无真实并发数据库。','先用旧版本冲突，再携带新版本重试。');
define('K-D16-047','Last Write Wins 最后写入优先','last-write','按时间戳决定胜者，同刻用稳定作者序确定顺序。','胜出值与被覆盖记录。',{writes:[{actor:'A',time:10,value:'甲'},{actor:'B',time:12,value:'乙'}]},{writes:[{actor:'A',time:15,value:'甲'},{actor:'B',time:12,value:'乙'}]},'A时间15胜出，B记录保留在discarded。','只用输入逻辑时间，不处理时钟偏差；可能丢失修改。','交换写入时间并解释覆盖风险。');
define('K-D16-048','Merge Strategy 数据合并策略','merge','三方比较基线，独立字段变更自动合并，同字段分歧列为冲突。','自动合并字段与冲突字段。',{base:{title:'旧',qty:1},local:{title:'新',qty:1},remote:{title:'旧',qty:2}},{remote:{title:'另一稿',qty:2}},'qty合并为2，title冲突且不擅自选值。','浅层字段比较，冲突等待人工决策。','构造互不重叠和同字段修改两种情况。');
define('K-D16-049','Event Sourcing 事件溯源','event-sourcing','从初始状态依次折叠不可变事件，重建当前状态。','每个事件后的累计余额。',{initial:0,events:[{type:'deposit',amount:100},{type:'withdraw',amount:30}]},{events:[{type:'deposit',amount:100},{type:'withdraw',amount:30},{type:'deposit',amount:20}]},'重放第三事件后余额90，前两个事件中间值不变。','本地事件折叠，不写审计或金融台账。','追加事件并从头重放核对结果。');
define('K-D16-052','Data Reconciliation 数据对账','reconciliation','用稳定ID对齐两侧记录，报告缺失和数值差异。','差异记录及左右金额。',{left:[{id:'A',amount:100},{id:'B',amount:50}],right:[{id:'A',amount:100},{id:'B',amount:40}]},{right:[{id:'A',amount:100},{id:'C',amount:20}]},'B为右侧缺失，C为左侧缺失，A不报告差异。','虚构整数单位，只报告不自动修复。','制造缺失与不等额两种差异。');
define('K-D16-054','State Machine 状态机','state-machine','状态与事件表共同限定允许的下一个状态。','执行轨迹与被拒绝事件。',{events:['start','pause','resume','finish']},{events:['pause','start','finish','start']},'空闲pause和结束start被拒绝，最终仍done。','有限预定义运行状态，不执行真实Agent。','尝试非法事件，确认状态不跳变。');
define('K-D16-055','State Transition Validation 状态转换校验','transition-validation','状态门禁先验证事件，再应用目标状态。','每步before、accepted与after。',{initial:'draft',events:['submit','approve']},{events:['approve','submit','reject','revise']},'草稿approve拒绝，后续提交驳回修订回draft。','固定教学单据流转，不改变任何业务规则。','走一次驳回修订再提交的合法流程。');
define('K-D16-056','Dirty Form 脏表单检测','dirty-form','当前字段与初始快照逐项比较，推导是否存在未保存修改。','变更字段清单和离开提示条件。',{initial:{name:'甲',qty:1},current:{name:'甲',qty:1}},{current:{name:'乙',qty:2}},'name与qty均列为changed，dirty为true。','JSON字段结构比较，不拦截真实页面离开。','改值后恢复原值，检查脏状态消失。');
define('K-D16-060','Command Pattern 命令模式','command','命令封装增量及其逆运算，撤销只作用于已执行命令。','执行轨迹与剩余可撤销命令。',{initial:10,commands:[{type:'move',by:20},{type:'move',by:-5},{type:'undo'}]},{commands:[{type:'move',by:20},{type:'undo'},{type:'undo'}]},'重复撤销空栈不减值，最终位置回10。','可逆数值移动，无外部副作用补偿。','混合正负移动后逐步撤销。');
define('K-D16-065','Batch Processing 批量处理','batch','按固定上限切分输入，保留原顺序及末批余项。','批次边界与总和。',{values:[1,2,3,4,5,6,7],size:3},{size:2},'产生四批，最后一批只有7，合计仍28。','同步数组分组，无真实批任务或并行调度。','改变批大小并证明不丢不重。');
define('K-D16-066','Bulk Operation Recovery 批量操作恢复','bulk-recovery','恢复只重试失败且被选中的项，已有成功项不再次执行。','重试ID与更新后状态。',{previous:[{id:'A',status:'success'},{id:'B',status:'failed'},{id:'C',status:'failed'}],retry:['A','B']},{retry:['C']},'只重试C，A成功保留、B仍失败。','重试设为本地成功结果，不执行远程操作。','仅恢复失败子集并检查成功项不重复。');
define('K-D16-080','Sensitive Data Masking 敏感数据脱敏','masking','显示层保留指定尾部长度，其余以星号遮挡。','掩码结果与原长度。',{value:'13800138000',keep:4},{keep:2},'只保留末两位00，长度保持11。','字符串示例；脱敏不是加密，原输入仍在本演示控件。','比较保留4位和2位的披露程度。');
define('K-D16-085','Virtualization 虚拟化','virtualization','只派生可见窗口和overscan索引，空白高度保留滚动总长。','渲染索引区间及上下占位高度。',{count:1000,rowHeight:20,viewport:100,scroll:0,overscan:1},{scroll:200},'窗口滚动200后start为9、end为16，总高仍20000。','固定行高计算教学，非完整滚动框架。','移动窗口并核对渲染数量不随总数暴涨。');
define('K-D16-086','Memoization 记忆化','memoization','相同输入命中已有结果，避免重复计算。','阶乘结果、计算次数和命中数。',{inputs:[3,4,3,5,4]},{inputs:[3,3,3,3]},'四次相同输入只计算一次，命中三次。','每次运行重新创建内存缓存，整数上限30。','比较重复输入与不同输入的计算次数。');
define('K-D16-098','Dependency Injection 依赖注入','injection','价格流程接收可替换配送策略，调用方不改计算步骤。','同一小计在不同策略下的配送费。',{quantity:2,cents:1200,strategy:'standard'},{strategy:'localPickup'},'小计2400不变，localPickup策略增加500配送费。','策略名称为教学规则，不是实际物流或报价。','替换策略并区分稳定流程与变动政策。');
define('K-D16-099','Repository Pattern 仓储模式','repository','按稳定ID封装查找更新，业务调用不依赖存储细节。','目标记录与完整集合。',{records:[{id:'A',name:'甲'},{id:'B',name:'乙'}],id:'A',action:'find',name:'新版'},{action:'update'},'只更新A名称为新版，B保持乙。','仓储是短生命周期内存Map，无数据库操作。','查找后更新指定ID并核对其他记录。');
define('K-D16-100','Service Layer 服务层','service','服务步骤集中验证库存不变量，先判定再扣减。','接受结果与剩余库存。',{stock:10,quantity:3},{quantity:12},'数量12被拒绝，库存仍10。','虚构库存单次计算，不提供跨请求并发保护。','先通过再制造库存不足并比较结果。');
define('K-D16-101','Event Bus 事件总线','event-bus','发布者只指明主题，按订阅关系派生多接收者投递。','每个主题的实际接收者。',{subscriptions:[{topic:'order',subscriber:'看板'},{topic:'order',subscriber:'日志'},{topic:'stock',subscriber:'库存'}],events:[{topic:'order',payload:'A'}]},{events:[{topic:'stock',payload:'入库'},{topic:'unknown',payload:'无接收者'}]},'两次发布仅库存收到一条，未知主题无投递。','同步路由模型，无消息中间件或网络通信。','切换主题并追踪投递扇出。');
define('K-D16-104','Configuration Management 配置管理','configuration','默认值和类型匹配的已知覆盖值组成有效配置。','有效值与被覆盖字段。',{defaults:{pageSize:20,compact:false},overrides:{pageSize:10}},{overrides:{compact:true}},'只覆盖compact，pageSize回到默认20。','扁平已知键配置，未知键和类型不匹配拒绝。','只覆盖一项并确认另一项仍来自默认值。');
define('K-D16-106','Logging 日志系统','logging','级别阈值保留达到严重度的事件，其余计为抑制。','可见日志顺序和抑制数量。',{threshold:'warn',entries:[{level:'debug',message:'计算细节'},{level:'info',message:'开始'},{level:'warn',message:'输入接近上限'},{level:'error',message:'操作失败'}]},{threshold:'error'},'error阈值只保留错误，抑制数3。','仅当前页面内存展示，不写日志文件或遥测。','调高级别阈值并比较保留下来的事件。');

const negativeCases = {
  'stacked-bar':['A有三类而B只有两类，不能按位置静默错配。',{b:[10,20]}],
  'horizontal-bar':['负数不能进入本例从零向右的非负条形编码。',{values:[10,-5,20]}],
  'grouped-bar':['并列比较的系列必须拥有相同类别数。',{a:[10]}],
  'area':['负值需要跨零基线设计，本例应明确拒绝。',{values:[10,-5,20]}],
  'stacked-area':['累计边界要求每个采样位置都有对应系列值。',{b:[10,20]}],
  'pie':['全零数据没有可定义的占比，不能画成有效整圆。',{values:[0,0,0]}],
  'bubble':['零或负面积不能作为本例有效气泡。',{rows:[{x:20,y:30,value:-4}]}],
  'radar':['某维超过量程上限会产生误导性轮廓，必须拒绝。',{values:[120,80,40,70,90]}],
  'heatmap':['不等宽矩阵不能默认为完整二维网格。',{matrix:[[1,2],[3]]}],
  'histogram':['分桶宽度为零会使区间不可定义。',{width:0}],
  'boxplot':['空样本不能计算四分位数或生成虚构箱体。',{values:[]}],
  'treemap':['总量为零的父组没有可定义的子项比例。',{groups:[{name:'空组',values:[0,0]}]}],
  'funnel':['后阶段数量超过前阶段，不满足本例同批次漏斗假设。',{values:[100,120,60]}],
  'gauge':['当前值超过量程时不能静默截断指针。',{value:110}],
  'waterfall':['增减序列中的文字不能参与累计计算。',{changes:[20,'未知',-10]}],
  'candlestick':['最高值低于收盘值，无法用影线包围实体。',{rows:[{open:20,high:25,low:10,close:30}]}],
  'calendar':['同一天重复出现会使活动值归属不明确。',{days:[{day:1,value:2},{day:1,value:8}]}],
  'bullet':['目标超过量程会让目标线失去比较尺度。',{target:120}],
  'sparkline':['空序列没有首尾值，不应画出假趋势。',{values:[]}],
  'error-bar':['误差为文字时不能构造数值上下界。',{rows:[{value:20,error:'未知'}]}],
  'polar':['负半径不是本例允许的极坐标输入。',{rows:[{angle:90,radius:-20}]}],
  'range':['下限大于上限的区间必须拒绝。',{rows:[{low:60,high:20}]}],
  'legend':['系列开关必须为布尔值，文字false不等于布尔false。',{showA:'false'}],
  'axis':['最大值与最小值相同时不能计算归一化位置。',{minimum:100,maximum:100}],
  'data-zoom':['窗口起点大于终点不是合法可见索引范围。',{start:4,end:2}],
  'map-view':['零比例使坐标全部塌缩，不能作为有效地图视图。',{scale:0}],
  'clustering':['网格大小为零无法计算空间桶。',{cell:0}],
  'map-expression':['阈值必须是数值，不能按文字顺序比较。',{threshold:'五十'}],
  'route':['只有一个坐标没有可连接的路线段。',{points:[[10,10]]}],
  'route-edit':['节点索引超出路线长度时不能修改其他节点代替。',{index:20}],
  'geofence':['最小边界大于最大边界时围栏定义无效。',{boundary:[60,20,20,60]}],
  'choropleth':['分级阈值不递增会使等级含义不明确。',{cuts:[60,30]}],
  'measurement':['两个点不能形成有面积的闭合多边形。',{points:[[0,0],[10,10]]}],
  'spatial-query':['倒置查询边界不能被解释为有效矩形。',{boundary:[60,60,20,20]}],
  'camera':['内边距吞掉可用视口时无法拟合边界。',{padding:100}],
  'selection':['倒置选框不能参与完全包含判断。',{boundary:[60,60,0,0]}],
  'alignment':['负容差没有合法吸附邻域。',{tolerance:-1}],
  'ruler':['世界到像素的比例为零时刻度会重叠。',{scale:0}],
  'clipboard':['原始对象ID重复时无法建立明确复制来源。',{shapes:[{id:'A',x:10,y:10},{id:'A',x:20,y:20}]}],
  'canvas-history':['历史记录包含未知操作时不能猜测其逆操作。',{actions:[{type:'erase'}]}],
  'shape-editor':['矩形宽为零不满足本例有效图形约束。',{width:0}],
  'connector':['来源边界倒置时没有明确右边连接点。',{from:[50,20,10,60]}],
  'resizer':['最小宽度大于最大宽度是矛盾的尺寸约束。',{minimum:[150,30]}],
  'grouping':['组偏移缺少一个坐标轴时不能保持二维变换。',{offset:[20]}],
  'node-validation':['端口集合为空，不满足本例节点至少一个端口的约束。',{nodes:[{id:'A',type:'source',ports:[]}]}],
  'edge-validation':['连线端点Z不存在时应拒绝悬空引用。',{edges:[['A','Z']]}],
  'auto-layout':['循环图无法完成本例DAG分层。',{edges:[['A','B'],['B','A']]}],
  'routing':['通道横坐标不是数值，不能生成正交路径。',{via:'左边'}],
  'serialization':['重复节点ID会使恢复身份不明确。',{nodes:[{id:'A',x:10,y:10},{id:'A',x:20,y:20}]}],
  'dependency':['依赖引用不存在的任务时不能声称排序完整。',{edges:[['备料','不存在']]}],
  'throttle':['事件时刻倒序会破坏本例按到达顺序计算的间隔。',{times:[100,20,150]}],
  'cache':['TTL为零不满足本例有效期必须为正的约束。',{ttl:0}],
  'invalidation':['标签不是文字时不能与依赖标签匹配。',{tag:100}],
  'cache-key':['嵌套参数没有本例定义的规范化规则，必须拒绝。',{params:{filter:{status:'待审'}}}],
  'normalization':['相同ID对应两行会覆盖实体，因此应拒绝。',{rows:[{id:'A',name:'甲'},{id:'A',name:'乙'}]}],
  'eviction':['零容量不满足本例至少保留一项的缓存约束。',{capacity:0}],
  'backoff':['封顶值低于初始等待值会使退避策略矛盾。',{cap:50}],
  'idempotency':['缺少文字幂等键时不能对请求去重。',{requests:[{key:123,amount:20}]}],
  'transaction':['余额变化中出现非数字时不能提交任何扣加。',{changes:[-20,'未知']}],
  'partial-failure':['输入中混入非数值项，无法进入本例的数值任务管线。',{values:[10,'未知',20]}],
  'optimistic-lock':['版本号不能为负数，否则版本比较没有约定语义。',{version:-1}],
  'last-write':['写入时间不是数值时无法确定时间顺序。',{writes:[{actor:'A',time:'刚刚',value:'甲'}]}],
  'merge':['基线必须为字段对象，数组不适用本例字段级三方合并。',{base:[]}],
  'event-sourcing':['未知事件类型不能在重放时猜测状态变化。',{events:[{type:'multiply',amount:2}]}],
  'reconciliation':['同一侧ID重复会使对账匹配多义。',{left:[{id:'A',amount:20},{id:'A',amount:30}]}],
  'state-machine':['事件必须为命名字符串，不能以数字猜测事件。',{events:[1]}],
  'transition-validation':['未知初态不能参与既定转换表。',{initial:'unknown'}],
  'dirty-form':['当前表单不是字段对象时不能比较脏字段。',{current:null}],
  'command':['未知命令没有可定义的执行和撤销动作。',{commands:[{type:'delete'}]}],
  'batch':['批次大小为零无法形成有限分组。',{size:0}],
  'bulk-recovery':['来源状态不属于成功或失败时不能擅自安排重试。',{previous:[{id:'A',status:'unknown'}]}],
  'masking':['保留尾部长度大于原文长度是非法披露规则。',{keep:12}],
  'virtualization':['滚动位置为负数不在合法内容窗口内。',{scroll:-20}],
  'memoization':['阶乘输入为负数不在本例非负整数定义域。',{inputs:[-1]}],
  'injection':['未注册策略没有可信实现，不能按任意名字执行。',{strategy:'unregistered'}],
  'repository':['不支持的仓储动作不应穿透为直接数据操作。',{action:'delete'}],
  'service':['负数量不能作为库存预留申请。',{quantity:-1}],
  'event-bus':['事件主题不是文字时无法进行明确定向投递。',{events:[{topic:123,payload:'错误'}]}],
  'configuration':['覆盖值类型和默认值不一致时应拒绝。',{overrides:{compact:'true'}}],
  'logging':['未定义严重度阈值不能参与日志等级过滤。',{threshold:'fatal'}],
};
for (const d of specifications) {
  const negative = negativeCases[d.kind.slice(9)];
  d.invalid = `负例：${negative[0]} 点击“检验负例”应报错并清除过期图形。`;
  d.invalidInput = { ...clone(d.input), ...clone(negative[1]) };
}

export function runAdvancedExample(definition, input) {
  const d = typeof definition === 'string' ? specifications.find(item => item.knowledgeId === definition) : definition;
  if (!d || typeof d.kind !== 'string' || !d.kind.startsWith('advanced-')) fail('未知教学条目');
  const key = d.kind.slice(9), source = input === undefined ? clone(d.input) : clone(input);
  if (!source || typeof source !== 'object' || Array.isArray(source) || Object.keys(d.input).some(k => !Object.hasOwn(source, k))) fail('缺少必需输入字段');
  if (!Object.hasOwn(models, key)) fail('未知本地机制');
  return models[key](source);
}
export const advancedDefinitions = specifications.map(d => Object.freeze({ ...d,
  code: `const {runAdvancedExample}=await import('./expanded-advanced.mjs');\nconsole.log(JSON.stringify(runAdvancedExample('${d.knowledgeId}')));`,
  expected: JSON.stringify(runAdvancedExample(d)),
}));

function element(doc, tag, text, attrs = {}) {
  const el = doc.createElement(tag); if (text !== undefined) el.textContent = text;
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); return el;
}
function drawSVG(doc, kind, input, output) {
  const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 360 220'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', `${kind}输入计算图，精确值见结构结果`);
  svg.style.cssText = 'width:100%;max-width:600px;min-height:160px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px';
  const add = (tag, attrs = {}, text) => { const e = doc.createElementNS(svg.namespaceURI, tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, String(v))); if (text !== undefined) e.textContent = text; svg.append(e); return e; };
  const line = (x1, y1, x2, y2, stroke = '#475569', width = 2) => add('line', { x1, y1, x2, y2, stroke, 'stroke-width': width });
  const rect = (x, y, width, height, fill = colors[0], stroke = 'none') => add('rect', { x, y, width: Math.max(0, width), height: Math.max(0, height), fill, stroke });
  const dot = (x, y, r = 5, fill = colors[0]) => add('circle', { cx: x, cy: y, r, fill });
  const text = (x, y, value, fill = '#0f172a', size = 11) => add('text', { x, y, fill, 'font-size': size }, value);
  const poly = (ps, fill = 'none', stroke = colors[0]) => add('polyline', { points: ps.map(p => p.join(',')).join(' '), fill, stroke, 'stroke-width': 2 });
  const chartPoints = (ps, minValue, maxValue) => { const xs = ps.map(p => p[0]), ys = ps.map(p => p[1]), minX = Math.min(...xs), maxX = Math.max(...xs), low = minValue ?? Math.min(0, ...ys), high = maxValue ?? Math.max(1, ...ys); return ps.map(([x, y]) => [30 + (x - minX) / (maxX - minX || 1) * 295, 185 - (y - low) / (high - low || 1) * 150]); };
  const drawBars = (values, horizontal = false) => { const max = Math.max(...values, 1); values.forEach((v, n) => { if (horizontal) { rect(45, 25 + n * 45, v / max * 260, 28, colors[n % 6]); text(5, 44 + n * 45, output.bars?.[n].id ?? n + 1); text(50 + v / max * 260, 44 + n * 45, v); } else { const w = 280 / values.length; rect(35 + n * w, 185 - v / max * 150, w * .7, v / max * 150, colors[n % 6]); text(35 + n * w, 205, v); } }); };
  if (kind === 'stacked-bar' || kind === 'grouped-bar') {
    const groups = output.segments || output.groups, max = Math.max(1, ...groups.map(g => kind === 'stacked-bar' ? sum(g) : Math.max(...g))), w = 280 / groups.length;
    groups.forEach((g, n) => { let base = 185; g.forEach((v, s) => { const h = v / max * 150; rect(35 + n * w + (kind === 'grouped-bar' ? s * w * .38 : 0), kind === 'stacked-bar' ? base - h : 185 - h, w * (kind === 'grouped-bar' ? .32 : .7), h, colors[s]); if (kind === 'stacked-bar') base -= h; }); text(35 + n * w, 205, `类${n + 1}`); });
  } else if (kind === 'horizontal-bar') drawBars(output.bars.map(b => b.value), true);
  else if (kind === 'area' || kind === 'stacked-area') {
    const upper = output.upper || output.points, max = Math.max(1, ...upper.map(p => p[1])), up = chartPoints(upper, 0, max), baseline = [[up.at(-1)[0],185],[up[0][0],185]];
    poly([...up, ...baseline, up[0]], '#fed7aa', colors[1]); if (output.lower) { const low = chartPoints(output.lower, 0, max); poly([...low, ...baseline, low[0]], '#93c5fd'); }
  } else if (kind === 'pie') {
    output.sectors.forEach((s, n) => { if (!s.value) return; if (s.end - s.start >= 359.999) { dot(175,105,85,colors[n%6]); return; } const p = angle => [175 + 85 * Math.cos((angle - 90) * Math.PI / 180),105 + 85 * Math.sin((angle - 90) * Math.PI / 180)], a=p(s.start),b=p(s.end); add('path',{d:`M175,105 L${a.join(',')} A85,85 0 ${s.end-s.start>180?1:0} 1 ${b.join(',')} Z`,fill:colors[n%6],stroke:'#fff'}); }); text(10,210,`总量 ${output.total}`);
  } else if (kind === 'bubble') output.bubbles.forEach((b,n)=>{dot(30+b.x*2.7,185-b.y*1.5,b.radius,colors[n%6]);text(30+b.x*2.7,190-b.y*1.5,b.value,'#fff');});
  else if (kind === 'radar') { range(output.vertices.length).forEach(n=>line(180,105,180+Math.sin(n/output.vertices.length*Math.PI*2)*85,105-Math.cos(n/output.vertices.length*Math.PI*2)*85,'#cbd5e1')); const ps=output.vertices.map(p=>[180+p[0]*85,105+p[1]*85]);poly([...ps,ps[0]],'#bfdbfe');ps.forEach((p,n)=>text(p[0],p[1],output.values[n])); }
  else if (kind === 'heatmap') output.matrix.forEach((row,y)=>row.forEach((v,x)=>{const e=rect(25+x*280/row.length,25+y*160/output.matrix.length,280/row.length-2,160/output.matrix.length-2,colors[0]);e.setAttribute('fill-opacity',.15+output.intensities[y][x]*.85);text(35+x*280/row.length,50+y*160/output.matrix.length,v);}));
  else if (kind === 'histogram') {drawBars(output.bins.map(b=>b.count));output.bins.forEach((b,n)=>text(35+n*280/output.bins.length,218,`${b.from}–${b.to}`, '#475569',9));}
  else if (kind === 'boxplot') {const lo=Math.min(output.low,...output.outliers),hi=Math.max(output.high,...output.outliers),x=v=>30+(v-lo)/(hi-lo||1)*295;line(x(output.low),105,x(output.high),105);rect(x(output.q1),70,x(output.q3)-x(output.q1),70,'#bfdbfe',colors[0]);line(x(output.median),70,x(output.median),140,colors[1],3);[output.low,output.high].forEach(v=>line(x(v),90,x(v),120));output.outliers.forEach(v=>dot(x(v),105,5,colors[4]));text(20,195,`Q1 ${output.q1} 中位 ${output.median} Q3 ${output.q3}`);}
  else if (kind === 'treemap') output.rectangles.forEach((r,n)=>{rect(20+r.x*320,20+r.y*175,r.width*320,r.height*175,colors[n%6],'#fff');text(25+r.x*320,38+r.y*175,`${r.group}${r.leaf}:${r.value}`,'#fff',10);});
  else if (kind === 'funnel') output.stages.forEach((s,n)=>{const width=s.retained*290,y=15+n*180/output.stages.length;add('polygon',{points:`${180-width/2},${y} ${180+width/2},${y} ${180+width*.4},${y+35} ${180-width*.4},${y+35}`,fill:colors[n%6]});text(155,y+22,`${s.value} / ${s.conversion}`,'#fff');});
  else if (kind === 'gauge') {add('path',{d:'M90,150 A90,90 0 0 1 270,150',fill:'none',stroke:'#cbd5e1','stroke-width':20});const a=(180-output.ratio*180)*Math.PI/180;line(180,150,180+80*Math.cos(a),150-80*Math.sin(a),colors[1],5);dot(180,150,6);text(140,195,`${output.value}/${output.target}`);}
  else if (kind === 'waterfall') {const values=[output.initial,...output.bars.flatMap(b=>[b.start,b.end])],lo=Math.min(0,...values),hi=Math.max(1,...values),y=v=>185-(v-lo)/(hi-lo)*150,w=280/(output.bars.length+1);rect(30,y(output.initial),w*.6,185-y(output.initial),colors[0]);output.bars.forEach((b,n)=>{rect(30+(n+1)*w,Math.min(y(b.start),y(b.end)),w*.6,Math.max(2,Math.abs(y(b.start)-y(b.end))),b.change>=0?colors[2]:colors[4]);line(30+n*w+w*.6,y(b.start),30+(n+1)*w,y(b.start),'#94a3b8',1);text(30+(n+1)*w,205,b.end);});}
  else if (kind === 'candlestick') {const hi=Math.max(...output.candles.map(c=>c.high)),lo=Math.min(...output.candles.map(c=>c.low)),y=v=>185-(v-lo)/(hi-lo||1)*150;output.candles.forEach((c,n)=>{const x=60+n*100;line(x,y(c.low),x,y(c.high));rect(x-15,Math.min(y(c.open),y(c.close)),30,Math.max(2,Math.abs(y(c.open)-y(c.close))),c.direction==='上涨'?colors[2]:colors[4]);text(x-20,208,c.direction);});}
  else if (kind === 'calendar') {const max=Math.max(1,...output.cells.map(c=>c.value));output.cells.forEach(c=>{const e=rect(25+c.column*43,20+c.row*43,39,39,colors[2]);e.setAttribute('fill-opacity',.12+c.value/max*.88);text(29+c.column*43,36+c.row*43,`${c.day}:${c.value}`, '#0f172a',9);});}
  else if (kind === 'bullet') {rect(30,65,300,55,'#e2e8f0');rect(30,65,180,55,'#cbd5e1');rect(30,82,output.ratio*300,22,colors[0]);line(30+output.target/output.maximum*300,55,30+output.target/output.maximum*300,130,colors[4],4);text(35,165,`实际 ${output.actual} 目标 ${output.target} 差 ${output.gap}`);}
  else if (kind === 'sparkline' || kind === 'data-zoom') {const ps=chartPoints(output.points||output.visible);poly(ps);ps.forEach((p,n)=>{dot(...p);text(p[0],210,(output.points||output.visible)[n][0]);});text(20,20,kind==='sparkline'?`首尾差 ${output.change}`:`源长度 ${output.sourceCount}`);}
  else if (kind === 'error-bar' || kind === 'range') {const rs=output.intervals,lo=Math.min(0,...rs.map(r=>r.low)),hi=Math.max(1,...rs.map(r=>r.high)),y=v=>185-(v-lo)/(hi-lo)*150;rs.forEach((r,n)=>{const x=70+n*100;line(x,y(r.low),x,y(r.high),colors[0],5);line(x-15,y(r.low),x+15,y(r.low));line(x-15,y(r.high),x+15,y(r.high));dot(x,y(r.value??r.midpoint),6,colors[1]);text(x-25,210,`${r.low}–${r.high}`);});}
  else if (kind === 'polar') {line(70,105,290,105,'#cbd5e1');line(180,10,180,200,'#cbd5e1');output.points.forEach((p,n)=>{line(180,105,180+p.x*2,105-p.y*2,colors[n%6]);dot(180+p.x*2,105-p.y*2,6,colors[n%6]);text(180+p.x*2,100-p.y*2,`${p.angle}°`);});}
  else if (kind === 'legend') {const max=Math.max(1,...output.series.flat());output.series.forEach((s,n)=>{poly(chartPoints(s.map((v,j)=>[j,v]),0,max),'none',colors[output.visible[n]==='A'?0:1]);text(20+n*120,20,output.visible[n],colors[n]);});if(!output.visible.length)text(100,110,'所有系列已隐藏');}
  else if (kind === 'axis') {line(30,180,330,180);output.ticks.forEach((v,n)=>{const x=30+n/(output.ticks.length-1)*300;line(x,175,x,185);text(x,202,v);});output.positions.forEach((p,n)=>dot(30+p*300,80+n*25,6,colors[n%6]));}
  else if (kind === 'map-view') {range(9).forEach(n=>{line(n*45,0,n*45,220,'#e2e8f0',1);line(0,n*30,360,n*30,'#e2e8f0',1);});output.points.forEach((p,n)=>{dot(...p,6,colors[n%6]);text(p[0]+8,p[1],n+1);});line(170,100,190,100,colors[4]);line(180,90,180,110,colors[4]);}
  else if (kind === 'clustering') output.clusters.forEach((c,n)=>{dot(20+c.center[0]*3,195-c.center[1]*2,8+c.count*4,colors[n%6]);text(17+c.center[0]*3,199-c.center[1]*2,c.count,'#fff');});
  else if (kind === 'map-expression' || kind === 'choropleth') {const fs=output.features||output.regions;fs.forEach((f,n)=>{rect(20+n*105,40+(n%2)*25,95,110,f.color||colors[f.band%6],'#fff');text(27+n*105,90+(n%2)*25,`${f.id}:${f.value}`,'#fff');});}
  else if (['route','route-edit','measurement','routing','geofence','spatial-query'].includes(kind)) {
    const ps=output.points||output.path, world=p=>[25+p[0]*3,195-p[1]*1.8];
    if(output.boundary){const b=output.boundary;rect(world([b[0],b[3]])[0],world([b[0],b[3]])[1],(b[2]-b[0])*3,(b[3]-b[1])*1.8,'#dbeafe',colors[0]);}
    if(kind==='route-edit')poly(output.before.map(world),'none','#94a3b8');
    const path=ps.map(world);if(kind!=='spatial-query')poly(kind==='measurement'?[...path,path[0]]:path,kind==='measurement'?'#bfdbfe':'none');
    path.forEach((p,n)=>{dot(...p,6,output.matches?.includes(n)?colors[4]:colors[n%6]);text(p[0]+7,p[1]-7,n);});
  } else if(kind==='camera'){const b=output.bounds,s=output.scale;const factor=Math.min(320/output.width,180/output.height),width=(b[2]-b[0])*s,height=(b[3]-b[1])*s;rect(20,20,output.width*factor,output.height*factor,'#e2e8f0',colors[0]);rect(20+(output.width-width)/2*factor,20+(output.height-height)/2*factor,width*factor,height*factor,'#bfdbfe',colors[1]);text(30,213,`比例 ${s} 中心 ${output.center.join(',')}`);}
  else if(kind==='selection'){const b=output.boundary;rect(20+b[0]*2,15+b[1]*1.6,(b[2]-b[0])*2,(b[3]-b[1])*1.6,'#dbeafe',colors[0]);output.shapes.forEach(s=>{const p=s.bounds;rect(20+p[0]*2,15+p[1]*1.6,(p[2]-p[0])*2,(p[3]-p[1])*1.6,output.selected.includes(s.id)?colors[1]:'#94a3b8');text(25+p[0]*2,30+p[1]*1.6,s.id,'#fff');});}
  else if(kind==='alignment'){input.guides.forEach(x=>line(30+x*2.7,20,30+x*2.7,190,'#cbd5e1'));dot(30+output.before[0]*2.7,110,8,'#94a3b8');dot(30+output.point[0]*2.7,110,6,colors[1]);text(30,210,`参考线 ${output.guide??'未命中'}`);}
  else if(kind==='ruler'){line(20,100,340,100);output.ticks.forEach(t=>{line(20+t.pixel,80,20+t.pixel,110);text(20+t.pixel,70,t.world);});}
  else if(kind==='clipboard'){output.originals.forEach(s=>{rect(30+s.x*2,25+s.y*2,30,25,'#94a3b8');text(30+s.x*2,22+s.y*2,s.id);});output.copies.forEach(s=>{rect(30+s.x*2,25+s.y*2,30,25,colors[0]);text(30+s.x*2,22+s.y*2,s.id);});}
  else if(kind==='shape-editor'){const e=rect(output.x+30,output.y+30,output.width,output.height,'#93c5fd',colors[0]);e.setAttribute('transform',`rotate(${output.rotation} ${output.center[0]+30} ${output.center[1]+30})`);dot(output.center[0]+30,output.center[1]+30,4,colors[1]);text(20,210,`面积 ${output.area}`);}
  else if(kind==='connector'){[output.from,output.to].forEach((b,n)=>rect(20+b[0]*1.5,20+b[1]*1.5,(b[2]-b[0])*1.5,(b[3]-b[1])*1.5,colors[n]));poly(output.points.map(p=>[20+p[0]*1.5,20+p[1]*1.5]),'none',colors[4]);}
  else if(kind==='resizer'){rect(30,30,Math.min(300,output.requested[0]),Math.min(160,output.requested[1]),'none','#94a3b8');rect(30,30,output.size[0],output.size[1],'#bfdbfe',colors[0]);text(20,210,`有效 ${output.size.join('×')}`);}
  else if(kind==='grouping'){output.world.forEach((p,n)=>{rect(20+p.x*2,20+p.y*1.5,30,25,colors[n%6]);text(20+p.x*2,15+p.y*1.5,p.id);});text(20,210,`组偏移 ${output.offset.join(',')}`);}
  else if(kind==='node-validation'){output.nodes.forEach((n,j)=>{rect(20+j*105,60,95,65,n.valid?'#dcfce7':'#fee2e2',n.valid?colors[2]:colors[4]);text(25+j*105,80,n.id);text(25+j*105,100,n.type);text(25+j*105,120,n.valid?'通过':'端口无效');});}
  else if(kind==='edge-validation'||kind==='dependency'||kind==='auto-layout') {
    const positions=output.positions||output.nodes.map((id,n)=>({id,x:n*90,y:n%2*65})), scaleX=Math.max(1,...positions.map(p=>p.x/280)),scaleY=Math.max(1,...positions.map(p=>p.y/100)),p=id=>{const n=positions.find(r=>r.id===id);return[35+n.x/scaleX,55+n.y/scaleY];};
    output.edges.forEach(e=>{const a=p(e[0]),b=p(e[1]);line(...a,...b,output.cyclic?colors[4]:'#64748b');dot(b[0]-(b[0]-a[0])*.2,b[1]-(b[1]-a[1])*.2,3,colors[1]);});positions.forEach(n=>{const q=p(n.id);dot(...q,17,'#dbeafe');text(q[0]-10,q[1]+4,n.id);});
  } else if(kind==='serialization'){output.restored.forEach((n,j)=>{rect(20+n.x*2,20+n.y*2,35,25,colors[j%6]);text(22+n.x*2,37+n.y*2,n.id,'#fff');});text(20,210,`恢复等值 ${output.same}`);}
  else { // Engineering mechanisms use topic-specific structured results and a real event/value trace.
    const trace = output.trace||output.accepted||output.delays||output.outputs||output.events||output.writes||output.batches||output.indexes||output.deliveries||output.ledger||output.attempted||output.entries||output.visible||output.results||output.differences||output.oldestToNewest||output.conflicts||output.readable||output.invalidated||output.ids||output.retried||Object.entries(output).map(([field,value])=>({field,value}));
    const items=Array.isArray(trace)?trace:[],shown=items.slice(0,8);if(!shown.length)text(30,90,'当前结果集合为空');
    shown.forEach((item,n)=>{const y=25+n*23;rect(15,y-14,330,21,n%2?'#e2e8f0':'#f1f5f9');text(22,y+1,`${n+1}. ${typeof item==='object'?JSON.stringify(item):String(item)}`.slice(0,56),'#0f172a',10);});
  }
  return svg;
}

/** Render controls from the real model's input schema; changing any field executes that mechanism. */
export function renderAdvancedDemo(root, definition) {
  const d = typeof definition === 'string' ? advancedDefinitions.find(x => x.knowledgeId === definition) : definition;
  if (!d) fail('未知教学条目');
  root.replaceChildren(); root.dataset.demo = d.kind; root.dataset.knowledgeId = d.knowledgeId;
  const doc = root.ownerDocument, form = element(doc,'form'), fields = element(doc,'div'), result = element(doc,'pre',undefined,{'data-result':'','role':'status','aria-live':'polite'}), visual = element(doc,'div',undefined,{'data-visual':''}), error = element(doc,'p','',{'data-error':'','role':'alert'}), listeners = [], controls = new Map();
  result.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;max-height:360px;overflow:auto;max-width:100%';
  const on = (el,type,fn) => {el.addEventListener(type,fn);listeners.push(()=>el.removeEventListener(type,fn));};
  fields.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px';
  const labels = {a:'系列A',b:'系列B',values:'数值序列',rows:'数据记录',maximum:'量程上限',matrix:'二维数值矩阵',width:'宽度 / 分桶宽',groups:'层级分组',value:'当前值',target:'目标值',start:'起值 / 窗口起点',changes:'增减序列',days:'教学日期强度',actual:'实际值',showA:'显示系列A',showB:'显示系列B',minimum:'下限',steps:'刻度段数',end:'窗口终点',center:'视图中心',scale:'缩放比例',points:'有序坐标点',cell:'聚合网格大小',features:'要素数值',threshold:'条件阈值 / 日志级别',index:'节点索引',replacement:'替换坐标',boundary:'查询边界',path:'运动路径',regions:'区域数值',cuts:'分级阈值',bounds:'拟合边界',height:'高度',padding:'内边距',shapes:'图形集合',moving:'移动坐标',guides:'参考线',tolerance:'吸附容差',origin:'起始世界坐标',step:'刻度步长',count:'数量',offset:'平移偏移',initial:'初始状态',actions:'历史操作序列',x:'横坐标',y:'纵坐标',rotation:'旋转角',from:'起点 / 来源边界',to:'终点 / 目标边界',requested:'请求尺寸',children:'子节点局部坐标',nodes:'节点集合',edges:'有向边集合',gap:'布局间距',via:'正交通道横坐标',times:'事件时刻',interval:'最小执行间隔',entries:'缓存项 / 日志记录',ttl:'有效时长',now:'当前时刻',tag:'失效标签',resource:'资源名称',params:'请求参数',capacity:'缓存容量',accesses:'访问序列',base:'初始间隔 / 合并基线',cap:'等待上限',attempts:'尝试次数',requests:'幂等请求序列',balance:'初始余额',divisor:'除数',version:'当前版本',writes:'写入记录',local:'本地版本',remote:'远端版本',events:'事件序列',left:'左侧记录',right:'右侧记录',current:'当前表单',commands:'命令序列',size:'批次上限',previous:'上次批量状态',retry:'恢复ID',keep:'保留尾部位数',rowHeight:'固定行高',viewport:'可视窗口高度',scroll:'滚动位置',overscan:'预渲染行数',inputs:'待计算输入',quantity:'数量',cents:'单价整数单位',strategy:'注入策略',records:'内存仓储记录',id:'目标ID',action:'仓储动作',name:'更新名称',stock:'可用库存',subscriptions:'主题订阅关系',defaults:'默认配置',overrides:'覆盖配置'};
  Object.entries(d.input).forEach(([key, value]) => {
    const label = element(doc,'label',labels[key]||key), type = typeof value, control = type==='boolean'?element(doc,'input',undefined,{type:'checkbox'}):type==='number'?element(doc,'input',undefined,{type:'number',step:'any'}):type==='string'?element(doc,'input',undefined,{type:'text'}):element(doc,'textarea',undefined,{rows:'3'});
    control.dataset.field=key;control.setAttribute('aria-label',labels[key]||key);control.style.cssText='display:block;width:100%;box-sizing:border-box';
    if(type==='boolean')control.checked=value;else control.value=type==='object'?JSON.stringify(value):String(value);
    controls.set(key,{control,type});label.append(control);fields.append(label);
  });
  const allInput=element(doc,'textarea',undefined,{'aria-label':'完整模型输入','data-input':'',rows:'5'});allInput.value=JSON.stringify(d.input);allInput.style.cssText='width:100%;box-sizing:border-box';
  const details=element(doc,'details'),summary=element(doc,'summary','完整 JSON 输入');details.append(summary,allInput);
  const controlsRow=element(doc,'div'),run=element(doc,'button','运行模型',{type:'submit','data-run':''}),applyJSON=element(doc,'button','运行 JSON 输入',{type:'button','data-run-json':''}),scenario=element(doc,'button','载入对比场景',{type:'button','data-scenario':''}),negative=element(doc,'button','检验负例',{type:'button','data-invalid':''}),reset=element(doc,'button','重置',{type:'button','data-reset':''});
  controlsRow.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin:12px 0';controlsRow.append(run,applyJSON,scenario,negative,reset);
  const read=()=>Object.fromEntries([...controls].map(([key,{control,type}])=>[key,type==='boolean'?control.checked:type==='number'?Number(control.value):type==='object'?JSON.parse(control.value):control.value]));
  const load=input=>{[...controls].forEach(([key,{control,type}])=>{if(type==='boolean')control.checked=input[key];else control.value=type==='object'?JSON.stringify(input[key]):String(input[key]);});allInput.value=JSON.stringify(input);};
  const update=input=>{try{const output=runAdvancedExample(d,input);error.textContent='';root.dataset.valid='true';result.textContent=JSON.stringify(output,null,2);visual.replaceChildren(drawSVG(doc,d.kind.slice(9),input,output));}catch(e){root.dataset.valid='false';error.textContent=`输入错误：${e.message}`;result.textContent=JSON.stringify({error:e.message});visual.replaceChildren();}};
  on(form,'submit',e=>{e.preventDefault();try{const input=read();allInput.value=JSON.stringify(input);update(input);}catch(e){update(null);}});
  on(applyJSON,'click',()=>{try{const input=JSON.parse(allInput.value);update(input);if(root.dataset.valid==='true')load(input);}catch(e){update(null);}});
  on(scenario,'click',()=>{load(d.changed);update(d.changed);});on(negative,'click',()=>update(d.invalidInput));on(reset,'click',()=>{load(d.input);update(d.input);});
  form.append(fields,details,controlsRow);root.append(element(doc,'p',d.mechanism),form,error,visual,result,element(doc,'p',d.limits));update(clone(d.input));
  return ()=>{listeners.forEach(dispose=>dispose());root.replaceChildren();delete root.dataset.demo;delete root.dataset.valid;delete root.dataset.knowledgeId;};
}
