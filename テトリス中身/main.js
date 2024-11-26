
const kaisiBtn = document.getElementById('kaisiBtn');
const hutariBtn = document.getElementById('hutariBtn');
const themeBtn = document.getElementById('themeBtn');
const asobiBtn = document.getElementById('asobiBtn');
const kureBtn = document.getElementById('kureBtn');
const title1 = document.querySelector('h1');
const title2 = document.querySelector('h2');
const gameContainer = document.getElementById('gameContainer');
const background = document.getElementById('haikei');
const bgm = document.getElementById('bgm');
let theme = 0;
const bgms =[
    './bgm/A175.mp3',
    './bgm/A136.mp3',
    './bgm/G42_v1.mp3',
    './bgm/Eplus18.mp3',
    './bgm/Zero_03_v1.mp3',
    './bgm/BMtwo1_v1.mp3',
    './bgm/BMthree5_v1.mp3',
    './bgm/H13.mp3'
];
const backgrounds =[
    './img/haikei1.jpg',
    './img/haikei2.jpg',
    './img/haikei3.jpg',
    './img/haikei4.jpg',
    './img/haikei5.jpg',
    './img/haikei6.jpg',
    './img/haikei7.jpg',
    './img/haikei8.jpg'
];


kaisiBtn.addEventListener('mouseover', function() {
    kaisiBtn.src = './img/kaisi2.png';
    kaisiBtn.style.boxShadow = '0px 0px 20px 10px rgba(255, 255, 0, 1)';
});

kaisiBtn.addEventListener('mouseout', function() {
    kaisiBtn.src = './img/kaisi1.png';
    kaisiBtn.style.boxShadow = '0px 0px 20px 10px rgba(255, 255, 255, 0.8)';
});

kaisiBtn.addEventListener('click', function() {
    startGame(false);//一人用モードを開始
    isSinglePlayer(true);
    dropcheck = 1;
});


hutariBtn.addEventListener('mouseover', function() {
    hutariBtn.src = './img/hutari2.png';
    hutariBtn.style.boxShadow = '0px 0px 20px 10px rgba(255, 255, 0, 1)';
});

hutariBtn.addEventListener('mouseout', function() {
    hutariBtn.src = './img/hutari1.png';
    hutariBtn.style.boxShadow = '0px 0px 20px 10px rgba(255, 255, 255, 0.8)';
});

hutariBtn.addEventListener('click', function() {
    startGame(true);//二人用モードを開始
    isSinglePlayer(true);
    dropcheck = 1;
    leftdropcheck = 1;
});

function startGame(isTwoPlayer) {
    kaisiBtn.style.opacity = '0';
    hutariBtn.style.opacity = '0';
    themeBtn.style.opacity = '0';
    asobiBtn.style.opacity = '0';
    kureBtn.style.opacity = '0';
    title1.style.opacity = '0';
    title2.style.opacity = '0';
    const audio = bgm; 
    audio.src = bgms[theme];
    bgm.play();

    setTimeout(function() {
        kaisiBtn.style.display = 'none';
        hutariBtn.style.display = 'none';
        themeBtn.style.display = 'none';
        asobiBtn.style.display = 'none';
        kureBtn.style.display = 'none';
        title1.style.display = 'none';
        title2.style.display = 'none';
        gameContainer.style.display = 'flex';
        startTetris(isTwoPlayer);
    }, 500);
}

themeBtn.addEventListener('mouseover', function() {
    themeBtn.src = './img/theme2.png';
    themeBtn.style.boxShadow = '0px 0px 20px 10px rgba(255, 255, 0, 1)';
});

themeBtn.addEventListener('mouseout', function() {
    themeBtn.src = './img/theme1.png';
    themeBtn.style.boxShadow = '0px 0px 20px 10px rgba(255, 255, 255, 0.8)';
});

themeBtn.addEventListener('click', function() {
    if(theme < 8){
    theme++;
    document.body.style.backgroundImage = `url(${backgrounds[theme]})`;
    save();
    }
    if(theme === 8){
    theme = 0;
    document.body.style.backgroundImage = `url(${backgrounds[theme]})`;
    save();
    }
});

function save() {
  localStorage.setItem('theme', theme);
}

function load() {
  theme = localStorage.getItem('theme') ? parseInt(localStorage.getItem('theme')) : 0;
}

window.onload = function() {
  load(); 
  document.body.style.backgroundImage = `url(${backgrounds[theme]})`;
};

asobiBtn.addEventListener('mouseover', function() {
    asobiBtn.src = './img/asobi2.png';
    asobiBtn.style.boxShadow = '0px 0px 20px 10px rgba(255, 255, 0, 1)';
});

asobiBtn.addEventListener('mouseout', function() {
    asobiBtn.src = './img/asobi1.png';
    asobiBtn.style.boxShadow = '0px 0px 20px 10px rgba(255, 255, 255, 0.8)';
});

asobiBtn.addEventListener('click', function() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block'; 
    kaisiBtn.style.display = 'none';
    asobiBtn.style.display = 'none';
    hutariBtn.style.display = 'none';
    themeBtn.style.display = 'none';
    kureBtn.style.display = 'none';
  });
  
  const closeModal = document.getElementById('closeModal');
  closeModal.addEventListener('click', function() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none'; 
    kaisiBtn.style.display = 'block';
    asobiBtn.style.display = 'block';
    hutariBtn.style.display = 'block';
    themeBtn.style.display = 'block';
    kureBtn.style.display = 'block';
  });
  
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none'; 
        kaisiBtn.style.display = 'block';
        asobiBtn.style.display = 'block';
        hutariBtn.style.display = 'block';
        themeBtn.style.display = 'block';
        kureBtn.style.display = 'block';
    }
  });
  

kureBtn.addEventListener('mouseover', function() {
    kureBtn.src = './img/kure2.png';
    kureBtn.style.boxShadow = '0px 0px 20px 10px rgba(255, 255, 0, 1)';
});

kureBtn.addEventListener('mouseout', function() {
    kureBtn.src = './img/kure1.png';
    kureBtn.style.boxShadow = '0px 0px 20px 10px rgba(255, 255, 255, 0.8)';
});

kureBtn.addEventListener('click', function() {
    const modalk = document.getElementById('modalk');
    modalk.style.display = 'block'; 
    kaisiBtn.style.display = 'none';
    asobiBtn.style.display = 'none';
    hutariBtn.style.display = 'none';
    themeBtn.style.display = 'none';
    kureBtn.style.display = 'none';
  });
  
  const closeModalk = document.getElementById('closeModalk');
  closeModalk.addEventListener('click', function() {
    const modalk = document.getElementById('modalk');
    modalk.style.display = 'none'; 
    kaisiBtn.style.display = 'block';
    asobiBtn.style.display = 'block';
    hutariBtn.style.display = 'block';
    themeBtn.style.display = 'block';
    kureBtn.style.display = 'block';
  });
  
  window.addEventListener('click', function(event) {
    const modalk = document.getElementById('modalk');
    if (event.target === modalk) {
        modalk.style.display = 'none'; 
        kaisiBtn.style.display = 'block';
        asobiBtn.style.display = 'block';
        hutariBtn.style.display = 'block';
        themeBtn.style.display = 'block';
        kureBtn.style.display = 'block';
    }
  });
  