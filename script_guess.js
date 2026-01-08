const main = document.querySelector(".main");
let first;
let second;
let toGuess;
let guessList = [null, null, null];
let randomIndex;
let guessEl;
let livesEl = document.querySelector("#lives");
let lives;

function start() {
	lives = 2;
	
	livesEl.innerHTML = (`Lives left: ${lives}`);
	
	const startButton = document.querySelector("#startButton");

	setRandom();
	
	startButton.style.opacity = 0;
	startButton.addEventListener("transitionend", () => {
	main.style.opacity = 1;
});
}

function setRandom() {
	lives = 2;
		livesEl.innerHTML = (`Lives left: ${lives}`);
	for (let i = 0; i < 3; i++) {
		guessEl = document.querySelector(`#guess${i}`);
		
		guessEl.style.opacity = 1;
	}
	
	first = Math.floor(Math.random() * 25) + 1;
	second = Math.floor(Math.random() * 25) + 1;

	let temp = [first, second].sort((a, b) => a - b);
	first = temp[0];
	second = temp[1];

	toGuess = Number(Math.floor(Math.random() * (second - first + 1)) + first);

	const textEl = document.querySelector("#text");
	textEl.innerHTML = `${first} - ${second}`;
	textEl.style.opacity = 1;

	console.log(first, second, toGuess);
	
	setGuess(first, second);
}

function checkInput(index) {
	let correct
	let value = guessList[(index)]

	correct = (value === toGuess ? "Correct" : "Wrong");
	
	if (correct === "Wrong") {
		guessEl = document.querySelector(`#guess${index}`);
		
		guessEl.style.opacity = 0;
		
		lives = lives - 1;
		livesEl.innerHTML = (`Lives left: ${lives}`);
		
		if (lives === 0) {
			main.style.opacity = 0;
			setRandom()
			main.addEventListener("transitionend", () => {
				main.style.opacity = 1;
			});
		}
	} else {
		alert("Correct!");
		
		confetti({
			particleCount: 130,
			spread: 100,
			origin: { y: 1.3 }
		});
		
		setRandom();
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