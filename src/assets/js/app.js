// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}


// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {

    // First get ahold of the legacy getUserMedia, if present
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}





var audioCtx2 = new (window.AudioContext ||
  window.mozAudioContext ||
  window.msAudioContext ||
  window.oAudioContext ||
  window.webkitAudioContext)();

var source, source2, source3;
var stream, microphoneStream;


    var template2 = document.createElement('audio');
    template2.crossOrigin = 'anonymous';


var record = document.querySelector('.record');
var augButton = document.querySelector('#aug');
var sepButton = document.querySelector('#sep');
var marchButton = document.querySelector('#march');
var octButton = document.querySelector('#oct');
var complexButton = document.querySelector('#complex');

//analyzier 1 for canvas 1 



//analyzier 2 for canvas 2 
var analyser2 = audioCtx2.createAnalyser();
analyser2.minDecibels = -90;
analyser2.maxDecibels = -10;
analyser2.smoothingTimeConstant = 0.8;

// comparison
var distortion2 = audioCtx2.createWaveShaper();
var gainNode2 = audioCtx2.createGain();
var biquadFilter2 = audioCtx2.createBiquadFilter();
var convolver2 = audioCtx2.createConvolver();


// set up canvas context for visualizer 1
var canvas = document.querySelector('.visualizer');
var canvasCtx = canvas.getContext("2d");

var WIDTH = canvas.width;
var HEIGHT = canvas.height;



// set up canvas context for visualizer 2
var canvas2 = document.querySelector('.visualizer');
var canvasCtx2 = canvas2.getContext("2d");

var canvas3 = document.querySelector('.visualizer');
var canvasCtx3 = canvas2.getContext("2d");

var intendedWidth = document.querySelector('.wrapper').clientWidth;

canvas.setAttribute('width',intendedWidth);


canvas2.setAttribute('width',intendedWidth);

canvas3.setAttribute('width',intendedWidth);

var drawVisual, drawVisual2, recordAnimation;


 

// grab audio track via XHR for convolver node

var templateBuffer, comparisonBuffer;
 var audioCtx;
 var template;
 var analyser;
 
 var distortion;
 var gainNode ;
 var biquadFilter ;
 var convolver;

function loadSound(id, name){
   audioCtx = new (window.AudioContext ||
    window.mozAudioContext ||
    window.msAudioContext ||
    window.oAudioContext ||
    window.webkitAudioContext)();

     analyser = audioCtx.createAnalyser();
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.8;
    
     distortion = audioCtx.createWaveShaper();
     gainNode = audioCtx.createGain();
     biquadFilter = audioCtx.createBiquadFilter();
     convolver = audioCtx.createConvolver();

     template = document.createElement('audio');
    template.crossOrigin = 'anonymous';

  ajaxRequest = new XMLHttpRequest();

ajaxRequest.open('GET', 'https://speechanalyser.blob.core.windows.net/template/'+name+'.wav', true);

ajaxRequest.responseType = 'arraybuffer';

ajaxRequest.onload = function() {
  var audioData = ajaxRequest.response;

  audioCtx.decodeAudioData(audioData, function(buffer) {
    templateBuffer = buffer;
      songLength = buffer.duration;
      
      console.log('ajaex buffer: ', buffer)

        template.src = 'https://speechanalyser.blob.core.windows.net/template/'+name+'.wav';
//console.log(template)
         source = audioCtx.createMediaElementSource(template)
         source.connect(analyser);
         console.log('source : ', source)
         analyser.connect(distortion);
         distortion.connect(biquadFilter);
         biquadFilter.connect(convolver);
         convolver.connect(gainNode);
         gainNode.connect(audioCtx.destination);
         playSound(id);
 // soundSource.loop = true;
 //visualize(analyser, "blue");
    }, function(e){ console.log("Error with decoding audio data" + e.err);});


};

ajaxRequest.send();
}

function playSound(id){
 // baseButton.disabled  = true;
  var soundSource
  soundSource = audioCtx.createBufferSource();
  soundSource.buffer = templateBuffer;
  soundSource.playbackRate.value = 1 // playbackControl.value;
    soundSource.connect(audioCtx.destination);
    soundSource.start();
    //console.log('ajaex soundSource: ', soundSource)
    template.preload = true;
    template.onended = function(){cancelAnimationFrame(drawVisual); }
 template.play();
 visualize(analyser,"sample","blue");
}



var comparisonDrawn = false;



function clearWaves(){


  augButton   = false
  sepButton    = false
  marchButton  = false
  octButton    = false
  complexButton = false
  record.disabled  = false;
  if(recordAnimation)
     cancelAnimationFrame(recordAnimation)
  //  mediaRecorder.stop()
  if(microphoneStream){
    var track = microphoneStream.getTracks()[0];  
    if(track)
       track.stop();
  }

       record.id = "";
       record.innerHTML = "Record";
       record.style.color = "white";
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  canvasCtx2.clearRect(0, 0, WIDTH, HEIGHT);
  canvasCtx3.clearRect(0, 0, WIDTH, HEIGHT);
}

