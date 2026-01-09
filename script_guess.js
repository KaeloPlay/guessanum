const main = document.querySelector(".main");
let isTransitioning = false;
let first;
let second;
let toGuess;
let guessList = [null, null, null];
let randomIndex;
let guessEl;
let livesEl = document.querySelector("#lives");
let lives;
let buttonColor = getComputedStyle(document.querySelector("#guess0")).backgroundColor;

function start() {
	lives = 2;
	livesEl.innerHTML = (`Lives left: ${lives}`);
	
	const startButton = document.querySelector("#startButton");

	setRandom();
	
	startButton.style.opacity = 0;
	startButton.addEventListener("transitionend", () => {
	main.style.opacity = 1;
	main.style.transform = "translateY(0px)";
}, { once: true });
}

function setRandom() {
	first = Math.floor(Math.random() * 25) + 1;
	second = Math.floor(Math.random() * 25) + 1;

	let temp = [first, second].sort((a, b) => a - b);
	first = temp[0];
	second = temp[1];

	toGuess = Number(Math.floor(Math.random() * (second - first + 1)) + first);
	
	lives = 2;
	livesEl.style.color = "var(--text-soft)";
	livesEl.innerHTML = (`Lives left: ${lives}`);
	for (let i = 0; i < 3; i++) {
		guessEl = document.querySelector(`#guess${i}`);
		
		guessEl.style.opacity = 1;
		guessEl.style.backgroundColor = buttonColor;
		guessEl.classList.remove("disabled");
	}

	const textEl = document.querySelector("#text");
	textEl.innerHTML = `${first} to ${second}`;
	textEl.style.opacity = 1;

	console.log(first, second, toGuess);
	
	setGuess(first, second);
}

function checkInput(index) {
	if (isTransitioning) return;
	isTransitioning = true;
	let correct
	let value = guessList[index]
	guessEl = document.querySelector(`#guess${index}`);

	if (value !== toGuess) {
		navigator.vibrate(100);
		
		livesEl.style.color = "var(--danger)";
		guessEl.style.backgroundColor = "var(--danger)";
		guessEl.style.opacity = 0;
		guessEl.classList.add("disabled");
		
		lives--;
		livesEl.innerHTML = (`Lives left: ${lives}`);
		
		if (lives === 0) {
			navigator.vibrate(300);
			
			main.style.opacity = 0;
			main.style.pointerEvents = "none";
			
			setTimeout(() => {
				setRandom();
				
				requestAnimationFrame(() => {
					main.style.opacity = 1;
					main.style.pointerEvents = "auto";
					isTransitioning = false;
				});
			}, 500);
		} else {
			isTransitioning = false;
		}
	} else {
		navigator.vibrate([80, 50, 80]);
		
		confetti({
			particleCount: 130,
			spread: 100,
			origin: { y: 1.3 }
		});
		
		guessEl.style.backgroundColor = "var(--success)";
		
		setTimeout(() => {
			setRandom();
			isTransitioning = false;
		}, 400);
	}
}

function setGuess(first, second) {
	guessList = [null, null, null];

	let correctIndex = Math.floor(Math.random() * 3);
	guessList[correctIndex] = toGuess;

	for (let i = 0; i < 3; i++) {
		guessEl = document.querySelector(`#guess${i}`);

		if (guessList[i] === null) {
			let fake;
			do {
				fake = Math.floor(Math.random() * (second - first + 1)) + first;
			} while (fake === toGuess);

			guessList[i] = fake;
		}

		guessEl.innerHTML = guessList[i];
	}
}