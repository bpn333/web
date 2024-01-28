const sounds = [
    'https://github.com/bipin333/web/blob/master/beat_box/sounds/drum_kick_1.wav?raw=true',
    'https://github.com/bipin333/web/blob/master/beat_box/sounds/snare_2.wav?raw=true',
    'https://github.com/bipin333/web/blob/master/beat_box/sounds/closed_hat_3.wav?raw=true',
    'https://github.com/bipin333/web/blob/master/beat_box/sounds/open_hat_4.wav?raw=true',
    'https://github.com/bipin333/web/blob/master/beat_box/sounds/high_tom_5.wav?raw=true',
    'https://github.com/bipin333/web/blob/master/beat_box/sounds/percussive_6.wav?raw=true',
    'https://github.com/bipin333/web/blob/master/beat_box/sounds/fx_7.wav?raw=true',
    'https://github.com/bipin333/web/blob/master/beat_box/sounds/synth_8.wav?raw=true',
]
var sounds_play_state = []
var start_sound = false
var container = document.getElementById('container');
sounds.forEach(sound =>{
    var row = document.createElement('div');
    row.className = 'row';
    for (let i = 0; i < 8; i++) {
        let box = document.createElement('button')
        box.className = 'box';
        box.setAttribute('total-click','0')
        box.addEventListener('click',()=>{
            let total_clicks = box.getAttribute('total-click');
            if (total_clicks==0){
                box.style.backgroundColor = 'lime';
                box.setAttribute('total-click','1')
            }
            else if (total_clicks==1){
                box.style.backgroundColor = 'orange';
                box.setAttribute('total-click','2')
            }
            else if (total_clicks==2){
                box.style.backgroundColor = 'red';
                box.setAttribute('total-click','3')
            }
            else if (total_clicks==3){
                box.style.backgroundColor = 'blueviolet';
                box.setAttribute('total-click','0')
                remove_sound(sounds.indexOf(sound),i);
                return
            }
            play_sound(sounds.indexOf(sound),i);
            if (!start_sound){
                start_sound = true;
                loop_sound(0)
            }
        });
        row.appendChild(box);
    }
    container.appendChild(row);
})

function play_sound(row,column){
    state = [row,column]
    sounds_play_state.push(state)
}
function remove_sound(row,column){
    sounds_play_state = sounds_play_state.filter(pair => pair[0] !== row || pair[1] !== column);
}

function loop_sound(column){
    active_rows = sounds_play_state.filter(pair => pair[1]==column).map(pair => pair[0])
    console.log(active_rows)
    active_rows.forEach(row =>{
        play(row);
        update_equalizer(column)
    })
    if (column==7){
        column=-1;
    }
    setTimeout(()=>loop_sound(column+1),500);
}
function play(row){
    let tmp = new Audio(sounds[row]);
    tmp.play();
}
function update_equalizer(column){
    for (row=0;row<8;row++){
        let count = 0;
        let bar = document.getElementById('bar'+row);
        for (let item of sounds_play_state) {
            if (item[0] === row && item[1]==column) {
                count++;
            }
        }
        var keyframes = [
            { height: '5px' },
            { height: `${5+count*20}px`}
        ];
        
        var timing = {
            duration: 1000,
            iterations: 1,
            easing: 'ease-out',
            fill: 'auto'
        };
        bar.animate(keyframes,timing);
    }
}
var git = document.querySelectorAll('.title');
git.forEach(g=>{
    g.addEventListener('click',()=>{
        window.location.href = 'https://www.github.com/bipin333'
    })
})