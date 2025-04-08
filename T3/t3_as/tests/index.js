import { test } from "../../test.js";

let sum = 0;
for (let i = 0; i < 100; i++) {
  const res = test();
  sum += res.scores[0];
}

console.log(sum);
