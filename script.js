let rows=0;
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
        let win_arr = new Array(rows);
        let i =0, j=0, k =0;
        //logika za koloni
        for(i = 0; i < rows; i++){          
            if(this.game_state[i][played_cell_x] != this.curr_player){
                break; 
            }
            if(i == rows-1){
                for(k = 0; k<rows; k++){
                    win_arr[k] = ((k*rows)+played_cell_x); 
                }
                round_won = true;
            }
        }
        //logika za redove
        for(i = 0; i < rows; i++){
            if(this.game_state[played_cell_y][i] != this.curr_player){
                break;
            }
            if(i == rows-1){
                for(k = 0; k<rows; k++){
                        win_arr[k] = ((played_cell_y*rows)+k); 
                    }
                round_won = true;
            }
        }
        //logika za diagonal
        if(played_cell_x == played_cell_y){
            for(i = 0; i < rows; i++){
                if(this.game_state[i][i] != this.curr_player){
                    break;
                }
                if(i == rows-1){
                    for(k = 0; k<rows; k++){
                        win_arr[k] = ((k*rows)+k); 
                    }
                    round_won = true;
                }
            }
        }
        //logika za antidiagonal
        if(played_cell_x + played_cell_y == rows - 1){
            for(i = 0; i < rows; i++){
                if(this.game_state[i][(rows-1)-i] != this.curr_player){
                    break;
                }
                if(i == rows-1){
                    for(k = 0; k<rows; k++){
                        win_arr[k] = ((k*rows)+(rows-1)-k); 
                    }
                    round_won = true;
                }
            }
        }
        if (round_won == true){
            this.status_display.innerHTML = this.winmsg();
            for(k=0; k<rows; k++){
                document.getElementById(win_arr[k]).style.backgroundColor = color_green;
            }
            this.is_game_active = false;
            console.log(win_arr);
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
    // Creates all lines:
    for(var i=0; i < rows; i++){
        // Creates an empty line
        arr.push([]);
        // Adds cols to the empty line:
        arr[i].push(new Array(cols));
        for(var j=0; j < cols; j++){
          // Initializes:
          arr[i][j] = defaultValue;
        }
    }
    return arr;
}
