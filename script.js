let rows = 0;
let win_condition = 0;
const color_green = "#a6ff4d";
const color_red = "#ff6600";
const color_blue = "#33ccff";
class game {
    status_display;
    is_game_active;
    curr_player;
    game_state;

    constructor() {
        this.status_display = document.querySelector('.status');
        this.is_game_active = true;
        this.curr_player = "X";
        this.game_state = matrix(rows, rows, "");
    }
    winmsg = () => `${this.curr_player} won!`;
    drawmsg = () => `its a draw!`;

    cell_played(clicked_cell, clicked_cell_i, clicked_cell_j){
        this.game_state[clicked_cell_i][clicked_cell_j] = this.curr_player;
        clicked_cell.innerHTML = this.curr_player;
        if(this.curr_player === "X"){
            document.getElementById((clicked_cell_i*rows)+clicked_cell_j).style.backgroundColor = color_red;
        } else if(this.curr_player === "O"){
            document.getElementById((clicked_cell_i*rows)+clicked_cell_j).style.backgroundColor = color_blue;
        }
    }
    
    change_player(){
        if(this.curr_player === "X"){
            this.curr_player = "O";
        } else {
            this.curr_player = "X";
        }
    }

    res_validation(played_cell_x, played_cell_y) {
        let round_won = false;
        let win_arr_r = [];
        let win_arr_c = [];
        let win_arr_d = [];
        let win_arr_ad = [];
        let win_arr = [];
        let cons_signs_r = 0;
        let cons_signs_c = 0;
        let cons_signs_d = 0;
        let cons_signs_ad = 0;
        let i = 0, j = 0, k = 0;

        //logika za koloni 
        if(round_won === false) {
            for(i = played_cell_y - (win_condition - 1); i <= played_cell_y + (win_condition - 1); i++) {
                if(i < 0 || i >= rows) {
                    continue;
                }
                if(this.game_state[i][played_cell_x] === this.curr_player) {
                    //console.log("cons_signs_c: " + cons_signs_c + "  i: " + i);
                    cons_signs_c++;
                    let exists = win_arr_c.includes(Number((i*rows) + played_cell_x));
                    if(!exists){
                        win_arr_c.push((i*rows) + played_cell_x);
                    }
                    //console.log(win_arr);
                } else {
                    win_arr_c = [];
                    cons_signs_c = 0;
                }
                if(cons_signs_c === win_condition && win_arr_c.length === win_condition) { 
                    round_won = true;
                    win_arr = win_arr_c;
                    break;
                }
            }
        }

        //logika za redove
        if(round_won === false) {
            for(i = played_cell_x - (win_condition - 1); i <= played_cell_x + (win_condition - 1); i++) {
                if(i < 0 || i >= rows) {
                    continue;
                }
                if(this.game_state[played_cell_y][i] === this.curr_player) {
                    //console.log("cons_signs_r: " + cons_signs_r + "  i: " + i);
                    cons_signs_r++;
                    let exists = win_arr_r.includes(Number((played_cell_y*rows) + i));
                    if(!exists){
                        win_arr_r.push((played_cell_y*rows) + i);
                    }
                    //console.log(win_arr);
                } else {
                    win_arr_r = [];
                    cons_signs_r = 0;
                }
                if(cons_signs_r === win_condition && win_arr_r.length === win_condition) { 
                    round_won = true;
                    win_arr = win_arr_r;
                    break;
                }
            }
        }

        // logika za diagonali
        if(round_won === false) {
            for(i = played_cell_x - (win_condition - 1),
                j = played_cell_y - (win_condition - 1); i <= played_cell_x + (win_condition - 1),
                                                         j <= played_cell_y + (win_condition - 1); 
                                                                                        i++, j++) { 
                if(i < 0 || i >= rows || j < 0 || j >= rows) {
                    continue;
                }
                if(this.game_state[j][i] === this.curr_player) {
                    cons_signs_d++;
                    let exists = win_arr_d.includes(Number((j*rows) + i));
                    if(!exists){
                        win_arr_d.push((j*rows) + i);
                    }
                } else {
                    win_arr_d = [];
                    cons_signs_d = 0;
                }
                if(cons_signs_d === win_condition && win_arr_d.length === win_condition) { 
                    round_won = true;
                    win_arr = win_arr_d;
                    break;
                }
            }
        }

        // logika za antidiagonali
        if(round_won === false) {
            for(i = played_cell_x + (win_condition - 1),
                j = played_cell_y - (win_condition - 1); i >= played_cell_x - (win_condition - 1),
                                                         j <= played_cell_y + (win_condition - 1); 
                                                                                        i--, j++) { 
                if(i < 0 || i >= rows || j < 0 || j >= rows) {
                    continue;
                }
                if(this.game_state[j][i] === this.curr_player) {
                    cons_signs_ad++;
                    let exists = win_arr_ad.includes(Number((j*rows) + i));
                    if(!exists){
                        win_arr_ad.push((j*rows) + i);
                    }
                } else {
                    console.log("cleaning")
                    win_arr_ad = [];
                    cons_signs_ad = 0;
                }
                if(this.curr_player === "X") console.log("i: " + i + "  j: " + j + "  ad:" + cons_signs_ad + "  arr: " + win_arr.length);
                if(cons_signs_ad === win_condition && win_arr_ad.length === win_condition) { 
                    round_won = true;
                    win_arr = win_arr_ad;
                    break;
                }
            }
        }

        if (round_won === true) {
            console.log(win_arr);
            this.status_display.innerHTML = this.winmsg();
            win_arr.forEach(element => {
                document.getElementById(element).style.backgroundColor = color_green;
            });
            this.is_game_active = false;
            return;
        }
        let round_draw = true;
        for(j = 0; j<rows; j++){
            for(k = 0; k<rows; k++){
                if(this.game_state[j][k] == ""){
                    round_draw = false;
                    break;
                }
            }
        }
        if (round_draw == true){
            this.status_display.innerHTML = this.drawmsg();
            this.is_game_active = false;
            return;
        }
        this.change_player();
    }

