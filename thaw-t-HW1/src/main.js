import {randomElement} from "./utils.js"

//Variables
let words1 = [];
let words2 = [];
let words3 = [];

//xhr call data
const loadBabble = () =>{
	const xhr = new XMLHttpRequest();
	xhr.onload = () =>{
		const babble = JSON.parse(xhr.responseText);
		babbleLoaded(babble);
	};
	xhr.open("GET", "./data/babble-data.json", true);
    xhr.send();
}

//Use the data
const babbleLoaded = (data) =>{
	words1 = data.words1;
	words2 = data.words2;
	words3 = data.words3;

	generate(1);

	document.querySelector("#btn-gen-1").addEventListener("click", () => generate(1));
	document.querySelector("#btn-gen-5").addEventListener("click", () => generate(5));
}

//Makes template strings
const generate = (num) =>{
	let outputStr = ``;
	for (let i = 0; i < num; i++) {
		outputStr += `${randomElement(words1)} ${randomElement(words2)} ${randomElement(words3)}!<br>`;
	}
	document.querySelector("#output").innerHTML = outputStr;
}

const innit = () =>{
	loadBabble();
}

innit();