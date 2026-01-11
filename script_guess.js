const main = document.querySelector(".main");
const footer = document.querySelector(".footer");
const scoreEl = document.querySelector("#score");
let score = 0;
const hsEl = document.querySelector("#hs");
let highScore;
let first;
let second;
let toGuess;
let guessList = [null, null, null];
const livesEl = document.querySelector("#lives");
let lives;
const startButton = document.querySelector("#startButton");
let buttonColor;
const GameState = {
	IDLE: "idle",
	READY: "ready",
	TRANSITION: "transition"
};
let state = GameState.IDLE;

document.addEventListener("DOMContentLoaded", () => {
	buttonColor = getComputedStyle(document.querySelector("#guess0")).backgroundColor;
	buttons("lock");
});

function start() {
	setState(GameState.TRANSITION);
	
	resetLives();
	
	highScore = Number(localStorage.getItem("hs")) || 0;
	hsEl.innerHTML = (`Highscore: ${highScore}`);
	
	updateScore();
	setRandom();
	
	main.style.opacity = 1;
	footer.style.opacity = 1;
	startButton.style.opacity = 0;
	main.style.transform = "translateY(0px)";
	
	setTimeout(() => {
		requestAnimationFrame(() => {
			setState(GameState.READY);
		});
	}, 600);
}

function setRandom() {
	first = Math.floor(Math.random() * 25) + 1;
	second = Math.floor(Math.random() * 25) + 1;

	let temp = [first, second].sort((a, b) => a - b);
	first = temp[0];
	second = temp[1];

	toGuess = Number(Math.floor(Math.random() * (second - first + 1)) + first);
	
	for (let i = 0; i < 3; i++) {
		const button = document.querySelector(`#guess${i}`);
		
		button.style.opacity = 1;
		button.style.backgroundColor = buttonColor;
		button.classList.remove("wrong");
	}

	const textEl = document.querySelector("#text");
	textEl.innerHTML = `${first} to ${second}`;
	textEl.style.opacity = 1;

	console.log(first, second, toGuess);
	
	setGuess(first, second);
}

function checkInput(index) {
	if (state !== GameState.READY) return;
	
	setState(GameState.TRANSITION);
	
	let value = guessList[index]
	const clickedButton = document.querySelector(`#guess${index}`);

	if (value !== toGuess) {
		navigator.vibrate(100);
		
		livesEl.style.color = "var(--danger)";
		clickedButton.style.backgroundColor = "var(--danger)";
		clickedButton.style.opacity = 0.25;
		clickedButton.classList.add("wrong");
		
		lives--;
		livesEl.innerHTML = (`Lives left: ${lives}`);
		
		if (lives === 0) {
			navigator.vibrate(300);
			
			main.style.opacity = 0;
			
			setTimeout(() => {
				resetLives();
				setRandom();
				
				requestAnimationFrame(() => {
					main.style.opacity = 1;
					setState(GameState.READY);
				});
			}, 600);
		} else {
			setState(GameState.READY);
		}
	} else {
		navigator.vibrate([80, 50, 80]);
		
		resetLives();
		
		try {
			confetti({
				particleCount: 75,
				spread: 80,
				origin: { y: 1.1 }
			});
			
			clickedButton.style.backgroundColor = "var(--success)";
		} finally {
			setTimeout(() => {
				updateScore("add");
				setRandom();
				
				requestAnimationFrame(() => {
					setState(GameState.READY);
				});
			}, 600);
		}
	}
}

function setGuess(first, second) {
	guessList = [null, null, null];

	const correctIndex = Math.floor(Math.random() * 3);
	guessList[correctIndex] = toGuess;

	for (let i = 0; i < 3; i++) {
		const button = document.querySelector(`#guess${i}`);
		
		if (guessList[i] === null) {
			guessList[i] = setRandomExcept(first, second, toGuess);
		}

		button.innerHTML = guessList[i];
	}
}

function buttons(type) {
	for (let i = 0; i < 3; i++) {
		const button = document.querySelector(`#guess${i}`);
		
		if (type === "lock") {
			button.classList.add("disabled");
		} else {
			button.classList.remove("disabled");
		}
	}
}

function resetLives() {
	lives = 2;
	livesEl.style.color = "var(--text-soft)";
	livesEl.innerHTML = (`Lives left: ${lives}`);
}

function updateScore(type) {
	if (type === "add") {
		score += 10;
	};
	
	scoreEl.innerHTML = (`Score: ${score}`);
	
	if (highScore < score) {
		localStorage.setItem("hs", score);
		highScore = score;
		hsEl.innerHTML = (`Highscore: ${highScore}`);
	}
}

function setState(type) {
	if (state === type) return;
	
	if (type === GameState.TRANSITION) {
		main.style.pointerEvents = "none";
		buttons("lock");
	}
	
	if (type === GameState.READY) {
		main.style.pointerEvents = "auto";
		buttons("unlock");
	}
	
	state = type;
	console.log(`STATE: ${type}`)
}

function setRandomExcept(min, max, except) {
	if (min === max) return except;
	
	let value
	do {
		value = Math.floor(Math.random() * (max - min + 1)) + min;
	} while (value === except);
	
	return value;
}
