function plotdata(xdata,ydata,ydata2){
    let trace = {
        x: xdata,
        y: ydata,
        type: 'scatter',
        name: 'yc'
        };
        let trace2 = {
            x: xdata,
            y: ydata2,
            type: 'scatter',
            name: 'ys'
        };
    let data = [trace , trace2];
    let layout = { 
        title: 'Time Domain',
        font: {size: 18},
    };
    let config = {responsive: true}
    TESTER = document.getElementById('tester');
    Plotly.newPlot(TESTER, data, layout, config);
}
function plotdata1(xdata,ydata){
    let trace = {
        x: xdata,
        y: ydata,
        type: 'scatter',
        name: ' $s(t)$'
        };
    let data = [trace];
    let layout = { 
        title: 'Sampled Musical Sound',
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
        font: {size: 18},
        showlegend: true
    };
    let config = {responsive: true}
    TESTER = document.getElementById('tester');
    Plotly.newPlot(TESTER, data, layout, config);
}
function plotdata2(xdata,ydata,ydata2){
    let trace = {
        x: xdata,
        y: ydata,
        type: 'scatter',
        name: 'Yc'
        };
    let trace2 = {
        x: xdata,
        y: ydata2,
        type: 'scatter',
        name: 'Ys'
    };
    let data = [trace , trace2];
    let layout = { 
        title: 'Frequency Domain',
        font: {size: 18}
       
    };
    let config = {responsive: true}
    TESTER2 = document.getElementById('tester2');
    Plotly.newPlot(TESTER2, data, layout, config);
}
function plotdata4(xdata,ydata,ydata2){
    let trace = {
        x: xdata,
        y: ydata,
        type: 'scatter',
        name: '$r_{1}(t)$'
        };
        let trace2 = {
            x: xdata,
            y: ydata2[0],
            type: 'scatter',
            name: '$A_{1}(t)$'
        };
    let data = [trace , trace2];
    let layout = { 
        title: 'Band 1 Output and Corresponding Amplitude Contour',
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
        font: {size: 18},
        showlegend: true
    };
    let config = {responsive: true}
    TESTER = document.getElementById('tester4');
    Plotly.newPlot(TESTER, data, layout);
}
function plotdata5(xdata,ydata,ydata2){
    let trace = {
        x: xdata,
        y: ydata,
        type: 'scatter',
        name: '$r_{2}(t)$'
        };
        let trace2 = {
            x: xdata,
            y: ydata2[1],
            type: 'scatter',
            name: '$A_{2}(t)$'
        };
    let data = [trace , trace2];
    let layout = { 
        title: 'Band 2 Output and Corresponding Amplitude Contour',
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
        font: {size: 18},
    };
    let config = {responsive: true}
    TESTER = document.getElementById('tester5');
    Plotly.newPlot(TESTER, data, layout, config);
}
function fft(yc,ys,typef){
    let N = yc.length;
    let bl = factor(N);
    let Yc=[]; let Ys=[];
    if (N <= 3){
        [Yc,Ys] = dft(yc,ys,typef);
    }
    else if (bl.length===1){
        [r,igmc,igms,rm,Nz] = radersdecimation(N,typef);
        [Yc,Ys] = radersroutine(yc,ys,N,typef,igmc,igms,r,rm,Nz);
    }
    else {
        [Yc,Ys] = treeandnodefft(yc,ys,N,typef,bl);
    }
    if (typef===1){
        for (let i=0;i<=N-1;i++){
            Yc[i] = Yc[i]/N;
            Ys[i] = Ys[i]/N;
        }
    }
    return [Yc,Ys];
}
function treeandnodefft(yc,ys,N,typef,bl){
    bl.splice(bl.length-1,1);
    let nl = [];
    let Ml = [];
    let INDEXcsl = [];
    let INDEXssl = [];
    let BUTTERcsl = [];
    let BUTTERssl = [];
    let BUTTERcsl2 = [];
    let BUTTERssl2 = [];
    let CONJc = [];
    let CONJs = [];
    let BUTTERcconj = [];
    let BUTTERsconj = [];
    let BUTTERcconj1 = [];
    let BUTTERcconj2 = [];
    let BUTTERsconj1 = [];
    let BUTTERsconj2 = [];
    let tempcompc = [];
    let tempcomps = [];
    nl[0] = 1; bl.splice(0,0,1); Ml[0]=N;
    for (var x=1;x<=bl.length-1;x++){
        nl[x] = bl[x-1]*nl[x-1];
        Ml[x] = Ml[x-1]/bl[x];
    }
    let El = dotm(bl,Ml);
    let L=x-1;
    let INDEXc=[yc];
    let INDEXs=[ys];
    for (let j=1;j<=L;j++){
      INDEXc.push([]);
      INDEXs.push([]);
    }
    let n=1; k=1; let a=0; let b=0;
    for (let l=1;l<=L;l++){
        n=1; k=1;
        for (let ni=1;ni<=nl[l];ni++){
            for (let bi=1;bi<=bl[l];bi++){
                for (let j=0;j<=Ml[l]-1;j++){
                    a = j*bl[l]+k-1;
                    b = j+n-1;
                    INDEXc[l][b] = INDEXc[l-1][a];
                    INDEXs[l][b] = INDEXs[l-1][a];
                }
                n = n + Ml[l];
                k = k+1;
            }
            k = ni*El[l]+1
        }
    }
    bl.reverse(); nl.reverse(); Ml.reverse(); El.reverse();
    let Yc=[]; let Ys=[];
    let BUTTERc = [];
    for (let j=1;j<=Ml.length;j++){
        BUTTERc.push([]);
    }
    let BUTTERs = [];
    for (let j=1;j<=Ml.length;j++){
        BUTTERs.push([]);
    }
    if (Ml[0] > 4){
        [r,igmc,igms,rm,Nz] = radersdecimation(Ml[0],typef);
    }
    for (let l=1;l<=L+1;l++){
        n = 1; k =1;
        if (l===1){
            for (let ni=1;ni<=nl[l-1];ni++){
                for (let bi=1;bi<=bl[l-1];bi++){;
                    INDEXcsl = INDEXc[L].slice(n-1,n+Ml[0]-1)
                    INDEXssl = INDEXs[L].slice(n-1,n+Ml[0]-1)
                    if (Ml[0] > 4){
                        [Yc,Ys] = radersroutine(INDEXcsl,INDEXssl,Ml[0],typef,igmc,igms,r,rm,Nz);
                    }
                    else {
                        [Yc,Ys] = dft(INDEXcsl,INDEXssl,typef);
                    }
                    for (let k=n;k<=n+Ml[0]-1;k++){
                        BUTTERc[0][k-1] = Yc[k-n];
                        BUTTERs[0][k-1] = Ys[k-n];
                    }
                    n = n+Ml[0];
                }
            }
        }
        else{
            for (let ni=1;ni<=nl[l-2];ni++){
                if(bl[l-2]===2){
                    BUTTERcsl = BUTTERc[l-2].slice(n+Ml[l-2]-1,n+2*Ml[l-2]-1);
                    BUTTERssl = BUTTERs[l-2].slice(n+Ml[l-2]-1,n+2*Ml[l-2]-1);
                    for (let j=0;j<=Ml[l-2]-1;j++){
                        CONJc[j] = BUTTERcsl[j]*Math.cos(typef*Math.PI*j/Ml[l-2])-BUTTERssl[j]*Math.sin(typef*Math.PI*j/Ml[l-2]);
                        CONJs[j] = BUTTERcsl[j]*Math.sin(typef*Math.PI*j/Ml[l-2])+BUTTERssl[j]*Math.cos(typef*Math.PI*j/Ml[l-2]);
                    }
                    BUTTERcconj1 = dota(BUTTERc[l-2].slice(n-1,n+Ml[l-2]-1),CONJc);
                    BUTTERcconj2 = dots(BUTTERc[l-2].slice(n-1,n+Ml[l-2]-1),CONJc);
                    BUTTERcconj = BUTTERcconj1.concat(BUTTERcconj2);
                    BUTTERsconj1 = dota(BUTTERs[l-2].slice(n-1,n+Ml[l-2]-1),CONJs);
                    BUTTERsconj2 = dots(BUTTERs[l-2].slice(n-1,n+Ml[l-2]-1),CONJs);
                    BUTTERsconj = BUTTERsconj1.concat(BUTTERsconj2);
                    for (let j=n;j<=n+El[l-2]-1;j++){
                        BUTTERc[l-1][j-1] = BUTTERcconj[j-n];
                        BUTTERs[l-1][j-1] = BUTTERsconj[j-n];
                    }
                }
                else if (bl[l-2]>2){
                    for (let bi=1;bi<=bl[l-2];bi++){
                        BUTTERcsl = BUTTERc[l-2].slice(k-1,k+Ml[l-2]-1);
                        BUTTERssl = BUTTERs[l-2].slice(k-1,k+Ml[l-2]-1);
                        [tempcompc,tempcomps] = NONCONJfct(BUTTERcsl,BUTTERssl,bi,Ml[l-2],bl[l-2],typef);
                        if (bi===1){
                            BUTTERcsl2=[];
                            BUTTERssl2=[];
                            for (v=0;v<=El[l-2]-1;v++){

                            BUTTERcsl2.push(0);
                            BUTTERssl2.push(0);
                            }
                        }
                        else{
                            BUTTERcsl2 = BUTTERc[l-1].slice(n-1,n+El[l-2]-1);
                            BUTTERssl2 = BUTTERs[l-1].slice(n-1,n+El[l-2]-1);
                        }
                        for (let j=n;j<=n+El[l-2]-1;j++){
                            BUTTERc[l-1][j-1] = BUTTERcsl2[j-n]+tempcompc[j-n];
                            BUTTERs[l-1][j-1] = BUTTERssl2[j-n]+tempcomps[j-n];
                        }
                    k = k+Ml[l-2];
                    }
                }
                n = ni*El[l-2]+1;
                k=n;
            }
        }
    }
    Yc = BUTTERc[L]; Ys = BUTTERs[L];
    return [Yc,Ys];
}
function dft(yc,ys,typef){
    let N = yc.length;
    let Yc=[];
    let Ys=[]; 
    let y1 = [];    
    let y2=[];                                         
    for (let n=0; n <= N-1; n++){
        for (let k=0; k <= N-1; k++){
            y1[k] = yc[k]*Math.cos(typef*2*Math.PI*n*k/N)-ys[k]*Math.sin(typef*2*Math.PI*n*k/N);
            y2[k] = yc[k]*Math.sin(typef*2*Math.PI*n*k/N)+ys[k]*Math.cos(typef*2*Math.PI*n*k/N);
        }
        Yc[n]= y1.reduce(function (a,b) {
            return a+b;
        });
        Ys[n]= y2.reduce(function (a,b) {
            return a+b;
        });
    }       
    return [Yc , Ys];
}
function NONCONJfct(Yc,Ys,bi,Ml,b,typef){
    let N=Ml*b;
    let FYc = Yc;
    let FYs = Ys;
    let FYpc = [];
    let FYps = [];
    for (let p=1;p<=b-1;p++){
        FYc = FYc.concat(Yc);
        FYs = FYs.concat(Ys);
    }
    if (bi===1){
        FYpc = FYc;
        FYps = FYs;
    }
    else{
        for (let j=0;j<=N-1;j++){
            FYpc[j] = FYc[j]*Math.cos(2*typef*Math.PI*(bi-1)*j/N) - FYs[j]*Math.sin(2*typef*Math.PI*(bi-1)*j/N);
            FYps[j] = FYc[j]*Math.sin(2*typef*Math.PI*(bi-1)*j/N) + FYs[j]*Math.cos(2*typef*Math.PI*(bi-1)*j/N);
        }
        
    }
    return [FYpc,FYps]
}
function radersroutine(yc,ys,N,typef,igmc,igms,r,rm,Nz){
    let ygc = [];
    let ygs = [];
    for (let n=1;n<=N-1;n++){
        ygc[n-1] = yc[Math.round(r[n-1])];
        ygs[n-1] = ys[Math.round(r[n-1])];
    }
    for (let j=1;j<=Nz-N+1;j++){
        ygc.splice(1,0,0);
        ygs.splice(1,0,0);
    }

    let bl = factor(Nz);
    let [Y1c,Y1s] = treeandnodefft(ygc,ygs,Nz,typef,bl);
    let [Y2c,Y2s] = treeandnodefft(igmc,igms,Nz,typef,bl);
    Cc = dots(dotm(Y1c,Y2c),dotm(Y1s,Y2s));
    Cs = dota(dotm(Y1c,Y2s),dotm(Y1s,Y2c));
    let [Yxc,Yxs] = treeandnodefft(Cc,Cs,Nz,-typef,bl);
    for (let j=0;j<=Nz-1;j++){
        Yxc[j] = Yxc[j]/Nz+yc[0];
        Yxs[j] = Yxs[j]/Nz+ys[0];
    }
    Ync = Yreindex(Yxc.slice(0,N-1),rm);
    Yns = Yreindex(Yxs.slice(0,N-1),rm);
    ycsum= yc.reduce(function (a,b) {
        return a+b;
    });
    yssum= ys.reduce(function (a,b) {
        return a+b;
    });
    Yc = [ycsum].concat(Ync);
    Ys = [yssum].concat(Yns);
    return [Yc,Ys];
}
function radersdecimation(N,typef){
    let r=[]; let rtry=[]; let igmc=[]; let igms=[];let rm=[];let Nz=[];let t=1;
    let igc = []; let igs = [];
    for (let g=1;g<=N-1;g++){
        for (let q=1;q<=N-1;q++){
            t=t*g;
            rtry[q-1] = t % N;
            t = t % N;
        }
        if (rtry.length - unique(rtry).length === 0){
            r=rtry;
            break;
        }
    }
    let rend = r[r.length-1];
    rm = r.slice(0,r.length-1).reverse();
    rm = rm.concat(rend);
    Nz = 2**Math.ceil(Math.log2(2*N-2));
    for (let j=1;j<=rm.length;j++){
        igc[j-1] = Math.cos(2*typef*Math.PI*rm[j-1]/N);
        igs[j-1] = Math.sin(2*typef*Math.PI*rm[j-1]/N);
    }
    igmc = igc; 
    igms = igs;
    while (igmc.length<Nz){
        igmc = igmc.concat(igc);
        igms = igms.concat(igs);
    }
    igmc = igmc.slice(0,Nz);
    igms = igms.slice(0,Nz);
    return [r,igmc,igms,rm,Nz];
}
function Yreindex(Yxc,rm){
    let Yn=[]; 
    let r = rm.slice(1,rm.length).concat(rm[0]);
    for (let n=1;n<=Yxc.length;n++){
        Yn[Math.round(r[n-1])-1] = Yxc[n-1];
    }
    return Yn;
}
function unique(rtry){
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      let u = rtry.filter(onlyUnique);
    return u
}

function factor(N){
    let c=0;
    let bl=[];
    let notprime=0;
    for(let i = 2; i <= N; i++) {
        notprime = checkprime(i);
        if (notprime===0){
            while (N % i == 0) {
                bl[c] = i;
                c = c+1;
                N = N/i;
            }
        }
    }
    return bl;
}
function dotm(x1,x2){
    let C = [];
    for (let i= 0; i <= x1.length-1; i++) {
        C[i] = x1[i]*x2[i];
    }
    return C
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
function checkprime(i){
    let notprime =0;
    for (let k=2;k<=i-1;k++){
        if (i % k === 0) {
            notprime = 1;
            break;
        }
    }
    return notprime
}