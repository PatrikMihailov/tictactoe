let rows=0;
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

    res_validation(played_cell_x, played_cell_y){
        let round_won = false;
        let win_arr = [];
        let check_arr = [];
        let cons_signs_r = 0;
        let cons_signs_c = 0;
        let cons_signs_d = 0;
        let cons_signs_ad = 0;
        let i =0, j=0, k =0;
        //logika za koloni
        if(round_won === false){
            for(i = 0; i < rows; i++){
                if(this.game_state[i][played_cell_x] === this.curr_player){
                    let exists = win_arr.includes(Number(((i*rows) + played_cell_x)));
                    if(!exists){
                        cons_signs_c++;
                        if(cons_signs_c > win_condition){
                            break;
                        }
                        win_arr.push((i*rows) + played_cell_x)
                    }
                } else if ((this.game_state[i][played_cell_x] !== this.curr_player || this.game_state[i][played_cell_x] === "") && cons_signs_c !== win_condition){
                    win_arr = [];
                    cons_signs_c = 0;
                }
                if(cons_signs_c === win_condition && win_arr.includes("") === false && win_arr.length === win_condition){ 
                    round_won = true;
                }
            }
        }
        //logika za redove
        if(round_won === false){
            for(i = 0; i < rows; i++){
                if(this.game_state[played_cell_y][i] === this.curr_player){
                    let exists = win_arr.includes(Number(((played_cell_y*rows) + i)));
                    if(!exists){
                        cons_signs_r++;
                        if(cons_signs_r > win_condition){
                            break;
                        }
                        win_arr.push((played_cell_y*rows) + i);
                    }
                } else if ((this.game_state[played_cell_y][i] !== this.curr_player || this.game_state[played_cell_y][i] === "") && cons_signs_r !== win_condition){
                    win_arr = [];
                    cons_signs_r = 0;
                }
                //console.log("win_arr.length: " + win_arr.length + "  win_arr.includes(): " + win_arr.includes(""));
                if(cons_signs_r === win_condition && win_arr.includes("") === false && win_arr.length === win_condition){ 
                    round_won = true;
                }
            }
        }

        // logika za diagonal
        for(i = 0; i < rows; i++) {
            for(j = 0; j < rows; j++) {
                check_arr.push(this.game_state[i][j]);
            }
        }
        
        // console.log(check_arr);

        if(round_won === false){
            // for(i = 0; i < rows; i++){
            //     for(j = 0; j <= rows*rows; j += rows){
            //         console.log("i: " + i + "  j: " + j);
            //         if(check_arr[j] === this.curr_player){
            //             let exists = win_arr.includes(Number(j));
            //             if(!exists){
            //                 cons_signs_d++;
            //                 win_arr.push(j);
            //             } else if (check_arr[j] !== this.curr_player && cons_signs_d !== win_condition){
            //                 win_arr = [];
            //                 cons_signs_d = 0;
            //             } 
            //             if(cons_signs_d === win_condition && win_arr.includes("") === false && win_arr.length === win_condition){ 
            //                 round_won = true;
            //             }
            //         }
            //     }
            // }
            // for(i = 0; i < rows; i++){
            //     for(j = 0; j < rows; j++){
            //         if(this.game_state[i][i+j])
            //     }
            //     if(this.game_state[i][i+played_cell_x] === this.curr_player){
            //         console.log("vliza");
            //         let exists = win_arr.includes(Number((((played_cell_y*rows) + played_cell_x))));
            //         if(!exists){
            //             cons_signs_d++;
            //             win_arr.push((played_cell_y*rows) + played_cell_x);
            //         }
            //     } else if (this.game_state[i][i+played_cell_x] !== this.curr_player && cons_signs_d !== win_condition){
            //         win_arr = [];
            //         cons_signs_d = 0;
            //     }
            //     //console.log("win_arr.length: " + win_arr.length + "  win_arr.includes(): " + win_arr.includes("") + "  cons signs: " + cons_signs_d);
            //     if(cons_signs_d === win_condition && win_arr.includes("") === false && win_arr.length === win_condition){ 
            //         round_won = true;
            //     }
            // }
        }

        // if(round_won === false){
        //     for(i = 0; i < rows; i++){
        //         for(j = played_cell_x; j < rows; j++){
        //             if(this.game_state[i][j] === this.curr_player){    
        //                 cons_signs++;
        //             } else if (this.game_state[i][j] !== this.curr_player && cons_signs !== win_condition){
        //                 for(k = 0; k < win_condition; k++){
        //                     win_arr[k] = "";
        //                 }
        //                 cons_signs = 0;
        //             }
        //         }
                
        //         if(cons_signs === win_condition){ 
        //             for(j = 0, k = 0; k < win_condition; j++, k++){
        //                 if(this.game_state[i][j+played_cell_x] !== ""){
        //                     win_arr[k] = (j*rows) + j;
        //                 } else {
        //                     k--;
        //                 }
        //             }
        //             round_won = true;
        //         }
        //     }
        // }
        //logika za antidiagonal
        // if(round_won == false){
        //     for(i = 0; i < rows; i++){
        //         if(this.game_state[i][(rows-1)-i] === this.curr_player){        
        //             cons_signs++;
        //         } else if (this.game_state[i][(rows-1)-i] !== this.curr_player && cons_signs !== win_condition){
        //             for(k = 0; k < win_condition; k++){
        //                 win_arr[k] = "";
        //             }
        //             cons_signs = 0;
        //         }
        //         if(cons_signs === win_condition){ 
        //             for(j = 0, k = 0; k < win_condition; j++, k++){
        //                 if(this.game_state[j][(rows-1)-j] !== ""){
        //                     win_arr[k] = (j*rows)+(rows-1)-j;
        //                 } else {
        //                     k--;
        //                 }
        //             }
        //             round_won = true;
        //         }
        //     }
        // }
        if (round_won == true){
            console.log(win_arr);
            this.status_display.innerHTML = this.winmsg();
            console.log("nakraq: " + win_arr);
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