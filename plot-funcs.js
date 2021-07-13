let config  = initplot();
let Fs = 44100;
let [x , audio] = createsinwave(Fs);
document.addEventListener('keydown', (event)=> {    
    if (event.key=== 'a'){
        playsound(audio,Fs);
    }
});
function createsinwave(Fs){
    let [contour , sec] = createcontour(Fs);
    let N = Fs*sec;
    let x = [];
    let audio = [];
    let ff = Number(document.getElementById("ff").value);
    let FMs = Number(document.getElementById("FMs").value);
    let FMf = Number(document.getElementById("FMf").value);
    let chor = Number(document.getElementById("chor").value);
    let rand = Number(document.getElementById("rand").value);
    let chord = [1];
    let champ = [1];
    hi = getharmi();
    hf = getharmf();
    hint = interpharm(hi,hf,N,Fs,sec,contour);
    for (var n = 1; n<=7; n++){
        if (n<3){
            var r=0;
        }
        else{
            r = Math.random()*rand-rand/2;
        }

        for (let i = 0; i < N; i++){
            if (n===1){
                audio[i]=0
            }
        x[i] = i/Fs;
        audio[i] = audio[i]+audioinstance(audio[i],x[i],hint[n-1][i],ff,FMs,FMf,r,chor,n,chord,champ);
        }
    }
    for (let i = 0; i < N; i++){
        if (isNaN(audio[i])){
            audio[i] = 0;
        }
    }
    var max = audio.reduce(function(a, b) {
        return Math.max(a, b);
    });
    for (let i = 0; i < N; i++){
        audio[i] = audio[i]/max;
    }
    
    plotdata(x,audio,config);
    plotdata2(x,hint,config);
    return [x , audio];
}
function audioinstance(audio,x,hint,ff,FMs,FMf,r,chor,n,chord,champ){
    for (let k = 1; k<=chord.length; k++){
        audio = audio + champ[k-1]*(Math.sin(2*Math.PI*chord[k-1]*(ff+r-chor)*n*x+FMs*Math.sin(2*Math.PI*FMf*x))+Math.sin(2*Math.PI*chord[k-1]*(ff+r+chor)*n*x+FMs*Math.sin(2*Math.PI*FMf*x)));
    }
    audio = audio*hint/2;

    return audio;
}
function getharmi(){
    var h1 = Number(document.getElementById("myRangei1").value);
    var h2 = Number(document.getElementById("myRangei2").value);
    var h3 = Number(document.getElementById("myRangei3").value);
    var h4 = Number(document.getElementById("myRangei4").value);
    var h5 = Number(document.getElementById("myRangei5").value);
    var h6 = Number(document.getElementById("myRangei6").value);
    var h7 = Number(document.getElementById("myRangei7").value);
    var hi = [h1 , h2 , h3 , h4 , h5 , h6 , h7];
    return hi
}
function getharmf(){
    var h1 = Number(document.getElementById("myRangef1").value);
    var h2 = Number(document.getElementById("myRangef2").value);
    var h3 = Number(document.getElementById("myRangef3").value);
    var h4 = Number(document.getElementById("myRangef4").value);
    var h5 = Number(document.getElementById("myRangef5").value);
    var h6 = Number(document.getElementById("myRangef6").value);
    var h7 = Number(document.getElementById("myRangef7").value);
    var hf = [h1 , h2 , h3 , h4 , h5 , h6 , h7];
    return hf
}
function createcontour(Fs){
    let attack = Number(document.getElementById("attack").value)/1000;
    let decayf = Number(document.getElementById("decay").value)/100;  
    let decays = -Number(document.getElementById("decays").value)/10; 
    let sustain = Number(document.getElementById("sustain").value)/100;
    let release = Number(document.getElementById("release").value)/100;
    let AMs = Number(document.getElementById("AMs").value);
    let AMf = Number(document.getElementById("AMf").value);
    let zer = .01;
    let decay = (decayf-1)/decays;
    let sec=attack+decay+sustain+release+zer;
    let NADSR = [Math.round(Fs*attack) , Math.round(Fs*decay) , Math.round(Fs*sustain) , Math.round(Fs*release) , Math.round(Fs*zer)];
    let N = NADSR[0]+NADSR[1]+NADSR[2]+NADSR[3]+NADSR[4];
    let contour = [];
    let x = [];
    for (let i = 0; i < N; i++){
        x[i] = i/Fs;      
    }
    for (let i = 0; i < NADSR[0]; i++){
        contour[i] = 1/attack*x[i];  
    }
    for (let i = NADSR[0]; i < NADSR[0]+NADSR[1]; i++){
        contour[i] = decays*(x[i]-attack)+1;
    }
    for (let i = NADSR[0]+NADSR[1]; i < NADSR[0]+NADSR[1]+NADSR[2]; i++){
        contour[i] = contour[NADSR[0]+NADSR[1]-1];
    }
    for (let i = NADSR[0]+NADSR[1]+NADSR[2]; i < NADSR[0]+NADSR[1]+NADSR[2]+NADSR[3]; i++){
        contour[i] = -contour[NADSR[0]+NADSR[1]+NADSR[2]-1]/release*(x[i]-(attack+decay+sustain))+contour[NADSR[0]+NADSR[1]+NADSR[2]-1];
    }
    for (let i = NADSR[0]+NADSR[1]+NADSR[2]+NADSR[3]-1; i < NADSR[0]+NADSR[1]+NADSR[2]+NADSR[3]+NADSR[4]; i++){
         contour[i] = 0;
    }
    for (let i = 1; i < N; i++){
        contour[i] = contour[i]*((1-AMs)+AMs*Math.sin(2*Math.PI*AMf*x[i]));
    }
    return [contour , sec];
}
function interpharm(hi,hf,N,Fs,sec,contour){
    hint = [[],[],[],[],[],[],[]];
    let x=[];
    for (let i=1; i<=hi.length; i++){
        for (let j = 0; j<N; j++){
            x[j] = j/Fs;
            hint[i-1][j] = (hf[i-1]-hi[i-1])/sec*x[j]+hi[i-1];
        }
    }
 
    for (let j = 0; j<N; j++){
        let MaxRow = 0;
        for (let i=1; i<=hi.length; i++){
           MaxRow = MaxRow + hint[i-1][j]; 
        }
        for (let i=1; i<=hi.length; i++){
            hint[i-1][j] = contour[j]*hint[i-1][j]/MaxRow; 
         }
    }

    return hint
}
function initplot(){
    let config = {responsive: true}
    return config;
}
function dotm(x1,x2){
    let C = [];
    for (let i= 0; i <= x1.length-1; i++) {
        C[i] = x1[i]*x2[i];
    }
    return C
}
function dotd(x1,x2){
    let D = [];
    for (let i= 0; i <= x1.length-1; i++) {
        D[i] = x1[i]/x2[i];
    }
    return D
}
function dota(x1,x2){
    let A = [];
    for (let i= 0; i <= x1.length-1; i++) {
        A[i] = x1[i]+x2[i];
    }
    return A
}
function dots(x1,x2){
    let S = [];
    for (let i= 0; i <= x1.length-1; i++) {
        S[i] = x1[i]-x2[i];
    }
    return S
}

