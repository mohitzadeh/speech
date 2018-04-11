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




var audioCtx = new (window.AudioContext ||
  window.mozAudioContext ||
  window.msAudioContext ||
  window.oAudioContext ||
  window.webkitAudioContext)();
var audioCtx2 = new (window.AudioContext ||
  window.mozAudioContext ||
  window.msAudioContext ||
  window.oAudioContext ||
  window.webkitAudioContext)();
  var audioCtx3 = new (window.AudioContext ||
    window.mozAudioContext ||
    window.msAudioContext ||
    window.oAudioContext ||
    window.webkitAudioContext)();

        


//var voiceSelect = document.getElementById("voice");
var source, source2, source3;
var stream, microphoneStream;
var template = document.createElement('audio');
    template.crossOrigin = 'anonymous';

    var template2 = document.createElement('audio');
    template2.crossOrigin = 'anonymous';


var record = document.querySelector('.record');
var baseButton = document.querySelector('#base');
var comparisonButton = document.querySelector('#comparison');


//analyzier 1 for canvas 1 
var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.8;

var distortion = audioCtx.createWaveShaper();
var gainNode = audioCtx.createGain();
var biquadFilter = audioCtx.createBiquadFilter();
var convolver = audioCtx.createConvolver();


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


var analyser3 = audioCtx3.createAnalyser();
analyser3.minDecibels = -90;
analyser3.maxDecibels = -10;
analyser3.smoothingTimeConstant = 0.8;

var distortion3 = audioCtx3.createWaveShaper();
var gainNode3 = audioCtx3.createGain();
var biquadFilter3 = audioCtx3.createBiquadFilter();
var convolver3 = audioCtx3.createConvolver();

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

ajaxRequest = new XMLHttpRequest();

ajaxRequest.open('GET', 'https://speechanalyser.blob.core.windows.net/template/hamed.wav', true);

ajaxRequest.responseType = 'arraybuffer';


// in real situation this will get the template from database
ajaxRequest.onload = function() {
  var audioData = ajaxRequest.response;

  audioCtx.decodeAudioData(audioData, function(buffer) {
    templateBuffer = buffer;
      songLength = buffer.duration;
      
      console.log('ajaex buffer: ', buffer)

        template.src = 'https://speechanalyser.blob.core.windows.net/template/hamed.wav';

         source = audioCtx.createMediaElementSource(template)
         source.connect(analyser);
         console.log('source : ', source)
         analyser.connect(distortion);
         distortion.connect(biquadFilter);
         biquadFilter.connect(convolver);
         convolver.connect(gainNode);
         gainNode.connect(audioCtx.destination);
 // soundSource.loop = true;
 //visualize(analyser, "blue");
    }, function(e){ console.log("Error with decoding audio data" + e.err);});


};

ajaxRequest.send();

function playSound(){
  baseButton.disabled  = true;
  var soundSource
  soundSource = audioCtx.createBufferSource();
  soundSource.buffer = templateBuffer;
  soundSource.playbackRate.value = 1 // playbackControl.value;
    soundSource.connect(audioCtx.destination);
    soundSource.start();
    console.log('ajaex soundSource: ', soundSource)
    template.preload = true;
    template.onended = function(){cancelAnimationFrame(drawVisual); }
 template.play();
 visualize(analyser,1, "blue");
}

ajaxRequest2 = new XMLHttpRequest();

ajaxRequest2.open('GET', 'https://speechanalyser.blob.core.windows.net/template/Comparison1.wav', true);

ajaxRequest2.responseType = 'arraybuffer';


// in real situation this will get the template from database
ajaxRequest2.onload = function() {
  var audioData = ajaxRequest2.response;

  audioCtx3.decodeAudioData(audioData, function(buffer) {
    comparisonBuffer = buffer;
      songLength = buffer.duration;
        template2.src = 'https://speechanalyser.blob.core.windows.net/template/Comparison1.wav';
         source3 = audioCtx3.createMediaElementSource(template2)
         source3.connect(analyser3);
         console.log('source : ', source3)
         analyser3.connect(distortion3);
         distortion3.connect(biquadFilter3);
         biquadFilter3.connect(convolver3);
         convolver3.connect(gainNode3);
         gainNode3.connect(audioCtx3.destination);
         
 // soundSource.loop = true;

    }, function(e){ console.log("Error with decoding audio data" + e.err);});


};

ajaxRequest2.send();

var comparisonDrawn = false;

function play2(){
  var soundSource2;
  comparisonButton.disabled  = true;
  soundSource2 = audioCtx3.createBufferSource();
  soundSource2.buffer = comparisonBuffer;
  soundSource2.playbackRate.value = 1 // playbackControl.value;
    soundSource2.connect(audioCtx3.destination);
    soundSource2.start();
    template2.preload = true;
    template2.onended = function(){cancelAnimationFrame(drawVisual2)}
 template2.play();
 if(comparisonDrawn){
   
 }
 visualize(analyser3,2, "red");
}

//record.onclick = record;

