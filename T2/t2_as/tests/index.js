import assert from "assert";
import { greedy_snake_barriers_checker } from "../../test.js";

function test(snake, fruit, barriers, dead = false) {
  if (dead) {
    const res = greedy_snake_barriers_checker(
      snake,
      fruit.length / 2,
      fruit,
      barriers,
      0
    );
    console.log(res);
    assert.strictEqual(res, 1); // 无解
    return;
  }
  const res = greedy_snake_barriers_checker(
    snake,
    fruit.length / 2,
    fruit,
    barriers,
    1
  );
  console.log(res);
  assert.strictEqual(res > 0 || res == -4, true); // 完成或无解
}
//-----------------------无解-----------------------
console.log("无解测试");
test(
  [3, 1, 4, 1, 5, 1, 6, 1],
  [7, 1],
  [2, 2, 3, 2, 2, 3, 1, 3, 8, 7, 7, 7],
  true
);
//-----------------------边缘测试-----------------------
console.log("边缘测试");
// 尾巴暂时堵住路
test([3, 1, 4, 1, 5, 1, 6, 1], [7, 1], [3, 2, 2, 3, 1, 3, 8, 7, 7, 7]);
test([1, 1, 1, 2, 2, 2, 2, 1], [4, 4], [1, 3, 2, 3, 3, 2]);
test([1, 1, 1, 2, 2, 2, 2, 1], [4, 4], [2, 3, 3, 2, 3, 1]);
console.log("边缘测试通过");
//-----------------------随机测试-----------------------
console.log("随机测试");
let round = 0;
while (round-- > 0) {
  const snakeLength = 4;
  const fruitNum = 1;
  const barrierNum = 12;
  // 棋盘记录
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  // 随机生成蛇
  const snake = [];
  // 蛇头
  snake.push(Math.floor(Math.random() * 8 + 1));
  snake.push(Math.floor(Math.random() * 8 + 1));
  board[snake[0]][snake[1]] = 1;
  const dir = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  // 蛇身
  for (let i = 1; i < snakeLength; i++) {
    const last = snake.slice(-2);
    const d = dir[Math.floor(Math.random() * 4)];
    // 不能越界 & 不能重叠
    if (
      last[0] + d[0] < 1 ||
      last[0] + d[0] > 8 ||
      last[1] + d[1] < 1 ||
      last[1] + d[1] > 8 ||
      board[last[0] + d[0]][last[1] + d[1]] != 0
    ) {
      i--;
      continue;
    }
    snake.push(last[0] + d[0]);
    snake.push(last[1] + d[1]);
    board[last[0] + d[0]][last[1] + d[1]] = 1;
  }

  // 随机生成水果
  const fruit = [];
  for (let i = 0; i < fruitNum; i++) {
    let x = Math.floor(Math.random() * 8 + 1);
    let y = Math.floor(Math.random() * 8 + 1);
    // 不能重叠
    if (board[x][y] != 0) {
      i--;
      continue;
    }
    fruit.push(x);
    fruit.push(y);
    board[x][y] = 2;
  }
  // 随机生成障碍
  const barriers = [];
  for (let i = 0; i < barrierNum; i++) {
    let x = Math.floor(Math.random() * 8 + 1);
    let y = Math.floor(Math.random() * 8 + 1);
    // 不能重叠
    if (board[x][y] != 0) {
      i--;
      continue;
    }
    barriers.push(x);
    barriers.push(y);
    board[x][y] = 3;
  }

  test(snake, fruit, barriers);
}
console.log("随机测试通过");