function plotdata(xdata,ydata,config){
    let trace = {
        x: xdata,
        y: ydata,
        type: 'scatter',
        name: 'scatter1'
        };
    let data = [trace];
    let layout = { 
        title: 'Waveform',
        font: {size: 18},
        showlegend: false
    };
    TESTER = document.getElementById('tester2');
    Plotly.newPlot(TESTER, data, layout, config);
}
function plotdata2(xdata,hint,config){
    TESTER = document.getElementById('tester');

    var traces = [
	{x: xdata, y: hint[0], stackgroup: 'one'},
	{x: xdata, y: hint[1], stackgroup: 'one'},
	{x: xdata, y: hint[2], stackgroup: 'one'},
    {x: xdata, y: hint[3], stackgroup: 'one'},
	{x: xdata, y: hint[4], stackgroup: 'one'},
	{x: xdata, y: hint[5], stackgroup: 'one'},
    {x: xdata, y: hint[6], stackgroup: 'one'},
    
    ];
let layout = { 
    title: 'Harmonic Model',
    font: {size: 18},
    showlegend: false
};
Plotly.newPlot(TESTER, traces, layout, config);

}
function playsound(audio,Fs){
    audio = new Float32Array(audio);
    let context = new AudioContext({sampleRate: Fs});
    let b = new AudioBuffer({length: audio.length, sampleRate: Fs})
    b.copyToChannel(audio, 0, 0);
    let s = new AudioBufferSourceNode(context, {buffer: b})
    s.connect(context.destination)
    s.start()
}
function data(inst){
    if (inst == 'bell'){
        document.getElementById("myRangei1").value = 40;
        document.getElementById("myRangei2").value = 40;
        document.getElementById("myRangei3").value = 0;
        document.getElementById("myRangei4").value = 10;
        document.getElementById("myRangei5").value = 0; 
        document.getElementById("myRangei6").value = 90;
        document.getElementById("myRangei7").value = 3;

        document.getElementById("myRangef1").value = 80;
        document.getElementById("myRangef2").value = 30;
        document.getElementById("myRangef3").value = 0;
        document.getElementById("myRangef4").value = 0;
        document.getElementById("myRangef5").value = 0; 
        document.getElementById("myRangef6").value = 0;
        document.getElementById("myRangef7").value = 0;

        document.getElementById("ff").value = 400;
        document.getElementById("chor").value = .5;
        document.getElementById("rand").value = 30;

        document.getElementById("attack").value = 1;
        document.getElementById("decay").value = 20;  
        document.getElementById("decays").value = 100; 
        document.getElementById("sustain").value = 10;
        document.getElementById("release").value = 200;
        document.getElementById("AMs").value = .2;
        document.getElementById("AMf").value = 4;
        document.getElementById("FMs").value = 0;
        document.getElementById("FMf").value = 0;
    }
    else if (inst == 'spooky'){
        document.getElementById("myRangei1").value = 15;
        document.getElementById("myRangei2").value = 0;
        document.getElementById("myRangei3").value = 0;
        document.getElementById("myRangei4").value = 5;
        document.getElementById("myRangei5").value = 3; 
        document.getElementById("myRangei6").value = 1;
        document.getElementById("myRangei7").value = 0;

        document.getElementById("myRangef1").value = 15;
        document.getElementById("myRangef2").value = 0;
        document.getElementById("myRangef3").value = 0;
        document.getElementById("myRangef4").value = 0;
        document.getElementById("myRangef5").value = 0; 
        document.getElementById("myRangef6").value = 0;
        document.getElementById("myRangef7").value = 0;

        document.getElementById("ff").value = 180;
        document.getElementById("chor").value = 1;
        document.getElementById("rand").value = 30;

        document.getElementById("attack").value = 10;
        document.getElementById("decay").value = 80;  
        document.getElementById("decays").value = 10; 
        document.getElementById("sustain").value = 100;
        document.getElementById("release").value = 100;
        document.getElementById("AMs").value = .1;
        document.getElementById("AMf").value = 6;
        document.getElementById("FMs").value = 2;
        document.getElementById("FMf").value = 1;
    }
    else if (inst == 'whistle'){
        document.getElementById("myRangei1").value = 100;
        document.getElementById("myRangei2").value = 1;
        document.getElementById("myRangei3").value = 1;
        document.getElementById("myRangei4").value = 1;
        document.getElementById("myRangei5").value = 0; 
        document.getElementById("myRangei6").value = 0;
        document.getElementById("myRangei7").value = 0;

        document.getElementById("myRangef1").value = 100;
        document.getElementById("myRangef2").value = 0;
        document.getElementById("myRangef3").value = 0;
        document.getElementById("myRangef4").value = 0;
        document.getElementById("myRangef5").value = 0; 
        document.getElementById("myRangef6").value = 0;
        document.getElementById("myRangef7").value = 0;

        document.getElementById("ff").value = 1300;
        document.getElementById("chor").value = .04;
        document.getElementById("rand").value = 0;

        document.getElementById("attack").value = 50;
        document.getElementById("decay").value = 90;  
        document.getElementById("decays").value = 10; 
        document.getElementById("sustain").value = 100;
        document.getElementById("release").value = 30;
        document.getElementById("AMs").value = .1;
        document.getElementById("AMf").value = 6;
        document.getElementById("FMs").value = 0;
        document.getElementById("FMf").value = 0;
    }
    [x , audio] = createsinwave(Fs)
}