function clearWaves(){
  comparisonButton.disabled  = false;
  baseButton.disabled  = false;
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

function visualize(analyzer, number, color) {

  analyzer.fftSize = 32;
    var bufferLength = 16;
    console.log(bufferLength);
    var dataArray = new Float32Array(bufferLength);
     // 'rgb(0, 0, 0)';
    var x = 100;
  //  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    if(number == 1){
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
          console.log("dataArray[i]: ", dataArray[i])
          canvasCtx.lineTo(x, -1 * dataArray[i]);
          x += 5;
          break
        }
        canvasCtx.stroke();
          
      };
      
    }
      if(number == 2){
        canvasCtx2.lineWidth = 20;
        canvasCtx2.strokeStyle = color;
        canvasCtx2.beginPath();
              var draw = function() {
    
        drawVisual2 = requestAnimationFrame(draw);
  
        analyzer.getFloatFrequencyData(dataArray);
      
        var sliceWidth = WIDTH * 1.0 / bufferLength;
       // canvasCtx.moveTo(50, 50);
        for(var i = 0; i < bufferLength; i++) {
          if(dataArray[i] == -Infinity || -1 * dataArray[i] > 70)
          continue;
          console.log("dataArray[i]: ", dataArray[i])
          canvasCtx2.lineTo(x, -1 * dataArray[i]);
          x += 5;
          break
        }
        canvasCtx2.stroke();
          
      };
    }
    if(number == 3){
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
      
     // canvasCtx.moveTo(x, 120);
    // var draw = function() {
    
    //   drawVisual = requestAnimationFrame(draw);

    //   analyzer.getFloatFrequencyData(dataArray);
   
    //   //console.log('dataArray: ', color, dataArray)

    //   var sliceWidth = WIDTH * 1.0 / bufferLength;
      
    
    //  // canvasCtx.moveTo(50, 50);
    //   for(var i = 0; i < bufferLength; i++) {
    //     if(dataArray[i] == -Infinity || -1 * dataArray[i] > 80)
    //     continue;
    //     console.log("dataArray[i]: ", dataArray[i])
    //     canvasCtx.lineTo(x, -1 * dataArray[i]);
    //     x += 5;
    //     break
    //   }
    //   canvasCtx.stroke();
        
    //   //  arr.push(dataArray[i])
    //  //    console.log(dataArray[i])
    //    // var v = dataArray[i] / 128.0;
    //   //  var y = v * HEIGHT/2;
    // //    arr.push(y)
    //   //  console.log("y: ", dataArray[i])
    //    // console.log("v: ",v)
    //  //  if(x === 0) {
    //    //  canvasCtx.moveTo(x, -1 * dataArray[i]);
    //    //  canvasCtx.lineTo(canvas.width, canvas.height/2);
    //  //  } else {
    //   // if(-1 * dataArray[i] > 75){
    //    // canvasCtx.lineTo(x, -1 * dataArray[i] );

    //  //  }else{

    //   // }
    //    // }

       
    //    //   cancelAnimationFrame(drawVisual)
    //   // canvasCtx.stroke();
      
    //  // canvasCtx.lineTo(canvas.width, canvas.height/2);
    //   //console.log("arr: ", arr)
    
    // };


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
    comparisonButton.disabled  = false;
    baseButton.disabled  = false;
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

            comparisonButton.disabled  = true;
            baseButton.disabled  = true;

           visualize(analyser2,3, "green");
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
//startrecording();
// user vouce
function visualize2() {
 

  analyser2.fftSize = 32;
  var bufferLength = 16;
  console.log(bufferLength);
  var dataArray = new Float32Array(bufferLength);
  
//  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  
    var x = 100;
    canvasCtx2.lineWidth = 2;

    canvasCtx2.beginPath();
    var draw = function() {


      drawVisual2 = requestAnimationFrame(draw);

      analyser2.getFloatFrequencyData(dataArray);
   
     // console.log('dataArray: ', color, dataArray)

      var sliceWidth = WIDTH * 1.0 / bufferLength;
      

     // canvasCtx.moveTo(50, 50);
      for(var i = 0; i < bufferLength; i++) {
        if(dataArray[i] == -Infinity || -1 * dataArray[i] > 60)
           continue;
          // console.log("dataArray[i]: ", dataArray[i])
        
      //  arr.push(dataArray[i])
     //    console.log(dataArray[i])
       // var v = dataArray[i] / 128.0;
      //  var y = v * HEIGHT/2;
    //    arr.push(y)
      //  console.log("y: ", dataArray[i])
       // console.log("v: ",v)
     //  if(x === 0) {
       //  canvasCtx.moveTo(x, -1 * dataArray[i]);
       //  canvasCtx.lineTo(canvas.width, canvas.height/2);
     //  } else {
          canvasCtx2.lineTo(x, -1 * dataArray[i]);
       // }

        x += 5;
        break
       //   cancelAnimationFrame(drawVisual)
      // canvasCtx.stroke();
      }
      
     // canvasCtx.lineTo(canvas.width, canvas.height/2);
      canvasCtx2.stroke();
    };

    draw();

 
  //  canvasCtx2.clearRect(0, 0, WIDTH, HEIGHT);
  //  canvasCtx2.fillStyle = "red";
  //  canvasCtx2.fillRect(0, 0, WIDTH, HEIGHT);


}



