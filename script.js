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
    drawmsg = () => `It's a draw!`;

    init() {
        document.getElementById('hidestart').style.display = "none";
        var Container = document.getElementsByClassName("grid");
        Container.innerHTML = '';
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
        let i = 0, j = 0, k = 0;

        let round_won_obj = {round_won: false};
        let win_arrs = {win_arr_r: [], win_arr_c: [], win_arr_d: [], win_arr_ad: []}
        let cons_signs = {cons_signs_r: 0, cons_signs_c: 0, cons_signs_d: 0, cons_signs_ad: 0};

        //check collumns 
        if(round_won_obj.round_won === false) {
            //loop through (win_condition-1) cells behind and in front of the last played cell
            for(i = played_cell_y - (win_condition - 1); i <= played_cell_y + (win_condition - 1); i++) {
                if(i < 0 || i >= rows) {  //skip iteration if index is out of bounds
                    continue;
                }
                this.check_win('c', cons_signs, win_arrs, round_won_obj, played_cell_x, played_cell_y, i, j);
            }
        }

        //check rows
        if(round_won_obj.round_won === false) {
            for(i = played_cell_x - (win_condition - 1); i <= played_cell_x + (win_condition - 1); i++) {
                if(i < 0 || i >= rows) {
                    continue;
                }
                this.check_win('r', cons_signs, win_arrs, round_won_obj, played_cell_x, played_cell_y, i, j);
            }
        }

        // check all possible diagonals
        if(round_won_obj.round_won === false) {
            for(i = played_cell_x - (win_condition - 1),
                j = played_cell_y - (win_condition - 1); i <= played_cell_x + (win_condition - 1),
                                                         j <= played_cell_y + (win_condition - 1); 
                                                                                        i++, j++) { 
                if(i < 0 || i >= rows || j < 0 || j >= rows) {
                    continue;
                }
                this.check_win('d', cons_signs, win_arrs, round_won_obj, played_cell_x, played_cell_y, i, j);
            }
        }

        // check all possible antidiagonals
        if(round_won_obj.round_won === false) {
            for(i = played_cell_x + (win_condition - 1),
                j = played_cell_y - (win_condition - 1); i >= played_cell_x - (win_condition - 1),
                                                         j <= played_cell_y + (win_condition - 1); 
                                                                                        i--, j++) { 
                if(i < 0 || i >= rows || j < 0 || j >= rows) {
                    continue;
                }
                this.check_win('ad', cons_signs, win_arrs, round_won_obj, played_cell_x, played_cell_y, i, j);
            }
        }

        // if all cells have been played, but there is no
        // winning combination -> draw
        let round_draw = true;
        for(j = 0; j < rows; j++){
            for(k = 0; k < rows; k++){
                if(this.game_state[j][k] === ""){
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
        // hard reset of the table
        this.is_game_active = true;
        this.curr_player = "X";
        let i = 0, j = 0;
        for(i = 0; i < rows; i++){
            for(j = 0; j < rows; j++){
                this.game_state[i][j] = "";
            }
        }
        document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
        document.querySelectorAll('.cell').forEach(cell => cell.style.backgroundColor = "")
        document.querySelector('.status').innerHTML = "";
    }

    check_win(way, signs_object, win_arr_object, round_won_obj, played_cell_x, played_cell_y, i, j){
        let win_arr_func, cons_signs_func, if_arg_1, if_arg_2;
        switch(way){
            case 'r':
                cons_signs_func = signs_object.cons_signs_r;
                win_arr_func = win_arr_object.win_arr_r;
                if_arg_1 = played_cell_y;
                if_arg_2 = i;
                break;
            case 'c':
                cons_signs_func = signs_object.cons_signs_c;
                win_arr_func = win_arr_object.win_arr_c;
                if_arg_1 = i;
                if_arg_2 = played_cell_x;
                break;
            case 'd':
                cons_signs_func = signs_object.cons_signs_d;
                win_arr_func = win_arr_object.win_arr_d;
                if_arg_1 = j;
                if_arg_2 = i;
                break;
            case 'ad':
                cons_signs_func = signs_object.cons_signs_ad;
                win_arr_func = win_arr_object.win_arr_ad;
                if_arg_1 = j;
                if_arg_2 = i;
                break;
        }
        if(this.game_state[if_arg_1][if_arg_2] === this.curr_player) {
            cons_signs_func++;
            let exists = win_arr_func.includes(Number((if_arg_1*rows) + if_arg_2));
            if(!exists){
                win_arr_func.push((if_arg_1*rows) + if_arg_2);
            }
        } else {
            win_arr_func = [];
            cons_signs_func = 0;
        }
        if(win_arr_func.length === win_condition) { 
            round_won_obj.round_won = true;
            this.win_color(win_arr_func);
            return;
        }
    }

    win_color(win_arr){
        this.status_display.innerHTML = this.winmsg();            
        this.is_game_active = false;
        win_arr.forEach(element => {
            document.getElementById(element).style.backgroundColor = color_green;
        });
        return;
    }
};

let ex_game;
function get_parameters() {
    while(rows <= 2 || !Number.isInteger(rows) || rows >= 100){
        rows = Number(prompt("Table Size:"));
    }
    while(win_condition <= 2 || !Number.isInteger(win_condition) || win_condition > rows){
        win_condition = Number(prompt("Win Condition:"));
    }
    ex_game = new game();
    ex_game.init();
}

// a function to quickly set up my game board (game_state)
// as a 2d array (since js doesnt directly support it)
function matrix(rows, cols, defaultValue){
    let arr = [];
    for(let i = 0; i < rows; i++){
        arr.push([]);
        arr[i].push(new Array(cols));
        for(var j = 0; j < cols; j++){
          arr[i][j] = defaultValue;
        }
    }
    return arr;
}