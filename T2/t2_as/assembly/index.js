// The entry file of your WebAssembly module.

// 一个贪食蛇程序，输入是一个贪食蛇的位置和一个水果的位置，输出是贪食蛇的下一步移动方向
// 贪食蛇固定长度为4, snake: [x1, y1, x2, y2, x3, y3, x4, y4,] (x1, y1)是蛇头
// 水果位置 fruit: [x, y]
// 输出是一个方向，0: 上, 1: 左, 2: 下, 3: 右
export function greedySnakeMoveBarriers(
  snake, // 8
  fruit, // 2
  barriers // 24
) {
  // -----------------------------------初始化-----------------------------------
  // 8*8的棋盘, 0表示空白, 1表示蛇, 2表示水果, 3表示障碍 , 右为x+, 上为y+
  let board = new Array(9);
  for (let i = 1; i <= 8; i++) {
    board[i] = new Array(9).fill(0);
  }
  // 方向数组
  let dx = [0, 1, 0, -1];
  let dy = [-1, 0, 1, 0];
  let dir = ["下", "右", "上", "左"];
  // 蛇
  for (let i = 0; i < 8; i += 2) {
    board[snake[i]][snake[i + 1]] = 1;
  }
  //水果
  board[fruit[0]][fruit[1]] = 2;
  //障碍
  for (let i = 0; i < barriers.length; i += 2) {
    board[barriers[i]][barriers[i + 1]] = 3;
  }

  // -----------------------------------判断蛇能否循环-------------------------
  let looping = -1;

  var sim = new Array(9); // 模拟棋盘
  for (let i = 1; i <= 8; i++) {
    sim[i] = new Array(9).fill(0);
  }
  //添加障碍
  for (let i = 0; i < barriers.length; i += 2) {
    sim[barriers[i]][barriers[i + 1]] = 1;
  }
  //将死路标记为障碍
  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 8; j++) {
      if (sim[i][j] !== 0) {
        continue;
      }
      let cnt = 0;
      for (let k = 0; k < 4; k++) {
        // 上下左右可走方向个数
        let x = i + dx[k];
        let y = j + dy[k];
        if (x < 1 || x > 8 || y < 1 || y > 8 || sim[x][y] !== 0) {
          continue;
        }
        cnt++;
      }
      if (cnt <= 1) {
        sim[i][j] = 1;
        i = 0;
        break;
      }
    }
  }
  if (sim[snake[0]][snake[1]] != 1) {
    // 蛇头不在死路中
    for (let i = 0; i < 4; i++) {
      let x = snake[0] + dx[i];
      let y = snake[1] + dy[i];
      if (
        x < 1 ||
        x > 8 ||
        y < 1 ||
        y > 8 || //越界
        sim[x][y] !== 0 || //是死路
        (x == snake[2] && y == snake[3]) // 下一步是蛇身
      ) {
        continue;
      }
      looping = (i + 2) % 4;
      break;
    }
  }
  // -----------------------------------bfs-----------------------------------
  // 从水果开始广度有限遍历,尝试找到蛇头
  let head = [fruit[0], fruit[1]];
  let queue = new Array(1);
  queue[0] = head; // 初始化队列

  let visited = new Array(9); // 访问标记
  for (let i = 1; i <= 8; i++) {
    visited[i] = new Array(9).fill(0);
  }
  visited[head[0]][head[1]] = 1; // head置为已访问

  // 广度优先搜索
  while (queue.length > 0) {
    let cur = queue.shift();
    for (let i = 0; i < 4; i++) {
      // 尝试四个方向
      let x = cur[0] + dx[i];
      let y = cur[1] + dy[i];
      if (
        x < 1 || // 越界
        x > 8 ||
        y < 1 ||
        y > 8 ||
        visited[x][y] !== 0 || // 已访问
        board[x][y] === 3 // 障碍
      ) {
        continue;
      }

      // 遇到蛇
      if (board[x][y] === 1) {
        if (x === snake[0] && y === snake[1]) {
          // 遇到的是蛇头,结束
          return i;
        } else if (looping == -1) {
          //遇到蛇身,蛇不能循环,继续寻路
          continue;
        } else {
          // 遇到蛇身,蛇能循环,循环走,很快就能遇到果子
          return looping;
        }
      }

      // 未访问过
      if (visited[x][y] === 0) {
        visited[x][y] = visited[cur[0]][cur[1]] + 1;
        queue.push([x, y]);
      }
    }
  }
  return -1; //没找到路
}
