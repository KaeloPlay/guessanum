const main = document.querySelector(".main");
const footer = document.querySelector(".footer");
const scoreEl = document.querySelector("#score");
let score = 0;
const hsEl = document.querySelector("#hs");
let highScore;
let gameReady = false;
let isTransitioning = false;
let first;
let second;
let toGuess;
let guessList = [null, null, null];
const livesEl = document.querySelector("#lives");
let lives;
const startButton = document.querySelector("#startButton");
let buttonColor;

document.addEventListener("DOMContentLoaded", () => {
	buttonColor = getComputedStyle(document.querySelector("#guess0")).backgroundColor;
	buttons("lock");
});

function start() {
	isTransitioning = true;
	
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
		isTransitioning = false;
		buttons("unlock");
	}, 600);
}

function setRandom() {
	gameReady = false
	
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
	}

	const textEl = document.querySelector("#text");
	textEl.innerHTML = `${first} to ${second}`;
	textEl.style.opacity = 1;

	console.log(first, second, toGuess);
	
	setGuess(first, second);
	
	requestAnimationFrame(() => {
		gameReady = true;
	});
	console.log({
		isTransitioning,
		gameReady,
		guessList,
		toGuess
	});
}

function checkInput(index) {
	if (!gameReady) return;
	if (isTransitioning) return;
	
	isTransitioning = true;
	
	let value = guessList[index]
	const clickedButton = document.querySelector(`#guess${index}`);

	if (value !== toGuess) {
		navigator.vibrate(100);
		
		livesEl.style.color = "var(--danger)";
		clickedButton.style.backgroundColor = "var(--danger)";
		clickedButton.style.opacity = 0.25;
		clickedButton.classList.add("disabled");
		
		lives--;
		livesEl.innerHTML = (`Lives left: ${lives}`);
		
		if (lives === 0) {
			navigator.vibrate(300);
			buttons("lock");
			
			main.style.opacity = 0;
			main.style.pointerEvents = "none";
			
			setTimeout(() => {
				resetLives();
				setRandom();
				
				requestAnimationFrame(() => {
					main.style.opacity = 1;
					main.style.pointerEvents = "auto";
					buttons("unlock");
					isTransitioning = false;
				});
			}, 600);
		} else {
			isTransitioning = false;
		}
	} else {
		navigator.vibrate([80, 50, 80]);
		buttons("lock");
		
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
				buttons("unlock");
				isTransitioning = false;
			}, 600);
		}
	}
}

function setGuess(first, second) {
	guessList = [null, null, null];

	let correctIndex = Math.floor(Math.random() * 3);
	guessList[correctIndex] = toGuess;

	for (let i = 0; i < 3; i++) {
		const button = document.querySelector(`#guess${i}`);

		if (guessList[i] === null) {
			let fake;
			do {
				fake = Math.floor(Math.random() * (second - first + 1)) + first;
			} while (fake === toGuess);

			guessList[i] = fake;
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