function recordVoice(){

  if(record.id === "") {

    record.id = "activated";
    record.innerHTML = "Stop";
  } else {

    record.id = "";
    record.innerHTML = "Record";
  }
}



// template

function visualize(analyzer,type, color) {

  analyzer.fftSize = 32;
    var bufferLength = 16;
    console.log(bufferLength);
    var dataArray = new Float32Array(bufferLength);
     // 'rgb(0, 0, 0)';
    var x = 100;
  //  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    if(type == 'sample'){
      canvasCtx.lineWidth = 20;
      canvasCtx.strokeStyle = color;
      canvasCtx.beginPath();

      var draw = function() {
    
        drawVisual = requestAnimationFrame(draw);
  
        analyzer.getFloatFrequencyData(dataArray);
      
        var sliceWidth = WIDTH * 1.0 / bufferLength;
       // canvasCtx.moveTo(50, 50);
        for(var i = 0; i < bufferLength; i++) {
          if(dataArray[i] == -Infinity || -1 * dataArray[i] > 70)
          continue;
        //  console.log("dataArray[i]: ", dataArray[i])
          canvasCtx.lineTo(x, -1 * dataArray[i]);
          x += 5;
          break
        }
        canvasCtx.stroke();
          
      };
      
    }
     

    if(type == 'record'){
      canvasCtx3.lineWidth = 2;
      canvasCtx3.strokeStyle = color;
      canvasCtx3.beginPath();
            var draw = function() {
  
      recordAnimation = requestAnimationFrame(draw);

      analyzer.getFloatFrequencyData(dataArray);
    
      var sliceWidth = WIDTH * 1.0 / bufferLength;
     // canvasCtx.moveTo(50, 50);
      for(var i = 0; i < bufferLength; i++) {
        if(dataArray[i] == -Infinity || -1 * dataArray[i] > 50)
        continue;
        console.log("dataArray[i]: ", dataArray[i])
        canvasCtx3.lineTo(x, -1 * dataArray[i]);
        x += 5;
        break
      }
      canvasCtx3.stroke();
        
    };
    }
    draw();
      



}
var mediaRecorder ;
function startrecording(){
  if(record.id !== ""){
    cancelAnimationFrame(recordAnimation)
  //  mediaRecorder.stop()
    var track = microphoneStream.getTracks()[0];  
    track.stop();
    record.id = "";
    record.innerHTML = "Record";
    record.style.color = "white";
    record.disabled  = true;
    augButton   = false
    sepButton    = false
    marchButton  = false
    octButton    = false
    complexButton = false
    record.disabled  = false;
    return
  }
  if (navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.');
    var constraints = {audio: true}
    navigator.mediaDevices.getUserMedia (constraints)
       .then(
         function(stream) {
          //  mediaRecorder = new MediaStreamRecorder(stream);
          // mediaRecorder.mimeType = 'audio/wav'; // audio/webm or audio/ogg or audio/wav
          // mediaRecorder.ondataavailable = function (blob) {
          //     // POST/PUT "Blob" using FormData/XHR2
          //     var blobURL = URL.createObjectURL(blob);
          //     console.log(blobURL)
          //   //  document.write('<a href="' + blobURL + '">' + blobURL + '</a>');
          // };
          // mediaRecorder.start(10000);
         console.log("stream: ", stream)
        //  WIDTH = canvas2.width;
        //  HEIGHT = canvas2.height;
            //   canvasCtx2.clearRect(0, 0, WIDTH, HEIGHT);
            // canvasCtx2.fillStyle = "gray";
            // canvasCtx2.fillRect(0, 0, WIDTH, HEIGHT);
            microphoneStream = stream;
           source2= audioCtx2.createMediaStreamSource(stream);
            source2.connect(analyser2);
           analyser2.connect(distortion2);
           distortion2.connect(biquadFilter2);
           biquadFilter2.connect(convolver2);
           convolver2.connect(gainNode2);
            gainNode2.connect(audioCtx2.destination);

            compressor = audioCtx2.createDynamicsCompressor();
            compressor.threshold.value = -50;
            compressor.knee.value = 40;
            compressor.ratio.value = 12;
            compressor.reduction.value = -20;
            compressor.attack.value = 0;
            compressor.release.value = 0.25;
            biquadFilter2.Q.value = 8.30;
            biquadFilter2.frequency.value = 355;
            biquadFilter2.gain.value = 3.0;
            biquadFilter2.type = 'bandpass';
            biquadFilter2.connect(compressor);

           
            augButton   = true
            sepButton    = true
            marchButton  = true
            octButton    = true
            complexButton = true
            record.disabled  = true;

           visualize(analyser2,"record", "green");
          record.style.color = "red"           
            record.id = "activated";
            record.innerHTML = "Stop";
           // voiceChange();
       })
       .catch( function(err) { console.log('The following gUM error occured: ' + err);})
 } else {
    console.log('getUserMedia not supported on your browser!');
 }
}