    cell_click(clicked_cellEvent){
        const clicked_cell = clicked_cellEvent.target;
        let clicked_cell_i = parseInt(clicked_cell.getAttribute('i'));
        let clicked_cell_j = parseInt(clicked_cell.getAttribute('j'));
        if(this.game_state[clicked_cell_i][clicked_cell_j] !== "" || !this.is_game_active) {
            return;
        }
        this.cell_played(clicked_cell, clicked_cell_i, clicked_cell_j);
        this.res_validation(clicked_cell_j, clicked_cell_i);
    }

    game_restart(){
        // console.log(this.game_state)
        this.is_game_active = true;
        this.curr_player = "X";
        let i=0, j=0;
        for(i = 0; i < rows; i++){
            for(j = 0; j < rows; j++){
                this.game_state[i][j] = "";
            }
        }
        document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
        document.querySelectorAll('.cell').forEach(cell => cell.style.backgroundColor = "")
        document.querySelector('.status').innerHTML = "";
    }
};

let ex_game;

function create_grid() {
    document.getElementById('hidestart').style.display = "none";
    var Container = document.getElementsByClassName("grid");
    Container.innerHTML = '';
    while(rows <= 2 || !Number.isInteger(rows)){
        rows = Number(prompt("Table Size:"));
    }
    while(win_condition <= 2 || !Number.isInteger(win_condition)){
        win_condition = Number(prompt("Win Condition:"));
    }
    let i = 0, j = 0;
    ex_game = new game();
      
    document.documentElement.style.setProperty("--columns-row", rows);
    for (i = 0; i < rows ; i++) {
        for(j = 0; j < rows; j++){
            var div = document.createElement("div");
            div.className = "cell";
            div.id = (i*rows)+j;
            div.setAttribute("cell-index", (i*rows)+j);
            div.setAttribute("i", i);
            div.setAttribute("j", j);
            let wrapper = document.getElementsByClassName("grid");
            wrapper[0].appendChild(div);
        }
    }
    document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', (e) => {
        ex_game.cell_click(e);
        e.stopPropagation();
    }));
    document.getElementById('hidestart').style.display = "block";
}

function matrix(rows, cols, defaultValue){
    var arr = [];
    for(var i=0; i < rows; i++){
        arr.push([]);
        arr[i].push(new Array(cols));
        for(var j=0; j < cols; j++){
          arr[i][j] = defaultValue;
        }
    }
    return arr;
}