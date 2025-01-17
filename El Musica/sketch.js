let song, analyzer;
let treble, bass, reverb, toneShift;
let tracks = [];
let currentTrackIndex = 0;

function preload() {
  // Загружаем треки
  tracks.push(loadSound('assets/audio1.wav'));
  tracks.push(loadSound('assets/audio2.wav'));
  tracks.push(loadSound('assets/audio3.wav'));
  tracks.push(loadSound('assets/audio4.wav'));
  tracks.push(loadSound('assets/audio5.wav'));
  tracks.push(loadSound('assets/audio6.wav'));
  tracks.push(loadSound('assets/audio7.wav'));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  analyzer = new p5.Amplitude();
  song = tracks[currentTrackIndex];
  song.setVolume(0.2);  // Настройка общей громкости (используем setVolume вместо amp)
  analyzer.setInput(tracks[currentTrackIndex]); // Подключаем анализатор к источнику звука

  // Настройка эффектов
  treble = new p5.BandPass();
  bass = new p5.LowPass();
  reverb = new p5.Reverb();
  toneShift = new p5.Filter();
  
  // Применяем эффекты к треку
  song.disconnect();
  song.connect(treble);
  song.connect(bass);
  song.connect(reverb);
  song.connect(toneShift);

  reverb.drywet(0.5); // Пример реваба
  bass.freq(100);  // Настройка частоты для баса
  treble.freq(5000);  // Настройка частоты для высоких частот

  // Установка обработчиков для кнопок
  document.getElementById('playPauseButton').addEventListener('click', togglePlayPause);
  document.getElementById('nextTrackButton').addEventListener('click', nextTrack);
  document.getElementById('increaseSpeedButton').addEventListener('click', increaseSpeed);
  document.getElementById('decreaseSpeedButton').addEventListener('click', decreaseSpeed);
  document.getElementById('trebleButton').addEventListener('click', toggleTreble);
  document.getElementById('bassButton').addEventListener('click', toggleBass);
  document.getElementById('reverbButton').addEventListener('click', toggleReverb);
  document.getElementById('toneButton').addEventListener('click', changeTone);
  
  // Слайдеры
  document.getElementById('bassSlider').addEventListener('input', updateBass);
  document.getElementById('trebleSlider').addEventListener('input', updateTreble);
  document.getElementById('rateSlider').addEventListener('input', updateSpeed);
  document.getElementById('volumeSlider').addEventListener('input', updateVolume); // Обработчик для слайдера громкости

  analyzer = new p5.Amplitude();
  fft = new p5.FFT(0.8, 1024); // 0.8 — чувствительность, 1024 — разрешение частот
  song = tracks[currentTrackIndex];
  song.setVolume(0.2);  // Настройка громкости
  analyzer.setInput(song);  // Устанавливаем источник анализа
  fft.setInput(song);

}

function draw() {
  background(0); // Черный фон для канваса

  // Проверяем, был ли загружен и воспроизводится ли трек
  if (song.isPlaying()) {
    // Получаем массив частот с помощью FFT
    let spectrum = fft.analyze();  // Получаем спектр частот

    // Рисуем прямоугольники для спектра
    let barWidth = width / spectrum.length; // Ширина одного элемента
    for (let i = 0; i < spectrum.length; i++) {
      let x = i * barWidth;  // Позиция по оси X
      let h = map(spectrum[i], 0, 255, 0, height);  // Высота прямоугольника на основе амплитуды
      let r = map(i, 0, spectrum.length, 0, 255); // Цвет на основе позиции

      // Яркие и светящиеся цвета
      let g = map(i, 0, spectrum.length, 255, 0); // Перелив от зеленого к красному
      let b = map(i, 0, spectrum.length, 0, 255); // Перелив от синего к красному

      // Прямоугольники для визуализации спектра с эффектом свечения
      fill(r, g, b); // Устанавливаем цвет
      noStroke();
      rect(x, height - h, barWidth, h); // Отрисовываем прямоугольник

      // Добавляем эффект свечения
      let glowColor = color(r, g, b);
      glowEffect(x + barWidth / 2, height - h / 2, glowColor); // Свечение для каждого столбца
    }
  }
}

