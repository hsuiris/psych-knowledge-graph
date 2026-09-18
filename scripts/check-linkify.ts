// 自動連結的邊界情況檢查：npm test
import assert from "node:assert/strict";
import { createLinker, findNodeId } from "../src/lib/linkify";

const ids = (selfId: string, text: string) =>
  createLinker(selfId)(text, (id) => id).filter((_, i) => i % 2 === 1);

// 人名：全名、姓氏都要認得，但別人的全名不能連過去
assert.equal(findNodeId("Aaron T. Beck（憂鬱的認知理論）"), "beck");
assert.equal(findNodeId("佛洛伊德 (Sigmund Freud)"), "freud");
assert.equal(findNodeId("安娜·佛洛伊德 (Anna Freud)"), "anna-freud");
assert.equal(findNodeId("Judith S. Beck"), undefined);
assert.equal(findNodeId("Laura Perls"), undefined);
assert.deepEqual(ids("depression", "由 Beck 編製"), ["beck"]);

// 長詞優先，自己不連自己
assert.deepEqual(ids("transference", "移情與反移情"), ["countertransference"]);
assert.deepEqual(ids("countertransference", "反移情源自移情"), ["transference"]);
assert.deepEqual(ids("depression", "MBCT 延伸自 CBT"), ["mbct", "cbt"]);

// 經典研究的名稱比人名長，要優先比對到研究
assert.deepEqual(ids("depression", "史金納箱"), ["skinner-box"]);
assert.deepEqual(ids("depression", "巴夫洛夫的狗"), ["pavlov-dog"]);
assert.deepEqual(ids("depression", "Watson 與 Rayner 的小艾伯特實驗"), ["watson", "little-albert"]);
assert.equal(findNodeId("Hermann Rorschach"), undefined);

// 英文縮寫要前後斷開
assert.deepEqual(ids("depression", "ACTION"), []);

// 同一個概念只連第一次
assert.deepEqual(ids("depression", "潛意識、潛意識"), ["unconscious"]);

console.log("linkify ok");
