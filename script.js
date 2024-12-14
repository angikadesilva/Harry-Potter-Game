let move_speed = 5, grativy = 0.5; // Increased move_speed for faster movement
let harry = document.querySelector('.harry');
let img = document.getElementById('harry-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

// Add background music
let background_music = new Audio('sounds effect/harrypotter.mp3');
background_music.loop = true; 
background_music.volume = 0.2; 

// Mute/Unmute control
let isMuted = false;  
let muteBeforeStart = false; 

// Mute/unmute button functionality
document.getElementById('mute-button').addEventListener('click', function() {
    if (isMuted) {
        this.textContent = '🔊'; 
        if (game_state === 'Play' && !isMuted) {
            background_music.play();
        }
    } else {
        this.textContent = '🔇';  
        background_music.pause();  
    }
    isMuted = !isMuted; // Toggle mute state
    if (game_state === 'Start' && isMuted) {
        muteBeforeStart = true;  
    }
});

// getting harry element properties
let harry_props = harry.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

// Check mute state before starting game
function startGame() {
    document.querySelectorAll('.pipe_sprite').forEach((e) => {
        e.remove();
    });
    img.style.display = 'block';
    harry.style.top = '40vh';
    game_state = 'Play';
    message.innerHTML = '';
    score_title.innerHTML = 'Score : ';
    score_val.innerHTML = '0';
    message.classList.remove('messageStyle');
    
    // Play background music if not muted and if mute was not set before start
    if (!isMuted && !muteBeforeStart) {
        background_music.play();
    }

    play();
}

// Event listener for starting the game
document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && game_state != 'Play') {
        startGame();
    }
});

function play() {
    function move() {
        if (game_state != 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            harry_props = harry.getBoundingClientRect();

            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                if (harry_props.left < pipe_sprite_props.left + pipe_sprite_props.width && harry_props.left + harry_props.width > pipe_sprite_props.left && harry_props.top < pipe_sprite_props.top + pipe_sprite_props.height && harry_props.top + harry_props.height > pipe_sprite_props.top) {
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
                    background_music.pause(); // Stop background music on game over
                    return;
                } else {
                    if (pipe_sprite_props.right < harry_props.left && pipe_sprite_props.right + move_speed >= harry_props.left && element.increase_score == '1') {
                        score_val.innerHTML =+ score_val.innerHTML + 1;
                        sound_point.play();
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let harry_dy = 0;
    function apply_gravity() {
        if (game_state != 'Play') return;
        harry_dy = harry_dy + grativy;
        document.addEventListener('keydown', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                img.src = 'images/Harry.png';
                harry_dy = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                img.src = 'images/Harry.png';
            }
        });

        if (harry_props.top <= 0 || harry_props.bottom >= background.bottom) {
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            background_music.pause(); // Stop background music on game over
            return;
        }
        harry.style.top = harry_props.top + harry_dy + 'px';
        harry_props = harry.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 2; // Reduced pipe_separation to make pipes appear more frequently
    let pipe_gap = 65;

    function create_pipe() {
        if (game_state != 'Play') return;

        if (pipe_seperation > 100) { // Reduced threshold for pipe creation
            pipe_seperation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite);
        }
        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}
