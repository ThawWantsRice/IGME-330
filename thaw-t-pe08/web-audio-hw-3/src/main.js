/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!
import * as audio from './audio.js';
import * as utils from './utils.js';
import * as canvas from './canvas.js';

const drawParams = {
    showGradient: true,
    showBars: true,
    showCircles: true,
    showNoise: false,
    showInvert: false,
    showEmboss: false
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});

function init(){
    audio.setupWebaudio(DEFAULTS.sound1);
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
    canvas.setupCanvas(canvasElement,audio.analyserNode);
    loop();
}

function setupUI(canvasElement){
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };
	
    //add .onclick even to button
    playButton.onclick = e => {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    //check if context is in suspended state (autoplay policy)
    if (audio.audioCtx.state == "suspended") {
        audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    if (e.target.dataset.playing == "no") {
        // if track is currently paused, play it
        audio.playCurrentSound();
        e.target.dataset.playing = "yes"; //our css will set the text to "Pause"
    }
    //if track IS playing, pause it
    else {
        audio.pauseCurrentSound();
        e.target.dataset.playing = "no";// our CSS will set the text to "Play"
    }

    // C - hookup volume slider and label
    let volumeSlider = document.querySelector("#volumeSlider");
    let volumeLabel = document.querySelector("#volumeLabel");

    //add .oninput event to slider
    volumeSlider.oninput = e => {
        //set the gain
        audio.setVolume(e.target.value);
        //update value of label to match value of slider
        volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
    };
    // set value of label to match initial value of slider
    volumeSlider.dispatchEvent(new Event("input"));

    //D - hookup track <select>
    let trackSelect = document.querySelector("#trackSelect");
    //add .onchange event to <select>
    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);
        //pause the current track if it is playing
        if (playButton.dataset.playing == "yes") {
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    };

    //checkboxes
    const gradientCheckBox = document.querySelector("#gradientCB");
    const barsCheckBox = document.querySelector("#barsCB");
    const circlesCheckBox = document.querySelector("#circlesCB");
    const noiseCheckbox = document.querySelector("#noiseCB");
    const invertCheckbox = document.querySelector("#invertCB");
    const embossCheckbox = document.querySelector("#embossCB");
    
    gradientCheckBox.checked = drawParams.showGradient;
    barsCheckBox.checked = drawParams.showBars;
    circlesCheckBox.checked = drawParams.showCircles;
    noiseCheckbox.checked = drawParams.showNoise;
    invertCheckbox.checked = drawParams.showInvert;
    embossCheckbox.checked = drawParams.showEmboss;
    
    gradientCheckBox.addEventListener("change", () => {
        drawParams.showGradient = gradientCheckBox.checked;
    });
    
    barsCheckBox.addEventListener("change", () => {
        drawParams.showBars = barsCheckBox.checked;
    });
    
    circlesCheckBox.addEventListener("change", () => {
        drawParams.showCircles = circlesCheckBox.checked;
    });

    noiseCheckbox.addEventListener("change", () => {
        drawParams.showNoise = noiseCheckbox.checked;
    })

    invertCheckbox.addEventListener("change", () => {
        drawParams.showInvert = invertCheckbox.checked;
    })

    embossCheckbox.addEventListener("change", () => {
        drawParams.showEmboss = embossCheckbox.checked;
    })
};
} // end setupUI

function loop(){
    /* NOTE: This is temporary testing code that we will delete in Part II */
        requestAnimationFrame(loop);
        canvas.draw(drawParams);
        // // 1) create a byte array (values of 0-255) to hold the audio data
        // // normally, we do this once when the program starts up, NOT every frame
        // let audioData = new Uint8Array(audio.analyserNode.fftSize/2);
        
        // // 2) populate the array of audio data *by reference* (i.e. by its address)
        // audio.analyserNode.getByteFrequencyData(audioData);
        
        // // 3) log out the array and the average loudness (amplitude) of all of the frequency bins
        //     console.log(audioData);
            
        //     console.log("-----Audio Stats-----");
        //     let totalLoudness =  audioData.reduce((total,num) => total + num);
        //     let averageLoudness =  totalLoudness/(audio.analyserNode.fftSize/2);
        //     let minLoudness =  Math.min(...audioData); // ooh - the ES6 spread operator is handy!
        //     let maxLoudness =  Math.max(...audioData); // ditto!
        //     // Now look at loudness in a specific bin
        //     // 22050 kHz divided by 128 bins = 172.23 kHz per bin
        //     // the 12th element in array represents loudness at 2.067 kHz
        //     let loudnessAt2K = audioData[11]; 
        //     console.log(`averageLoudness = ${averageLoudness}`);
        //     console.log(`minLoudness = ${minLoudness}`);
        //     console.log(`maxLoudness = ${maxLoudness}`);
        //     console.log(`loudnessAt2K = ${loudnessAt2K}`);
        //     console.log("---------------------");
    }

export {init};