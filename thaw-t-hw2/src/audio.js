let audioCtx;

let element, sourceNode, analyserNode, gainNode, highshelfFilter, lowshelfFilter, distortionNode;


const DEFAULTS = Object.freeze({
    gain        :       .5,
    numSamples  :       256
});


let audioData = new Uint8Array(DEFAULTS.numSamples/2);


const setupWebaudio = (filePath) =>{

const AudioContext = window.AudioContext || window.webkitAudioContext;
audioCtx = new AudioContext;
element = new Audio();

loadSoundFile(filePath);

sourceNode = audioCtx.createMediaElementSource(element);

analyserNode = audioCtx.createAnalyser();
analyserNode.fftSize = DEFAULTS.numSamples;

gainNode = audioCtx.createGain();
gainNode.gain.value = DEFAULTS.gain;

sourceNode.connect(analyserNode);
analyserNode.connect(gainNode);
gainNode.connect(audioCtx.destination);

// Treble
highshelfFilter = audioCtx.createBiquadFilter();
highshelfFilter.type = "highshelf";
highshelfFilter.frequency.value = 1000; 
highshelfFilter.gain.value = 0; 

// Bass
lowshelfFilter = audioCtx.createBiquadFilter();
lowshelfFilter.type = "lowshelf";
lowshelfFilter.frequency.value = 200;  
lowshelfFilter.gain.value = 0; 

analyserNode.connect(highshelfFilter);
highshelfFilter.connect(lowshelfFilter);
lowshelfFilter.connect(audioCtx.destination);

}
// make sure that it's a Number rather than a String

const loadSoundFile = (filePath) =>{
    element.src = filePath;
}

const playCurrentSound = () =>{
    element.play();
}

const pauseCurrentSound = () =>{
    element.pause();
}

const setVolume = (value) =>{
    value = Number(value); // Make sure that it's a Number rather than a string
    gainNode.gain.value = value;
}

const setBassGain = (value) => {
    value = Number(value);
    lowshelfFilter.gain.setValueAtTime(value, audioCtx.currentTime);
}

const setTrebleGain = (value) => {
    value = Number(value);
    highshelfFilter.gain.setValueAtTime(value, audioCtx.currentTime);
}

export {audioCtx, 
        setupWebaudio, 
        playCurrentSound, 
        pauseCurrentSound, 
        loadSoundFile, 
        setVolume, 
        analyserNode,
        setBassGain,
        setTrebleGain,
    };