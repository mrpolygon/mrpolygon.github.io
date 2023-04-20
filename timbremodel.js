/*let fh = [1];
let fd = 1*ff;
let ffl = [1,2];let Fs = 750;
let Tf = 2;
let t=[];
let yic = [];
let yis = [];
let yc1 = [];
let yc2 = [];
for (j=0;j<=Math.round(Tf*Fs)-1;j++){
    yc1[j] = 0;
    yc2[j] = 0;
    yic[j] = 0;
}
for (j=0;j<=Math.round(Tf*Fs)-1;j++){
    t[j] = j/Fs;
    for (let m=1;m<=2;m++){
        if (m==1) {
            yc1[j] = yc1[j]+Math.cos(2*Math.PI*ff*m*t[j])*(-Math.abs(t[j]-1)+1);
            yic[j] = yc1[j]+yic[j]; }
        else {
            yc2[j] = yc2[j]+Math.cos(2*Math.PI*ff*m*t[j])*(Math.sin(2*Math.PI*t[j]/4));
            yic[j] = yc2[j]+yic[j];    
        }
    }
    yis[j] = 0;

[yo,afz,t,Gc,Gs,tg]=waveletmodel(yic,yis,Fs,fh,ff,fd,ffl);
plotdata3(t,afz);
plotdata1(t,yic);
plotdata4(t,yc1,afz);
plotdata5(t,yc2,afz);
}*/
function waveletmodel(yic,yis,Fs,fh,ff,fd,ffl){
    let t = [];
    for (let j=0;j<=yic.length-1;j++){
        t[j] = j/Fs;
    }
    let cn = iht(fh); 
    let K = fh.length-1;
    let fl = [];
    for (let j=0;j<=ffl.length-1;j++){
        fl[j] = ffl[j]*ff;
    }
    let a = fd**2/2;
    let L = fl.length;
    let c = isr(cn,0,1/Math.sqrt(a));
    let r = 1.5; let Tfg = r*2*Math.PI/fd;
    tg = [];
    for (let j=0;j<=Tfg*Fs-1;j++){
        tg[j] = j/Fs - Tfg/2;
    }
    let yo = [];
    let afz = [];
    let P = [];
    for (let j=0;j<=tg.length-1;j++){
        P.push(0);
    }
    for (let k=0;k<=K;k++){
        for (let j=0;j<=tg.length-1;j++){
            P[j] = P[j]+c[k]*tg[j]**k;
        }
    }
    let gc = []; let gs = []; let Gc = []; let Gs = []; let Gm = [];
    let yfc=[]; let yfs = []; let yf = [];
    let Tf = []; let NH = []; let H_t = []; 
    for (let l=1;l<=L;l++){
        console.log(l)
        for (let j=0;j<=tg.length-1;j++){
            gc[j] = Math.exp(-1*(fd*tg[j])**2/2)*Math.cos(2*Math.PI*fl[l-1]*tg[j])*P[j];
            gs[j] = Math.exp(-1*(fd*tg[j])**2/2)*Math.sin(2*Math.PI*fl[l-1]*tg[j])*P[j];
        }
        
        [yfc,yfs] = conv(yic,yis,gc,gs);
        [Gc,Gs] = fft(gc,gs,-1);
        let Ga=[];
        for (let j=0;j<=gc.length-1;j++){
            Ga[j] = Math.sqrt(Gc[j]**2+Gs[j]**2);
        }
        Gm = Ga.reduce(function(a, b) {
            return Math.max(a, b);
        });
        for (let j=0;j<=yfc.length-1;j++){
            yf[j] = 2*yfc[j]/Gm;
        }
        Tf = 1/fl[l-1];
        NH = Math.round(Fs*Tf);
        H_t = []; H_ts = [];
        for (let j=1;j<=NH;j++){
            H_t.push(1);
            H_ts.push(0);
        }
        let yfa = []; let yfas = [];
        for (j=0;j<=yf.length-1;j++){
            yfa[j] = Math.abs(yf[j]);
            yfas[j] = 0;
        }
        let afc = []; let afs = [];
        [afc,afs] = conv(yfa,yfas,H_t,H_ts);
        for (let j=0;j<=afc.length-1;j++){
            afc[j] = afc[j]*Math.PI/2/NH;
        }
        afz.push(afc);
        console.log('complete')
    }
    return [yo,afz,t,Gc,Gs,tg]
}
function iht(fh){
    let K=fh.length-1;
    let r = [];
    for (let j=0;j<=K;j++){
        r[j] = fh[j]/(Math.sqrt(Math.PI)*2**j*factorial(j));
    }
    let c=[];
    for (let j=1;j<=K+1;j++){
        c.push(0);
    }
    for (let k=0;k<=K;k++){
        for (let l=0;l<=Math.floor(k/2);l++){
            c[k-2*l] = c[k-2*l] + r[k]*(factorial(k)*(-1)**l*2**(k-2*l)/factorial(l)/factorial(k-2*l));
        }
    }
    return c
}
function isr(d,t_sh,t_sc){
    let K = d.length-1;
    t_sh = -t_sh;
    for (let j=0;j<=K;j++){
        d[j] = d[j]/t_sc**j;
    }
    let c=[];
    for (let j=1;j<=K+1;j++){
        c.push(0);
    }
    for (let k=0;k<=K;k++){
        for (l=0;l<=k;l++){
            c[l] = c[l] + d[k]*binom(k,l)*t_sh**(k-l);
        }
    }
    return c;
}
function factorial(num) {
    if (num < 0) 
          return -1;
    else if (num == 0) 
        return 1;
      else {
          return (num * factorial(num - 1));
      }
}
function binom(n,k){
    let X = factorial(n)/factorial(k)/factorial(n-k);
    return X;
}
function conv(t1c,t1s,t2c,t2s){
    let y1c = []; let y1s = []; let y2c = []; let y2s = [];
    let y3c = []; let y3s = [];
    let N = t1c.length; let M = t2c.length;
    for (let j=0;j<=N-1;j++){
        y1c.push(t1c[j]);
        y1s.push(t1s[j]);
    }
    for (let j=0;j<=M-1;j++){
        y2c.push(t2c[j]);
        y2s.push(t2s[j]);
    }
    while (y1c.length<N+M-1){
        y1c.push(0);
        y1s.push(0);
    }
    while (y2c.length<N+M-1){
        y2c.push(0);
        y2s.push(0);
    }
    let [Y1c,Y1s] = fft(y1c,y1s,-1);
    let [Y2c,Y2s] = fft(y2c,y2s,-1);
    let Y3c = dots(dotm(Y1c,Y2c),dotm(Y1s,Y2s));
    let Y3s = dota(dotm(Y1c,Y2s),dotm(Y1s,Y2c));
    [y3c,y3s] = fft(Y3c,Y3s,1);
    y3c = y3c.slice(Math.floor(M/2),y3c.length-Math.ceil(M/2)+1);
    y3s = y3s.slice(Math.floor(M/2),y3s.length-Math.ceil(M/2)+1);
    return [y3c,y3s]
}
function plotdata3(xdata,afz){
    TESTER = document.getElementById('tester2');
    //var traces = [];
    let trace = {
        x: xdata,
        y: afz[0],
        stackgroup: 'one',
        name: '$A_{1}(t)$'
        };
        let trace2 = {
            x: xdata,
            y: afz[1],
            stackgroup: 'one',
            name: '$A_{2}(t)$'
        };
        let data = [trace , trace2];
    // for (j=0;j<=ffl.length-1;j++){
        // traces.push({x: xdata, y: afz[j], name: '$A_{1}(t)$', stackgroup: 'one'})
    //}

let layout = { 
    title: 'Harmonic Model',
    font: {size: 18},
    xaxis: {
        title: {
          text: '$t$'
        }
    },
    yaxis: {
        title: {
          text: 'Amplitude'
        }
    },
    showlegend: true
};
let config = {responsive: true}
Plotly.newPlot(TESTER, data, layout, config);

}