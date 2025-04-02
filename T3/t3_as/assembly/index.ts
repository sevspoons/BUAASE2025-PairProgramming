// The entry file of your WebAssembly module.

// 贪食蛇决策,每条蛇固定长度为4
export function greedy_snake_step(
  n: i32,
  snake: i32[],
  snake_num: i32,
  snakes: i32[],
  food_num: i32,
  foods: i32[],
  round: i32
): i32 {
  // -------------------------预设参数-------------------------
  // 行进方向: 0: 上(+y), 1: 左(-x), 2: 下(-y), 3: 右(+x)
  const dir = [
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 0],
  ];

  // -------------------------初始化棋盘-------------------------
  // 0: 空地
  let board = new Array<i32[]>(n + 1);
  for (let i = 0; i < n + 1; i++) {
    board[i] = new Array<i32>(n + 1).fill(0);
  }
  // 1: 食物
  for (let i = 0; i < food_num; i++) {
    const x = foods[i * 2];
    const y = foods[i * 2 + 1];
    board[x][y] = 1;
  }
  //2: 障碍, 3: 危险, 4: 危险的果子
  for (let i = 0; i < snake_num; i++) {
    const friend = snakes.slice(i * 8, i * 8 + 8); // 第n条蛇四节身体的坐标
    // 蛇头的可能行进方向会撞头
    for (let j = 0; j < 4; j++) {
      const x = friend[0] + dir[j][0];
      const y = friend[1] + dir[j][1];
      if (x >= 1 && x <= n && y >= 1 && y <= n) {
        if (board[x][y] === 0) {
          board[x][y] = 3; // 普通空地,有危险
        } else {
          board[x][y] = 4; // 有果子,大概率会被吃掉,当作障碍
        }
      }
    }
    // 每条蛇, 除蛇尾外绝对不能去,相当于障碍
    for (let j = 0; j < 3; j++) {
      const x = friend[j * 2];
      const y = friend[j * 2 + 1];
      board[x][y] = 2;
    }
  }
  // 自己的蛇头与第二节身体不能通过
  board[snake[0]][snake[1]] = 2;
  board[snake[2]][snake[3]] = 2;

  // -------------------------检查行进选项-------------------------
  let selection: i32[] = [];
  const back: i32[] = [];
  for (let i = 0; i < 4; i++) {
    const x = snake[0] + dir[i][0];
    const y = snake[1] + dir[i][1];
    if (x >= 1 && x <= n && y >= 1 && y <= n && board[x][y] != 2) {
      if (board[x][y] == 4) {
        // 不是危险区
        back.push(i);
      } else {
        // 不能撞墙和障碍
        selection.push(i);
      }
    }
  }
  if (selection.length == 0) {
    // 走投无路,危险也吃
    selection = back;
  }
  if (selection.length <= 1) {
    return selection.length == 0
      ? 0 // 没有选择,死局,向上一头创思,R.I.P
      : selection[0]; //就一条路,走吧,还选啥
  }

  // -------------------------决策-------------------------
  // 安全了,暂时的
  // 还有超过一个方向可选

  // 暂写: 收益评分
  // 每个果子为中心,中心为1分,均匀向外扩散,每个格子的分数为1/step
  // 每个危险格子为中心,中心为-1分,均匀向外扩散,每个格子的分数为-1/step
  // 选择分数最高的方向
  const fruit_benefit = 1 + round * 0.02;
  const danger_punish = -1;

  let max_score: f64 = -Infinity;
  let max_dir = -1;
  for (let i = 0; i < selection.length; i++) {
    const x = snake[0] + dir[selection[i]][0];
    const y = snake[1] + dir[selection[i]][1];
    let score: f64 = 0;
    // 以x,y为中心,广度优先搜索
    let step = 1;
    let queue: i32[][] = [[x, y]];
    let visited = new Array<i32[]>(n + 1);
    for (let i = 0; i < n + 1; i++) {
      visited[i] = new Array<i32>(n + 1).fill(0);
    }
    visited[x][y] = 1;

    // 广度优先搜索
    while (queue.length > 0) {
      const next_queue: i32[][] = [];
      for (let j = 0; j < queue.length; j++) {
        const point = queue[j];
        let x = point[0];
        let y = point[1];
        if (board[x][y] === 1) {
          // 发现果子
          score += fruit_benefit / step;
        } else if (board[x][y] === 3) {
          //发现危险区
          score += danger_punish / step;
        }
        for (let k = 0; k < 4; k++) {
          const nx = x + dir[k][0];
          const ny = y + dir[k][1];
          if (
            nx >= 1 && // 不能超出边界
            nx <= n &&
            ny >= 1 &&
            ny <= n &&
            board[nx][ny] != 2 && //不能撞墙和障碍
            visited[nx][ny] === 0 //没有访问过
          ) {
            visited[nx][ny] = 1;
            next_queue.push([nx, ny]);
          }
        }
      }
      queue = next_queue;
      step++;
    }

    if (x === 1 || x === n || y === 1 || y === n) {
      // 靠近边界
      score -= 0.5;
    }

    // 更新最高评分
    if (score > max_score) {
      max_score = score;
      max_dir = selection[i];
    }
  }

  return max_dir; // 返回最高评分的方向
}
