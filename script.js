let grid_size = 0;
let win_condition = 0;

const color_green = "#a6ff4d";
const color_red = "#ff6600";
const color_blue = "#33ccff";

class Game {
    status_display;
    is_game_active;
    curr_player;
    game_state;

    constructor() {
        this.status_display = document.querySelector('.status');
        this.is_game_active = true;
        this.curr_player = "X";
        this.game_state = matrix(grid_size, grid_size, " ");
    }

    win_msg = () => `${this.curr_player} won!`;
    draw_msg = () => `It's a draw!`;

    init() {
        document.getElementById('hidestart').style.display = "none";
        var Container = document.getElementsByClassName("grid");
        Container.innerHTML = '';
        let i = 0, j = 0;
        ex_game = new Game();
          
        document.documentElement.style.setProperty("--columns-row", grid_size); 
        for (i = 0; i < grid_size ; i++) { //Cell creation 
            for(j = 0; j < grid_size; j++){
                let div = document.createElement("div");
                div.className = "cell";
                div.id = (i*grid_size)+j;
                div.setAttribute("cell-index", (i*grid_size)+j);
                div.setAttribute("i", i);
                div.setAttribute("j", j);
                let wrapper = document.getElementsByClassName("grid");
                wrapper[0].appendChild(div);
            }
        }
        document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', (e) => { //adding event (click) listeners to every cell
            ex_game.cell_click(e);
            e.stopPropagation();
        }));
        document.getElementById('hidestart').style.display = "block";
    }
    
    change_player(){ 
        if(this.curr_player === "X"){
            this.curr_player = "O";
        } else {
            this.curr_player = "X";
        }
    }

    draw_check(){
        let draw_flag = true, i = 0, j = 0;
        for(i = 0; i < grid_size; i++){
            for(j = 0; j < grid_size; j++){
                if(this.game_state[i][j] === " "){
                    draw_flag = false;
                }
            }
        }
        return draw_flag;
    }

    transform_played_cell(clicked_cell, clicked_cell_i, clicked_cell_j){ //transforming a cell to X/O
        this.game_state[clicked_cell_i][clicked_cell_j] = this.curr_player;
        clicked_cell.innerHTML = this.curr_player;

        if(this.curr_player === "X"){
            document.getElementById((clicked_cell_i*grid_size)+clicked_cell_j).style.backgroundColor = color_red;
        } else if(this.curr_player === "O"){
            document.getElementById((clicked_cell_i*grid_size)+clicked_cell_j).style.backgroundColor = color_blue;
        }
    }

    res_validation(played_cell, played_cell_x, played_cell_y) {
        let i = 0, j = 0, k = 0;
        let win_arr_ids = new Array();
        //let check_arr_colls_size = (2 * win_condition) - 1;
        let arg_i, arg_o, arg_j;
        let check_arr = [[],[],[],[]]

        for(let i = -(win_condition - 1); i < win_condition; i++) {
            let x_check = played_cell_x + i;
            let y_pluscheck = played_cell_y + i;
            let y_minuscheck = played_cell_y - i;

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
            for(let k = 0; k < check_arr[i].length; k++){
                
                let totalProps = check_arr[i].reduce((a, obj) => a + Object.keys(obj).length, 0);
                totalProps /= 2;  
                let curr_x = check_arr[i][k].x;
                let curr_y = check_arr[i][k].y;

                if(this.game_state[curr_y][curr_x] === this.curr_player && totalProps >= win_condition){
                    let cell_id = (grid_size * curr_y) + curr_x;
                    if(win_arr_ids.includes(cell_id) === false) win_arr_ids.push(cell_id);
                    if(win_arr_ids.length === win_condition){
                        this.win_color(win_arr_ids);
                    }
                } else { 
                    win_arr_ids = new Array();
                }
            }
        }

        if(this.draw_check() === false){
            this.change_player();          
        } else {
            this.status_display.innerHTML = this.draw_msg();
        }
    }

    cell_click(clicked_cellEvent){
        const clicked_cell = clicked_cellEvent.target;
        let clicked_cell_i = parseInt(clicked_cell.getAttribute('i'));
        let clicked_cell_j = parseInt(clicked_cell.getAttribute('j'));
        if(this.game_state[clicked_cell_i][clicked_cell_j] !== " " || !this.is_game_active) {
            return;
        }
        this.transform_played_cell(clicked_cell, clicked_cell_i, clicked_cell_j);
        this.res_validation(clicked_cell, clicked_cell_j, clicked_cell_i);
    }

    game_restart(){ // hard reset of the table
        this.is_game_active = true;
        this.curr_player = "X";
        let i = 0, j = 0;
        for(i = 0; i < grid_size; i++){
            for(j = 0; j < grid_size; j++){
                this.game_state[i][j] = " ";
            }
        }
        document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = " ");
        document.querySelectorAll('.cell').forEach(cell => cell.style.backgroundColor = "")
        document.querySelector('.status').innerHTML = " ";
    }

    win_color(win_arr){ //color the winning sequence
        this.is_game_active = false;
        this.status_display.innerHTML = this.win_msg();           
        win_arr.forEach(element => {
            document.getElementById(element).style.backgroundColor = color_green;
        });
        return;
    }
};

let ex_game;
function get_parameters() {
    while(grid_size <= 2 || !Number.isInteger(grid_size) || grid_size >= 1000){
        grid_size = Number(prompt("Table Size:"));
    }
    while(win_condition <= 2 || !Number.isInteger(win_condition) || win_condition > grid_size){
        win_condition = Number(prompt("Win Condition:"));
    }
    ex_game = new Game();
    ex_game.init();
}

// a function to quickly set up the game board (game_state)
// as a 2d array (since js doesnt directly support it)
function matrix(grid_size, cols, defaultValue){
    let arr = [];
    for(let i = 0; i < grid_size; i++){
        arr.push([]);
        arr[i].push(new Array(cols));
        for(var j = 0; j < cols; j++){
          arr[i][j] = defaultValue;
        }
    }
    return arr;
}