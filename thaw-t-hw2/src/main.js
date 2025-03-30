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
    showEmboss: false,
    showWaveform: false
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/minecraft-soundtrack/01-Key.mp3"
});

let avData;

const jsonLoad = async () => {
    const response = await fetch("./data/av-data.json");
    const data = await response.json();
    avData = data;

    return data;
}

const displayJsonData = () => {
    if (!avData || !avData.audioFiles) {
        console.error("Audio data not available.");
        return;
    }

    const trackSelect = document.querySelector("#trackSelect");
    trackSelect.innerHTML = ""; 

    avData.audioFiles.forEach(track => {
        const option = document.createElement("option");
        option.value = track.file;
        option.textContent = track.name;
        trackSelect.appendChild(option);
    });

    trackSelect.addEventListener("change", updateTrackInfo);

    trackSelect.dispatchEvent(new Event("change"));
};

const updateTrackInfo = () => {
    const trackSelect = document.querySelector("#trackSelect");
    const selectedTrack = avData.audioFiles.find(track => track.file === trackSelect.value);

    const trackInfoDiv = document.querySelector("#trackInfo");
    if (selectedTrack) {
        trackInfoDiv.innerHTML = `
            <p><strong>Track:</strong> ${selectedTrack.name}</p>
            <p><strong>Artist:</strong> ${selectedTrack.meta.artist}</p>
            <p><strong>Album:</strong> ${selectedTrack.meta.album}</p>
            <p><strong>Year:</strong> ${selectedTrack.meta.year}</p>
        `;
    }
};

const init = async () => {
    await jsonLoad(); 
    displayJsonData(); 

    audio.setupWebaudio(DEFAULTS.sound1);
    console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);

    let canvasElement = document.querySelector("canvas"); 
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);

    loop(); 
};

const setupUI = (canvasElement) =>{
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#btn-fs");
  const playButton = document.querySelector("#btn-play");
  const title = document.querySelector("#title");
  title.innerHTML = avData.title;
  const instructions = document.querySelector("#instructions");
  instructions.innerHTML = avData.instructions;
	
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
    let volumeSlider = document.querySelector("#slider-volume");
    let volumeLabel = document.querySelector("#label-volume");

    //add .oninput event to slider
    volumeSlider.oninput = e => {
        //set the gain
        audio.setVolume(e.target.value);
        //update value of label to match value of slider
        volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
        console.log(volumeLabel.innerHTML)
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

    //Looking at this there has to be a better option
    //checkboxes
    const gradientCheckBox = document.querySelector("#cb-gradient");
    const barsCheckBox = document.querySelector("#cb-bars");
    const circlesCheckBox = document.querySelector("#cb-circles");
    const noiseCheckbox = document.querySelector("#cb-noise");
    const invertCheckbox = document.querySelector("#cb-invert");
    const embossCheckbox = document.querySelector("#cb-emboss");
    
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

    let bassSlider = document.querySelector("#slider-bass");
    let bassLabel = document.querySelector("#label-bass");

    bassSlider.oninput = e => {
        audio.setBassGain(e.target.value);
        bassLabel.innerHTML = e.target.value;
    };
    let trebleSlider = document.querySelector("#slider-treble");
    let trebleLabel = document.querySelector("#label-treble");

    trebleSlider.oninput = e => {
        audio.setTrebleGain(e.target.value);
        trebleLabel.innerHTML = e.target.value;
    };

    let visualizationSelect = document.querySelector("#select-visualization");

    visualizationSelect.onchange = e => {
        drawParams.showWaveform = e.target.value === "waveform";
    };

};
} // end setupUI

const loop = () =>{
    canvas.draw(drawParams);

    canvas.updateAndDrawSprites(); 

    setTimeout(loop, 1000 / 60);
};
export {init};