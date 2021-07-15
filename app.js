const express = require('express')
const app = express()
const cors = require('cors')
const port = 5000

let grid_size, win_condition;
let game_state;
let curr_player = "X";
let last_played_x, last_played_y;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('sh revna ti kazvam')
  })

app.post('/update', (req, res) => {
    curr_player = req.body.cp;
    last_played_x = req.body.x;
    last_played_y = req.body.y;

    game_state[req.body.y][req.body.x] = curr_player;
    console.log(game_state);
    res.send(200);
})

app.post('/game_initialization', (req, res) => {
    grid_size = req.body.gs;
    win_condition = req.body.wc;
    game_state = matrix(grid_size, " ")
    console.log(game_state)
    let obj = {gs: game_state, cp: "X", iga: true}
    res.send(obj)
})

app.post('/res_validation', (req, res) => {
    let win_arr_server = res_validation(last_played_x, last_played_y);
    res.send(win_arr_server)
  })

app.listen(port, () => {
    console.log(`TicTacToe app listening at http://localhost:${port}`)
  })


function res_validation(played_cell_x, played_cell_y){
    let check_arr = [[],[],[],[]]
    for(let i = -(win_condition - 1); i < win_condition; i++) {
        const posHor = {x: played_cell_x + i, y: played_cell_y};
        const posVer = {x: played_cell_x, y: played_cell_y + i};
        const posDiag = {x: played_cell_x + i, y: played_cell_y + i};
        const posADiag = {x: played_cell_x + i, y: played_cell_y - i};
  
        if(posHor.x >= 0 && posHor.x < grid_size && posHor.y >= 0 && posHor.y < grid_size){
            check_arr[0].push(posHor);
        }
        if(posVer.x >= 0 && posVer.x < grid_size && posVer.y >= 0 && posVer.y < grid_size){
            check_arr[1].push(posVer);
        }
        if(posDiag.x >= 0 && posDiag.x < grid_size && posDiag.y >= 0 && posDiag.y < grid_size){
            check_arr[2].push(posDiag);
        }
        if(posADiag.x >= 0 && posADiag.x < grid_size && posADiag.y >= 0 && posADiag.y < grid_size){
            check_arr[3].push(posADiag);
        }
    }
    //CHECKING X-Y VALUES
    for (let i = 0; i < 4; i++) {

        let win_arr_ids = new Array();
        let totalProps = check_arr[i].reduce((a, obj) => a + Object.keys(obj).length, 0);
        totalProps /= 2;  
        
        for(let k = 0; k < check_arr[i].length; k++){
            let curr_x = check_arr[i][k].x;
            let curr_y = check_arr[i][k].y;

            if(game_state[curr_y][curr_x] === curr_player && totalProps >= win_condition){
                let cell_id = (grid_size * curr_y) + curr_x;
                if(win_arr_ids.includes(cell_id) === false) win_arr_ids.push(cell_id);
                
                if(win_arr_ids.length === win_condition){
                    console.log(win_arr_ids)
                    return win_arr_ids;
                }
            } else { 
                win_arr_ids = new Array();
            }
        }
    }
    return;
}
  
function matrix(grid_size, defaultValue){
    let arr = [];
    for(let i = 0; i < grid_size; i++){
        arr.push([]);
        arr[i].push(new Array(grid_size));
        for(var j = 0; j < grid_size; j++){
          arr[i][j] = defaultValue;
        }
    }
    return arr;
}
