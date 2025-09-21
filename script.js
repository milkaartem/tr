const translations = {
    ru: {
        mainButtonText: 'Получить сигнал',
        modalButtonText: 'Получить сигнал',
        gameStatus: 'ON --- Поставить {number} блоков подряд',
        levelText: 'Сколько блоков нужно поставить подряд',
        progressText: 'Если вы поставили больше {number} блоков, забирайте свой выигрыш! То что вы сможете поставить больше {number} блоков не гарантируется.'
    },
    en: {
        mainButtonText: 'Get Signal',
        modalButtonText: 'Get Signal',
        gameStatus: 'ON --- Place {number} blocks in a row',
        levelText: 'How many blocks to place in a row',
        progressText: 'If you have already made more than {number} blocks, take your winnings! Even if you don\'t guess to place more {number} blocks.'
    }
};

function getLanguageFromUrl() {
    const path = window.location.pathname;
    if (path.includes('/en')) {
        return 'en';
    } else if (path.includes('/ru')) {
        return 'ru';
    }
    return 'ru';
}

let currentLanguage = getLanguageFromUrl();
let currentLevel = 3;
let isCooldown = false;
let cooldownTimer = null;

function replacePlaceholders(text, number) {
    return text.replace(/{number}/g, number);
}

function updateTexts() {
    const texts = translations[currentLanguage];
    
    document.getElementById('mainButtonText').textContent = texts.mainButtonText;
    document.getElementById('modalButtonText').textContent = texts.modalButtonText;
    document.getElementById('gameStatus').textContent = replacePlaceholders(texts.gameStatus, currentLevel);
    document.getElementById('levelText').textContent = texts.levelText;
    document.getElementById('progressText').textContent = replacePlaceholders(texts.progressText, currentLevel);
}

function generateRandomLevel() {
    return Math.floor(Math.random() * 6) + 3;
}

function updateLevel(newLevel) {
    currentLevel = newLevel;
    document.getElementById('levelNumber').textContent = currentLevel;
    
    const texts = translations[currentLanguage];
    document.getElementById('gameStatus').textContent = replacePlaceholders(texts.gameStatus, currentLevel);
    document.getElementById('progressText').textContent = replacePlaceholders(texts.progressText, currentLevel);
}

function openGame() {
    if (isCooldown) {
        return;
    }

    const newLevel = generateRandomLevel();
    updateLevel(newLevel);
    
    const modal = document.getElementById('gameModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    const buttons = document.querySelectorAll('.get-signal-btn');
    buttons.forEach(btn => btn.disabled = true);
    isCooldown = true;

    let timeLeft = 15;
    const updateButtonText = () => {
        buttons.forEach(btn => {
            btn.querySelector('span').textContent = `Получить сигнал через ${timeLeft}`;
        });
    };

    updateButtonText();
    cooldownTimer = setInterval(() => {
        timeLeft--;
        updateButtonText();
        if (timeLeft <= 0) {
            clearInterval(cooldownTimer);
            buttons.forEach(btn => {
                btn.querySelector('span').textContent = translations[currentLanguage].mainButtonText;
                btn.disabled = false;
            });
            isCooldown = false;
        }
    }, 1000);

    const gameContent = modal.querySelector('.game-content');
    gameContent.style.transform = 'scale(0.9)';
    gameContent.style.opacity = '0';
    
    setTimeout(() => {
        gameContent.style.transform = 'scale(1)';
        gameContent.style.opacity = '1';
        gameContent.style.transition = 'all 0.3s ease';
    }, 50);
}

function closeGame() {
    const modal = document.getElementById('gameModal');
    const gameContent = modal.querySelector('.game-content');
    
    gameContent.style.transform = 'scale(0.9)';
    gameContent.style.opacity = '0';
    
    setTimeout(() => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }, 200);
}

function generateNewLevel() {
    if (isCooldown) {
        return;
    }

    const newLevel = generateRandomLevel();
    updateLevel(newLevel);
    
    const levelElement = document.getElementById('levelNumber');
    levelElement.style.transform = 'scale(1.1)';
    levelElement.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
        levelElement.style.transform = 'scale(1)';
    }, 200);

    const buttons = document.querySelectorAll('.get-signal-btn');
    buttons.forEach(btn => btn.disabled = true);
    isCooldown = true;

    let timeLeft = 15;
    const updateButtonText = () => {
        buttons.forEach(btn => {
            btn.querySelector('span').textContent = `Получить сигнал через ${timeLeft}`;
        });
    };

    updateButtonText();
    cooldownTimer = setInterval(() => {
        timeLeft--;
        updateButtonText();
        if (timeLeft <= 0) {
            clearInterval(cooldownTimer);
            buttons.forEach(btn => {
                btn.querySelector('span').textContent = translations[currentLanguage].modalButtonText;
                btn.disabled = false;
            });
            isCooldown = false;
        }
    }, 1000);
}

function setCustomBackground(imageUrl) {
    const body = document.body;
    body.style.setProperty('--custom-bg', `url('${imageUrl}')`);
    body.classList.add('custom-background');
}

function resetBackground() {
    const body = document.body;
    body.classList.remove('custom-background');
    body.style.removeProperty('--custom-bg');
}

function setButtonImages(backgroundImage, stripesImage) {
    const buttons = document.querySelectorAll('.get-signal-btn');
    buttons.forEach(btn => {
        btn.style.background = `url('${backgroundImage}')`;
        btn.style.backgroundSize = 'cover';
        btn.style.backgroundPosition = 'center';
        
        const style = document.createElement('style');
        style.textContent = `
            .get-signal-btn.custom-animated::before {
                background: url('${stripesImage}') repeat-x !important;
                background-size: auto 100% !important;
            }
        `;
        document.head.appendChild(style);
        
        btn.classList.add('custom-animated');
    });
}

function resetButtonImages() {
    const buttons = document.querySelectorAll('.get-signal-btn');
    buttons.forEach(btn => {
        btn.style.background = '';
        btn.classList.remove('custom-animated');
    });
}

window.setCustomBackground = setCustomBackground;
window.resetBackground = resetBackground;
window.setButtonImages = setButtonImages;
window.resetButtonImages = resetButtonImages;

document.addEventListener('DOMContentLoaded', function() {
    updateTexts();
    
    document.getElementById('gameModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeGame();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeGame();
        }
    });
    
    if ('vibrate' in navigator) {
        document.querySelectorAll('.get-signal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                navigator.vibrate(50);
            });
        });
    }
});