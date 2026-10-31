import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const source=readFileSync(new URL("../p2.js",import.meta.url),"utf8");
const records=new Map([
 ["adFactoryLearning.v8.production",JSON.stringify({done:[1,2,3]})],
 ["adFactoryLearning.v8.practice.missions",JSON.stringify({validation:{done:true}})]
]);
const localStorage={
 getItem:key=>records.get(key)??null,
 setItem:(key,value)=>records.set(key,String(value)),
 removeItem:key=>records.delete(key)
};
const document={
 getElementById:()=>null,
 querySelector:()=>null,
 activeElement:null
};
function load(){
 const window={};
 vm.runInNewContext(source,{window,localStorage,document,console});
 assert.ok(window.V8P2,"P2.1 module missing");
 return window.V8P2;
}
let p2=load();
assert.equal(p2.STORAGE_KEY,"adFactoryLearning.v8.practice.p2.order-list");
assert.equal(p2.orders.length,12);
assert.equal(p2.pageSize,3);
assert.ok(p2.renderOrderList().includes("订单列表完整交互实训"));
assert.ok(p2.renderOrderList().includes("虚构样本"));
assert.ok(!p2.renderOrderList().includes("¥"),"no invented prices in order list");
assert.ok(p2.orders.every(o=>!Object.hasOwn(o,"amount")),"synthetic orders must not contain fabricated amounts");

// Search by customer and order ID.
assert.equal(p2.setQuery("示例客户A").length,2);
assert.deepEqual(Array.from(p2.getState().completedSteps),[1]);
assert.equal(p2.setQuery("P2-1001").length,1);
assert.equal(p2.getPageOrders()[0].id,"P2-1001");

// Status filter and filter-change page reset.
p2.resetForTests();
p2.setStatus("生产中");
assert.equal(p2.getFilteredOrders().length,5);
assert.equal(p2.getState().page,1);
assert.deepEqual(Array.from(p2.getState().completedSteps),[]);
p2.goPage(2);
assert.equal(p2.getPageOrders().length,2);
assert.equal(p2.getState().status,"生产中");
p2.setStatus("待生产");
assert.equal(p2.getState().page,1,"changing status resets page to 1");
assert.equal(p2.getFilteredOrders().length,4);

// Combined filters.
p2.resetForTests();
p2.setQuery("示例客户A");
p2.setStatus("待生产");
assert.equal(p2.getFilteredOrders().length,2);
assert.deepEqual(Array.from(p2.getState().completedSteps),[1,2,3]);
assert.ok(p2.getFilteredOrders().every(o=>o.customer==="示例客户A"&&o.status==="待生产"));

// Reset clears both conditions and returns to page 1.
p2.reset();
assert.equal(p2.getFilteredOrders().length,12);
assert.equal(p2.getState().query,"");
assert.equal(p2.getState().status,"all");
assert.equal(p2.getState().page,1);
assert.deepEqual(Array.from(p2.getState().completedSteps),[1,2,3,4]);

// Pagination, preservation of filters and boundary conditions.
p2.setStatus("生产中");
assert.equal(p2.getState().page,1);
assert.equal(p2.goPage(2),true);
assert.equal(p2.getState().page,2);
assert.equal(p2.getPageOrders().length,2);
assert.equal(p2.getFilteredOrders().length,5);
assert.equal(p2.getState().status,"生产中");
assert.equal(p2.goPage(3),false,"cannot move beyond last page");
assert.equal(p2.goPage(1),true);
assert.equal(p2.getState().page,1);
assert.equal(p2.goPage(0),false,"cannot move before first page");

// Detail selection must be from the current page and close must preserve list state.
p2.goPage(2);
const before=p2.getState();
const selected=p2.getPageOrders()[0];
assert.equal(p2.openDetail(selected.id),true);
assert.equal(p2.getSelectedOrder().id,selected.id);
assert.equal(p2.getSelectedOrder().customer,selected.customer);
assert.equal(p2.closeDetail(),true);
const after=p2.getState();
assert.equal(after.query,before.query);
assert.equal(after.status,before.status);
assert.equal(after.page,before.page);
assert.deepEqual(Array.from(after.completedSteps),[1,2,3,4,5,6]);
assert.equal(p2.getSelectedOrder(),null);
assert.equal(p2.openDetail("P2-1001"),false,"cannot open a row not on the current page");

// Empty result state and safe query rendering.
p2.resetForTests();
assert.equal(p2.setQuery("not-a-real-customer").length,0);
assert.equal(p2.pageCount(),1);
assert.equal(p2.getPageOrders().length,0);
assert.ok(p2.renderOrderList().includes("没有符合条件的模拟订单"));
p2.setQuery("<script>alert(1)</script>");
assert.ok(!p2.renderOrderList().includes("<script>alert(1)</script>"),"query must be HTML escaped");
assert.ok(p2.renderOrderList().includes("&lt;script&gt;"));

// Event delegation for input, select, reset, and pagination.
p2.resetForTests();
assert.equal(p2.handleInput({target:{id:"p2OrderSearch",value:"示例客户A"}}),true);
assert.equal(p2.getFilteredOrders().length,2);
assert.equal(p2.handleInput({target:{id:"p2OrderStatus",value:"待生产"}}),true);
assert.equal(p2.getFilteredOrders().length,2);
let prevented=false;
const handled=p2.handleClick({target:{closest:()=>({dataset:{p2Action:"reset"}})},preventDefault(){prevented=true;}});
assert.equal(handled,true);
assert.equal(prevented,true);
assert.equal(p2.getState().status,"all");
assert.equal(p2.handleClick({target:{closest:()=>null}}),false);

// Refresh persistence and namespace isolation.
p2.setQuery("示例客户A");
p2.setStatus("待生产");
const saved=p2.getState();
p2=load();
assert.equal(p2.getState().query,saved.query);
assert.equal(p2.getState().status,saved.status);
assert.deepEqual(Array.from(p2.getState().completedSteps),Array.from(saved.completedSteps));
assert.equal(records.get("adFactoryLearning.v8.production"),JSON.stringify({done:[1,2,3]}));
assert.equal(records.get("adFactoryLearning.v8.practice.missions"),JSON.stringify({validation:{done:true}}));
assert.ok(records.has(p2.STORAGE_KEY),"P2.1 writes to its own namespace");
console.log("P2.1 QA passed: search, ID lookup, status, combined filters, empty state, reset, pagination, page reset, detail selection/return, event delegation, refresh persistence and storage isolation.");
