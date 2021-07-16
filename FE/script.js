const color_green = "#a6ff4d";
const color_red = "#ff6600";
const color_blue = "#33ccff";

class Game {
    status_display;
    is_game_active;
    curr_player;  
    game_state;
    grid_size;
    win_condition;

    constructor() {
    }

    set_grid_size(gs) {
        this.grid_size = gs;
        console.log(this.grid_size)
    }

    set_win_condition(wc){
        this.win_condition = wc;
        console.log(this.win_condition)
    }

    win_msg = () => `${this.curr_player} won!`;
    draw_msg = () => `It's a draw!`;

    async init() {
        const res = await fetch('http://localhost:5000/game_initialization', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({gs: this.grid_size, wc: this.win_condition})
      }) 
        const data = await res.json()
        this.game_state = data.gs;
        this.curr_player = data.cp;
        this.is_game_active = data.iga;
        this.status_display = document.querySelector('.status');

        document.getElementById('hidestart').style.display = "none";
        var Container = document.getElementsByClassName("grid");
        Container.innerHTML = '';
        let i = 0, j = 0;
          
        document.documentElement.style.setProperty("--columns-row", this.grid_size); 
        for (i = 0; i < this.grid_size ; i++) { //Cell creation 
            for(j = 0; j < this.grid_size; j++){
                let div = document.createElement("div");
                div.className = "cell";
                div.id = (i*this.grid_size)+j;
                div.setAttribute("class-cell-index", (i*this.grid_size)+j);
                div.setAttribute("class-y", i);
                div.setAttribute("class-x", j);
                let wrapper = document.getElementsByClassName("grid");
                wrapper[0].appendChild(div);
            }
        }
        document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', (e) => { //adding event (click) listeners to every cell
            
            this.transform_cell_and_update(e);
            e.stopPropagation();
        }));
        document.getElementById('hidestart').style.display = "block";
    }

    draw_check(){
        let draw_flag = true, i = 0, j = 0;
        for(i = 0; i < this.grid_size; i++){
            for(j = 0; j < this.grid_size; j++){
                if(this.game_state[i][j] === " "){
                    draw_flag = false;
                }
            }
        }
        return draw_flag;
    }

    transform_cell_and_update(clicked_cellEvent){ //transforming a cell to X/O
        const clicked_cell = clicked_cellEvent.target;
        let win_arr = [], player;
        let clicked_cell_y = parseInt(clicked_cell.getAttribute('class-y'));
        let clicked_cell_x = parseInt(clicked_cell.getAttribute('class-x'));

        if(this.game_state[clicked_cell_y][clicked_cell_x] !== " " || !this.is_game_active) {
            return;
        }
        
        this.game_state[clicked_cell_y][clicked_cell_x] = this.curr_player;
        clicked_cell.innerHTML = this.curr_player;

        fetch('http://localhost:5000/update', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json'
             },
            body: JSON.stringify({
                x: clicked_cell_x,
                y: clicked_cell_y,
                cp: this.curr_player
            })
          }) .then(res => res.json()).then(data => {
            win_arr = data;
            if(win_arr.length === this.win_condition) {
                if(document.getElementById(win_arr[0]).innerHTML === "X"){
                    player = "X"
                } else if (document.getElementById(win_arr[0]).innerHTML === "O"){
                    player = "O"
                }
                this.win_color(win_arr, player);
            }
        }).catch((e) => {
            //empty array return
        });

        if(this.curr_player === "X"){
            document.getElementById((clicked_cell_y*this.grid_size)+clicked_cell_x).style.backgroundColor = color_red;
        } else if(this.curr_player === "O"){
            document.getElementById((clicked_cell_y*this.grid_size)+clicked_cell_x).style.backgroundColor = color_blue;
        }

        if(this.draw_check() === false){
            this.change_player();     
        } else {
            this.status_display.innerHTML = this.draw_msg();
        }
    }


    change_player(){
        if(this.curr_player === "X") {
            this.curr_player = "O";
        } else {
            this.curr_player = "X";
        }
    }

    game_restart(){ // hard reset of the table
        this.is_game_active = true;
        this.curr_player = "X";
        fetch('http://localhost:5000/restart', {
            method: 'GET',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json'
             }
        }).then(res => res.json()).then(data => {
            this.game_state = data;   
        })
        document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = " ");
        document.querySelectorAll('.cell').forEach(cell => cell.style.backgroundColor = "")
        document.querySelector('.status').innerHTML = " ";
    }

    win_color(win_arr, player){ //color the winning sequence
        this.curr_player = player;
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
    let gs, wc;
    while(gs <= 2 || !Number.isInteger(gs) || gs >= 1000){
        gs = Number(prompt("Table Size:"));
    }
    while(wc <= 2 || !Number.isInteger(wc) || wc > gs){
        wc = Number(prompt("Win Condition:"));
    }
    ex_game = new Game();
    console.log(gs + " " + wc)
    ex_game.set_grid_size(gs);
    ex_game.set_win_condition(wc);
    ex_game.init();
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
