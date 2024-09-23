let sound; // Переменная где будет находится аудио-дорожка
let isInitialised; // Состояние, которое обозначает инициализированы ли значения или нет
let isLoaded = false;
let amplitude;
let amplitudes = [];
let angle=0;
let fft;
let fly =200;
let flag=true;
let flightSpeed=0;


function preload()
{
    img = loadImage('assets/GojoFloating.gif',0,0);
    soundFormats('mp3', 'wav'); // Определяем аудио форматы, поддерживаемые плеером
    sound = loadSound('assets/Gojo.wav', () =>{
        console.log("sound is loaded!"); // Загружаем музыку и при успешной загрузке выводим в консоль сообщение, что музыка загрузилась
        isLoaded = true;
    });
    isInitialised = false; 
    sound.setVolume(0.1); // Устанавливаем громкость на 20%
}

function setup()
{
    createCanvas(1024, 1024);
    textAlign(CENTER); // Центрируем следующий текст по центру
    textSize(32);
    
    amplitude = new p5.Amplitude();
    
    for (let i = 0; i < 512; i++)
        amplitudes.push(0);
    fft = new p5.FFT();
}

function draw()
{
    background(img,255 );
    fill(0);
    if (isInitialised && !sound.isPlaying())
        text("Press any key for play sound", width/2, height/2);
    else if (sound.isPlaying())
    {
        let level = amplitude.getLevel();
        amplitudes.push(level);
        amplitudes.shift();
        text(level, width/2, 40);
        let size = map(level, 0, 0.20, 100, 200);
        for (let i=0 ; i<size ; i++){
            fill(i*5-400,0,i*5-400,50 );
            ellipse(width/2,height/2,i,i);
        } 
        
         
        /*
        noFill();
        stroke("#A01000");
        beginShape();
        for(let i = 0; i < amplitudes.length; i++)
        {
            let h = map(amplitudes[i], 0, 0.20, 0, 100);
            //ellipse(i * 2, height/2 + h, 2);
            vertex(i * 2, height/2 - h * 10);
            
           
        }
        endShape();
        */
        
        let freqs = fft.analyze();
        
        translate(width/2,height/2);
        
        push();
        
        stroke(255, 0, 255);
        for(let i = 0; i < freqs.length; i++){
            rotate(0.05);
            line(0, 0,0, freqs[i]+2)  ;
        }
        pop();
       
        noStroke();
        
        push();
        rotate(angle);
        angle += 0.005;
        if (fly<=-800){
            flag=false;
            flightSpeed=0.01;
        }
        if (fly<=1 || fly)
        if (fly>=800){
            flag=true;
            flightSpeed=0.01;
        }
        if (flag==true){
            fly-=1*flightSpeed;
            flightSpeed+=0.0002;
        }
        if (flag==false){
            fly+=1*flightSpeed;
            flightSpeed+=0.0002;
        }
        
        
        
        let energy = fft.getEnergy("bass");
        fill(255,0,0,90);
        ellipse(-fly, 0, 100 + energy);
        
        let high_energy = fft.getEnergy("highMid");
        
        console.log(flag);
        console.log(fly); 
        console.log(flightSpeed);
        fill(0,0,255,90);
        ellipse(fly, 0, 100 + high_energy);
    
        pop();
    }
}

function keyPressed()
{
    if (!isInitialised)
    {
        isInitialised = true;
        
        
        let r = 1 ; // r - скорость воспроизведения звука, которую мы расчитываем в зависимость от положения мыши по x. Чем правее - тем быстрее запускается воспроизведение
        if (isLoaded)
            sound.loop(0, r); // loop - функция для зацикливания. 0 -  откуда начинается зацикливание по времени r - rate - playback rate
    }
    else
    {
        if (key == ' ')
        {
            if (sound.isPaused())   sound.play();
            else                    sound.pause();
        }
    }
}