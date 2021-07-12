const word1 = document.getElementById('word1');
const text = document.getElementById('text');
const word2 = document.getElementById('word2');
const small2 = document.querySelector('.small2');
const text2 = document.getElementById('text2');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const endgameEl = document.getElementById('end-game-container');
const settings = document.getElementById('settings');
const difficultySelect = document.getElementById('difficulty');
const timeButton = document.querySelector('.timeButton');
const timeInput = document.querySelector('.time-input');
const year = document.querySelector('.year');

async function randomWordGenerator() {
  let score = 0;
  const initialTime = ['11'];
  // Init time
  let time = initialTime[0];
  // let randomWord;
  let wordsArr = [];

  try {
    const res = await fetch(
      'https://random-word-api.herokuapp.com/word?number=300'
    );
    const data = await res.json();
    wordsArr = await data;

    // get a random word
    function randomWord() {
      return wordsArr[Math.floor(Math.random() * wordsArr.length)];
    }
    // hide second input on easy level
    function displaySwitch() {
      text2.style.display = 'none';
      word2.style.display = 'none';
      small2.style.display = 'none';
    }
    displaySwitch();

    // update dom element for input 1
    function updateDom() {
      wordToDisplay = randomWord();
      word1.innerHTML = wordToDisplay;
    }
    updateDom();

    // update dom element for input 2
    function updateDom2() {
      wordToDisplay2 = randomWord();
      word2.innerHTML = wordToDisplay2;
    }

    // score update
    function updateScore() {
      // update my score
      score++;
      // update score in the DOM
      scoreEl.innerHTML = score;
    }
    // my custom time
    timeButton.addEventListener('click', () => {
      const customTime = +timeInput.value;

      if (initialTime.length === 2) initialTime.pop();
      if (timeInput.value !== '') {
        initialTime.push(customTime + 1);
        time = initialTime[1];
      } else time = initialTime[0];
      timeInput.value = '';
    });
    // timer function
    let interval = setInterval(() => updateTime(), 1000);
    // set time
    function setTime() {
      return initialTime.length === 2
        ? (time = initialTime[1])
        : (time = initialTime[0]);
    }
    // update time
    function updateTime() {
      time--;
      timeEl.innerHTML = `${time}s`;
      if (time <= 5) timeEl.classList.add('warning');
      else timeEl.classList.remove('warning');
      if (time === 0) {
        clearInterval(interval);
        // end the game
        gameOver();
      }
    }
    function gameOver() {
      endgameEl.innerHTML = `
                <h1>Time ran out of time</h1>
                <p>Your final score is ${score}</p>
                <button class="btn-reload">Reload</button>
              `;
      endgameEl.style.display = 'flex';
    }

    // restart the game
    function restart() {
      endgameEl.style.display = 'none';
      setTime();
      score = -1;
      text.focus();
      text.value = '';
      text2.value = '';
      interval = setInterval(() => updateTime(), 1000);
      updateScore();
    }

    // hard level
    function hardLevel() {
      text.focus();
      text2.style.display = 'inline-block';
      word2.style.display = 'block';
      small2.style.display = 'block';
      text.addEventListener('input', e => {
        let typedWord1 = e.target.value;
        if (typedWord1 === wordToDisplay) {
          updateDom2();
          text2.focus();
        }
      });
      text2.addEventListener('input', e => {
        let typedWord = e.target.value;
        if (typedWord === wordToDisplay2) {
          text.value = '';
          text2.value = '';
          // update scores
          updateScore();
          // focus input 1
          text.focus();
          // update dom
          updateDom();
          // time update
          setTime();
        }
      });
    }

    // easy level
    function easyLevel() {
      displaySwitch();
      text.focus();
      text.addEventListener('input', e => {
        let typedWord1 = e.target.value;
        if (typedWord1 === wordToDisplay && difficultySelect.value !== 'hard') {
          updateDom();
          setTime();
          text.value = '';
          updateScore();
        }
      });
    }
    easyLevel();

    settings.addEventListener('change', () => {
      score = -1;
      updateScore();
      setTime();
      if (difficultySelect.value === 'hard') {
        score = -1;
        text.value = text2.value = '';
        updateScore();
        updateDom2();
        hardLevel();
      }
      if (difficultySelect.value === 'easy') {
        score = -1;
        text.value = '';
        updateScore();
        updateDom();
        easyLevel();
      }
    });
    function updateDomOnRestart() {
      if (difficultySelect.value === 'easy') return updateDom();
      if (difficultySelect.value === 'hard') return updateDom2();
    }
    // game restart eventlisteners
    endgameEl.addEventListener('click', e => {
      if (e.target.classList.contains('btn-reload')) {
        updateDomOnRestart();
        restart();
      }
    });
    window.addEventListener('keypress', e => {
      if (e.key === 'Enter' && time === 0) {
        updateDomOnRestart();
        restart();
      }
    });
  } catch (error) {
    alert(error);
  }
}
randomWordGenerator();
year.innerHTML = `${new Date().getFullYear()}`;
