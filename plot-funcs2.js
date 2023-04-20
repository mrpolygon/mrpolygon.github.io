let config  = initplot();
let Fs = 2048;
//let [x , audio , audios , ff] = createsinwave(Fs);
function createsinwave(Fs){
    let [contour , sec] = createcontour(Fs);
    let N = Fs;
    let x = [];
    let audio = [];
    let audios = [];
    let ff = Math.floor(Math.random() * 20+10);
    let FMs = 0;
    let FMf = 0;
    let chor = 0;
    let rand = 0;
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
        return Math.max(Math.abs(a), Math.abs(b));
    });
    for (let i = 0; i < N; i++){
        audio[i] = audio[i]/max;
        audios[i] = 0;
    }

    plotdata(x,audio,config);
    //plotdata2(x,hint,config);
    return [x , audio , audios , ff , ];
}
function audioinstance(audio,x,hint,ff,FMs,FMf,r,chor,n,chord,champ){
    for (let k = 1; k<=chord.length; k++){
        audio = audio + champ[k-1]*(Math.sin(2*Math.PI*chord[k-1]*(ff+r-chor)*n*x+FMs*Math.sin(2*Math.PI*FMf*x))+
        Math.sin(2*Math.PI*chord[k-1]*(ff+r+chor)*n*x+FMs*Math.sin(2*Math.PI*FMf*x)));
    }
    audio = audio*hint/2;

    return audio;
}
function getharmi(){
    var h1 = Math.random()*10;
    var h2 = Math.random()*8;
    var h3 = Math.random()*6;
    var h4 = Math.random()*5;
    var h5 = Math.random()*4;
    var h6 = Math.random()*3;
    var h7 = Math.random()*2;
    var hi = [h1 , h2 , h3 , h4 , h5 , h6 , h7];
    return hi
}
function getharmf(){
    var h1 = Math.random()*10;
    var h2 = Math.random()*7;
    var h3 = Math.random()*5;
    var h4 = Math.random()*4;
    var h5 = Math.random()*3;
    var h6 = Math.random()*2;
    var h7 = Math.random()*1;
    var hf = [h1 , h2 , h3 , h4 , h5 , h6 , h7];
    return hf
}
function createcontour(Fs){
    let attack = Math.floor(Math.random() * 100+1)/1000;
    let decayf = Math.floor(Math.random() * 100+10)/100;  
    let decays = -Math.floor(Math.random() * 100+1)/10; 
    let release = Math.floor(Math.random() * 50+1)/100;
    let AMs = 0;
    let AMf = 0;
    let zer = .0;
    let decay = (decayf-1)/decays;
    let sustain = .999 - attack - decay - release;
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
function gensound(Fs){
    [x , audio , audios , ff] = createsinwave(Fs);
}
function modelsound(audio,audios,ff,Fs){
    [yo,afz,t,Gc,Gs,tg]=waveletmodel(audio,audios,Fs,[1],ff,ff*2,[1,2,3,4,5,6,7]);
    plotdata2(t,afz,config);
}

