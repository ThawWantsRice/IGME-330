let audioCtx;

let element, sourceNode, analyserNode, gainNode, treble, bass, distortionNode;


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

// Treble
treble = audioCtx.createBiquadFilter();
treble.type = "highshelf";

// Bass
bass = audioCtx.createBiquadFilter();
bass.type = "lowshelf";

sourceNode.connect(analyserNode);
analyserNode.connect(bass);
bass.connect(treble)
treble.connect(gainNode);
gainNode.connect(audioCtx.destination);

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
    bass.gain.setValueAtTime(value, audioCtx.currentTime);
}

const setTrebleGain = (value) => {
    value = Number(value);
    treble.gain.setValueAtTime(value, audioCtx.currentTime);
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