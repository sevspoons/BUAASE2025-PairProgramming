// The entry file of your WebAssembly module.

export function greedy_snake_move(snake_pos:i32[],fruit_pos:i32[]) :i32{

  //console.log("fruit_pos:" + fruit_pos[0] + "," + fruit_pos[1]);
  let width:i32= 8;
  //初始化一个8x8二维数组，每一个元素都为-1
  let field = new Array<i32[]>(width);
  for(let i = 0;i < width;i++) {
    field[i] = new Array<i32>(width).fill(-1);
  };

  

  //从fruit_pos开始向周围扩散，直到碰到snake_pos 
  //0:上 1:左 2:下 3:右
  let dx :i32[] = [0,1,0,-1];
  let dy :i32[] = [-1,0,1,0];
  let fruit_x :i32 = fruit_pos[0]-1;
  let fruit_y :i32 = fruit_pos[1]-1;
  let step : i32 = 0;
  //创建一个队列，里面存放的是坐标
  let queue = new Array<i32>(2*width*width);
  queue[0] = fruit_x;
  queue[1] = fruit_y;
  let queue_head:i32 = 0;
  let queue_tail:i32 = 2;
  
  //将蛇的身体所在的位置标记为-2
  field[fruit_pos[0]-1][fruit_pos[1]-1] = -2;
  field[snake_pos[2]-1][snake_pos[3]-1] = -2;
  field[snake_pos[4]-1][snake_pos[5]-1] = -2;
  //field[snake_pos[6]-1][snake_pos[7]-1] = -2;
  //创建一个map，存放一个整数到另一个整数的映射


  let direction:i32 = -2;


  while(queue_head < queue_tail) {
    let x:i32 = queue[queue_head];
    let y:i32 = queue[queue_head+ 1];
    queue_head += 2;
    for(let i:i32 = 0;i < 4;i++) {
      let nx:i32 = x + dx[i];
      let ny:i32 = y + dy[i];
      if(nx >= 0 && nx < width && ny >= 0 && ny < width &&field[nx][ny] == -1) {
        field[nx][ny] = 0;
        if(nx == snake_pos[0]-1 && ny == snake_pos[1]-1) {
          direction = i;
          break;
        }
        queue[queue_tail] = nx;
        queue[queue_tail + 1] = ny;
        queue_tail += 2;
      }
    }
    //step++;
  }



  //console.log(field.toString());
  //console.log(direction.toString());
  return direction;
}
