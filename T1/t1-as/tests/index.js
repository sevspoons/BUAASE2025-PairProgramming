import assert from "assert";


import {greedy_snake_fn_checker } from "../../test.js";
import { greedy_snake_move } from "../build/release.js";
// import { greedy_snake_move } from "./t1_rust/pkg/t1_rust.js";

function generateSnakePath() {
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    let iteration = 10;

    while (iteration--) {
        const path = [];
        const visited = new Set();
        
        // 生成初始坐标（范围1到8）
        let x = Math.floor(Math.random() * 8)+1;
        let y = Math.floor(Math.random() * 8)+1;
        
        path.push(x, y);
        visited.add(`${x},${y}`);

        let valid = true;
        
        // 生成后续3个坐标
        for (let i = 0; i < 3; i++) {
            const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
            shuffle(directions);
            let moved = false;

            for (const [dx, dy] of directions) {
                const newX = x + dx;
                const newY = y + dy;
                const coordKey = `${newX},${newY}`;

                if (!visited.has(coordKey) && newX >= 1 && newX <= 8 && newY >= 1 && newY <= 8) {
                    x = newX;
                    y = newY;
                    path.push(x, y);
                    visited.add(coordKey);
                    moved = true;
                    break;
                }
            }

            if (!moved) {
                valid = false;
                break;
            }
        }

        if (valid && path.length === 8) {
            
        }
        //生成一个坐标，不与path中的坐标相同    
        while(true){
            let fruit_x = Math.floor(Math.random() * 8)+1;
            let fruit_y = Math.floor(Math.random() * 8)+1;
            const fruitKey = `${fruit_x},${fruit_y}`;
            if(!visited.has(fruitKey)){
                console.log("path: ", path);
                console.log("fruit: ", [fruit_x,fruit_y]);
                assert.strictEqual(greedy_snake_fn_checker(path, [fruit_x,fruit_y], greedy_snake_move) >= 0, true);
                break;
            }
        }
    }
    console.log("🎉 You have passed all the tests provided by zhuziyu.");
}
console.log("Generating snake path...");
generateSnakePath();