// Функция для добавления эффекта свечения
function glowEffect(x, y, color) {
  for (let i = 0; i < 5; i++) {
    let size = map(i, 0, 5, 0, 15); // Постепенное увеличение радиуса свечения
    let alpha = map(i, 0, 5, 50, 0); // Постепенное уменьшение прозрачности

    // Рисуем каждый круг с постепенным уменьшением прозрачности
    fill(color.levels[0], color.levels[1], color.levels[2], alpha);
    noStroke();
    ellipse(x, y, size, size); // Рисуем окружность для свечения
  }
}
function draw() {
  background(40,06,06); // Черный фон для канваса

  // Проверяем, был ли загружен и воспроизводится ли трек
  if (song.isPlaying()) {
    // Получаем массив частот с помощью FFT
    let spectrum = fft.analyze();  // Получаем спектр частот

    // Рисуем прямоугольники для спектра
    let barWidth = width / spectrum.length; // Ширина одного элемента
    for (let i = 0; i < spectrum.length; i++) {
      let x = i * barWidth;  // Позиция по оси X
      let h = map(spectrum[i], 0, 255, 0, height);  // Высота прямоугольника на основе амплитуды
      let r = map(i, 0, spectrum.length, 255, 255); // Красный будет равен 255 для всех столбиков
      let g = map(i, 0, spectrum.length, 255, 165); // Зеленый плавно меняется от 255 до 165
      let b = map(i, 0, spectrum.length, 0, 0);
      // Прямоугольники для визуализации спектра с эффектом свечения
      fill(r, g, b); // Устанавливаем цвет
      noStroke();
      rect(x, height - h, barWidth, h); // Отрисовываем прямоугольник

      // Добавляем эффект свечения
      let glowColor = color(r, g, b);
      glowEffect(x + barWidth / 2, height - h / 2, glowColor); // Свечение для каждого столбца
    }
  }
}




// Функции управления
function togglePlayPause() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  song.stop();
  song = tracks[currentTrackIndex];
  song.play();
  song.setVolume(0.2);
  fft.setInput(song);
  analyzer.setInput(song);
}

function increaseSpeed() {
  song.rate(song.rate() + 0.1);
}

function decreaseSpeed() {
  song.rate(song.rate() - 0.1);
}

function toggleTreble() {
  treble.freq(treble.freq() === 5000 ? 10000 : 5000);  // Переключаем частоту
}

function toggleBass() {
  bass.freq(bass.freq() === 100 ? 200 : 100);  // Переключаем частоту баса
}

function toggleReverb() {
  reverb.drywet(reverb.drywet() === 0.5 ? 0 : 0.5);
  console.log("Wowowowo", event.target.value);// Включаем/выключаем реверберацию
}

function changeTone() {
  toneShift.set(200);  // Изменение тона
}

function updateBass(event) {
  const bassFreq = parseFloat(event.target.value);
  bass.freq(bassFreq); 
  console.log("Bass Frequency: ", bassFreq);
}

function updateTreble(event) {
  const trebleFreq = parseFloat(event.target.value); // Получаем значение слайдера
  treble.freq(trebleFreq); // Устанавливаем частоту для BandPass
  console.log("Treble Frequency: ", trebleFreq);
}

function updateSpeed(event) {
  song.rate(event.target.value);
  console.log("Speed:",updateSpeed);// Обновление скорости
}

function updateVolume(event) {
  const volume = parseFloat(event.target.value); // Преобразуем строку в число
  song.setVolume(volume); // Применяем громкость
  console.log("Громкость изменена на:", volume); // Для проверки
}

