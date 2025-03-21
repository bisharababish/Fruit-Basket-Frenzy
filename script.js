const fruits = ["🍎", "🍌", "🍇", "🍓", "🍉"];
    const gameArea = document.body;
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const bucket = document.getElementById('bucket');
    const gameOverScreen = document.getElementById('game-over');
    const finalScoreDisplay = document.getElementById('final-score');
    const playAgainButton = document.getElementById('play-again');
    const catchSound = document.getElementById('catch-sound');
    const gameOverSound = document.getElementById('game-over-sound');
    let score = 0;
    let timeLeft = 30;
    let multiplier = 1;
    let gameInterval;
    let spawnInterval;

    gameArea.addEventListener('mousemove', (e) => {
      bucket.style.left = `${e.clientX}px`;
    });

    gameArea.addEventListener('touchmove', (e) => {
      bucket.style.left = `${e.touches[0].clientX}px`;
    });

    function createFruit() {
      const fruit = document.createElement('div');
      fruit.classList.add('fruit');
      fruit.textContent = fruits[Math.floor(Math.random() * fruits.length)];
      fruit.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
      fruit.style.animationDuration = `${Math.random() * 2 + 1}s`;
      gameArea.appendChild(fruit);

      // Check if fruit is caught
      const checkCollision = setInterval(() => {
        const fruitRect = fruit.getBoundingClientRect();
        const bucketRect = bucket.getBoundingClientRect();
        if (
          fruitRect.bottom >= bucketRect.top &&
          fruitRect.top <= bucketRect.bottom &&
          fruitRect.right >= bucketRect.left &&
          fruitRect.left <= bucketRect.right
        ) {
          catchSound.play();
          score += multiplier;
          multiplier++;
          scoreDisplay.textContent = `Score: ${score}`;
          fruit.remove();
          clearInterval(checkCollision);
        } else if (fruitRect.top > window.innerHeight) {
          multiplier = 1; 
          fruit.remove();
          clearInterval(checkCollision);
        }
      }, 10);
    }

    function startGame() {
      score = 0;
      timeLeft = 30;
      multiplier = 1;
      scoreDisplay.textContent = `Score: ${score}`;
      timerDisplay.textContent = `Time Left: ${timeLeft}`;
      gameOverScreen.style.display = 'none';

      gameInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Left: ${timeLeft}`;

        if (timeLeft <= 0) {
          clearInterval(gameInterval);
          clearInterval(spawnInterval);
          gameOverSound.play();
          finalScoreDisplay.textContent = score;
          gameOverScreen.style.display = 'block';
          document.querySelectorAll('.fruit').forEach(fruit => fruit.remove());
        }
      }, 1000);

      spawnInterval = setInterval(() => {
        createFruit();
        if (timeLeft < 20) createFruit(); 
      }, 800);
    }

    playAgainButton.addEventListener('click', startGame);

    startGame();