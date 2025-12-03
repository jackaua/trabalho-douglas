// Dados para os jogos
const sentences = [
    {
        text: "Eu gosto de estudar <span class='highlight-word' data-word='de'>de</span> manhã.",
        word: "de",
        correct: "preposicao",
        options: ["conjuncao", "preposicao", "interjeicao", "artigo"]
    },
    {
        text: "<span class='highlight-word' data-word='Oba'>Oba</span>! Finalmente chegou o dia!",
        word: "Oba",
        correct: "interjeicao",
        options: ["conjuncao", "preposicao", "interjeicao", "artigo"]
    },
    {
        text: "Estudei muito <span class='highlight-word' data-word='e'>e</span> passei no exame.",
        word: "e",
        correct: "conjuncao",
        options: ["conjuncao", "preposicao", "interjeicao", "artigo"]
    },
    {
        text: "<span class='highlight-word' data-word='O'>O</span> livro está sobre a mesa.",
        word: "O",
        correct: "artigo",
        options: ["conjuncao", "preposicao", "interjeicao", "artigo"]
    },
    {
        text: "O livro está <span class='highlight-word' data-word='sobre'>sobre</span> a mesa.",
        word: "sobre",
        correct: "preposicao",
        options: ["conjuncao", "preposicao", "interjeicao", "artigo"]
    },
    {
        text: "<span class='highlight-word' data-word='Uau'>Uau</span>, que lindo esse lugar!",
        word: "Uau",
        correct: "interjeicao",
        options: ["conjuncao", "preposicao", "interjeicao", "artigo"]
    },
    {
        text: "Não saí <span class='highlight-word' data-word='porque'>porque</span> estava chovendo.",
        word: "porque",
        correct: "conjuncao",
        options: ["conjuncao", "preposicao", "interjeicao", "artigo"]
    },
    {
        text: "Vou <span class='highlight-word' data-word='para'>para</span> a escola todos os dias.",
        word: "para",
        correct: "preposicao",
        options: ["conjuncao", "preposicao", "interjeicao", "artigo"]
    },
    {
        text: "<span class='highlight-word' data-word='Ai'>Ai</span>, que dor de cabeça!",
        word: "Ai",
        correct: "interjeicao",
        options: ["conjuncao", "preposicao", "interjeicao", "artigo"]
    },
    {
        text: "<span class='highlight-word' data-word='A'>A</span> menina estudou muito.",
        word: "A",
        correct: "artigo",
        options: ["conjuncao", "preposicao", "interjeicao", "artigo"]
    },
    {
        text: "Comprei <span class='highlight-word' data-word='um'>um</span> caderno novo.",
        word: "um",
        correct: "artigo",
        options: ["conjuncao", "preposicao", "interjeicao", "artigo"]
    },
    {
        text: "Vi <span class='highlight-word' data-word='uma'>uma</span> estrela no céu.",
        word: "uma",
        correct: "artigo",
        options: ["conjuncao", "preposicao", "interjeicao", "artigo"]
    }
];

const fillSentences = [
    {
        sentence: "Gosto de ler, ___ não tenho muito tempo.",
        blank: "mas",
        options: ["mas", "para", "oba", "o"]
    },
    {
        sentence: "Estudamos ___ a manhã toda.",
        blank: "durante",
        options: ["durante", "e", "uau", "a"]
    },
    {
        sentence: "___! Que surpresa agradável!",
        blank: "Nossa",
        options: ["Nossa", "com", "que", "um"]
    },
    {
        sentence: "Vou ___ a biblioteca buscar livros.",
        blank: "para",
        options: ["para", "mas", "ai", "a"]
    },
    {
        sentence: "Não fui ___ estava doente.",
        blank: "porque",
        options: ["porque", "sobre", "viva", "os"]
    },
    {
        sentence: "___! Finalmente terminamos!",
        blank: "Eba",
        options: ["Eba", "de", "quando", "uma"]
    },
    {
        sentence: "___ livro está na mesa.",
        blank: "O",
        options: ["O", "mas", "oba", "durante"]
    },
    {
        sentence: "Comprei ___ caderno novo hoje.",
        blank: "um",
        options: ["um", "e", "uau", "sobre"]
    },
    {
        sentence: "Vi ___ estrela brilhante.",
        blank: "uma",
        options: ["uma", "porque", "ai", "para"]
    }
];

const sortWords = {
    conjuncao: ["e", "mas", "porque", "quando", "embora", "ou", "porém"],
    preposicao: ["de", "para", "sobre", "com", "durante", "em", "por"],
    interjeicao: ["oba", "uau", "ai", "nossa", "eba", "viva", "olá"],
    artigo: ["o", "a", "os", "as", "um", "uma", "uns", "umas"]
};

// Estado dos jogos
let currentSentenceIndex = 0;
let currentFillIndex = 0;
let selectedAnswer = null;
let selectedFill = null;
let fillBlanks = [];
let sortState = {
    conjuncao: [],
    preposicao: [],
    interjeicao: []
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initSentenceGame();
    initFillGame();
    initSortGame();
    setupSmoothScroll();
});

// Scroll suave
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Jogo 1: Identificação
function initSentenceGame() {
    loadSentence();
    
    document.getElementById('checkAnswer').addEventListener('click', checkSentenceAnswer);
    document.getElementById('nextSentence').addEventListener('click', () => {
        document.getElementById('nextSentence').style.display = 'none';
        document.getElementById('feedback').textContent = '';
        selectedAnswer = null;
        currentSentenceIndex = (currentSentenceIndex + 1) % sentences.length;
        loadSentence();
    });
}

function loadSentence() {
    const current = sentences[currentSentenceIndex];
    const sentenceEl = document.getElementById('sentenceGame').querySelector('.sentence-text');
    sentenceEl.innerHTML = current.text;
    
    const optionsEl = document.getElementById('wordOptions');
    optionsEl.innerHTML = '';
    
    current.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option.charAt(0).toUpperCase() + option.slice(1);
        btn.dataset.option = option;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedAnswer = option;
        });
        optionsEl.appendChild(btn);
    });
}

function checkSentenceAnswer() {
    const current = sentences[currentSentenceIndex];
    const feedbackEl = document.getElementById('feedback');
    const nextBtn = document.getElementById('nextSentence');
    
    if (!selectedAnswer) {
        feedbackEl.textContent = 'Por favor, selecione uma opção!';
        feedbackEl.className = 'feedback incorrect';
        return;
    }
    
    if (selectedAnswer === current.correct) {
        feedbackEl.textContent = '✓ Correto! Parabéns!';
        feedbackEl.className = 'feedback correct';
    } else {
        feedbackEl.textContent = `✗ Incorreto. A resposta correta é: ${current.correct.charAt(0).toUpperCase() + current.correct.slice(1)}.`;
        feedbackEl.className = 'feedback incorrect';
    }
    
    nextBtn.style.display = 'block';
}

// Jogo 2: Preencher Lacunas
function initFillGame() {
    loadFillSentence();
    
    document.getElementById('checkFill').addEventListener('click', checkFillAnswer);
    document.getElementById('nextFill').addEventListener('click', () => {
        document.getElementById('nextFill').style.display = 'none';
        document.getElementById('fillFeedback').textContent = '';
        selectedFill = null;
        fillBlanks = [];
        loadFillSentence();
    });
}

function loadFillSentence() {
    const current = fillSentences[currentFillIndex];
    const sentenceEl = document.getElementById('fillSentence');
    const optionsEl = document.getElementById('fillOptions');
    
    sentenceEl.innerHTML = '';
    optionsEl.innerHTML = '';
    
    const parts = current.sentence.split('___');
    fillBlanks = [];
    
    parts.forEach((part, index) => {
        sentenceEl.appendChild(document.createTextNode(part));
        
        if (index < parts.length - 1) {
            const blank = document.createElement('span');
            blank.className = 'fill-blank';
            blank.dataset.index = index;
            blank.addEventListener('click', () => {
                if (selectedFill) {
                    blank.innerHTML = `<span class="fill-blank-text">${selectedFill.textContent}</span>`;
                    blank.classList.add('filled');
                    blank.dataset.value = selectedFill.dataset.option;
                    selectedFill.classList.add('used');
                    selectedFill = null;
                    document.querySelectorAll('.fill-option').forEach(opt => opt.classList.remove('selected'));
                }
            });
            fillBlanks.push(blank);
            sentenceEl.appendChild(blank);
        }
    });
    
    // Embaralhar opções
    const shuffled = [...current.options].sort(() => Math.random() - 0.5);
    
    shuffled.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'fill-option';
        btn.textContent = option;
        btn.dataset.option = option;
        btn.addEventListener('click', () => {
            if (!btn.classList.contains('used')) {
                document.querySelectorAll('.fill-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedFill = btn;
            }
        });
        optionsEl.appendChild(btn);
    });
}

function checkFillAnswer() {
    const current = fillSentences[currentFillIndex];
    const feedbackEl = document.getElementById('fillFeedback');
    const nextBtn = document.getElementById('nextFill');
    
    if (fillBlanks.length === 0 || !fillBlanks[0].dataset.value) {
        feedbackEl.textContent = 'Por favor, preencha a lacuna!';
        feedbackEl.className = 'feedback incorrect';
        return;
    }
    
    const answer = fillBlanks[0].dataset.value.toLowerCase();
    const correct = current.blank.toLowerCase();
    
    if (answer === correct) {
        feedbackEl.textContent = '✓ Correto! Parabéns!';
        feedbackEl.className = 'feedback correct';
    } else {
        feedbackEl.textContent = `✗ Incorreto. A resposta correta é: ${current.blank}.`;
        feedbackEl.className = 'feedback incorrect';
    }
    
    nextBtn.style.display = 'block';
    currentFillIndex = (currentFillIndex + 1) % fillSentences.length;
}

// Jogo 3: Classificação
function initSortGame() {
    resetSortGame();
    
    document.getElementById('checkSort').addEventListener('click', checkSortAnswer);
    document.getElementById('resetSort').addEventListener('click', resetSortGame);
}

function resetSortGame() {
    sortState = {
        conjuncao: [],
        preposicao: [],
        interjeicao: [],
        artigo: []
    };
    
    const wordsEl = document.getElementById('wordsToSort');
    const dropZones = ['dropConjuncao', 'dropPreposicao', 'dropInterjeicao', 'dropArtigo'];
    
    wordsEl.innerHTML = '';
    dropZones.forEach(zoneId => {
        document.getElementById(zoneId).innerHTML = '';
    });
    
    // Criar lista de todas as palavras embaralhadas
    const allWords = [];
    Object.keys(sortWords).forEach(category => {
        sortWords[category].forEach(word => {
            allWords.push({ word, category });
        });
    });
    
    // Embaralhar
    allWords.sort(() => Math.random() - 0.5);
    
    // Criar elementos arrastáveis
    allWords.forEach(({ word, category }) => {
        const wordEl = document.createElement('div');
        wordEl.className = 'sort-word';
        wordEl.textContent = word;
        wordEl.draggable = true;
        wordEl.dataset.word = word;
        wordEl.dataset.category = category;
        
        wordEl.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', word);
            e.dataTransfer.setData('category', category);
            wordEl.classList.add('dragging');
        });
        
        wordEl.addEventListener('dragend', () => {
            wordEl.classList.remove('dragging');
        });
        
        wordsEl.appendChild(wordEl);
    });
    
    // Configurar drop zones
    dropZones.forEach(zoneId => {
        const zone = document.getElementById(zoneId);
        const category = zoneId.replace('drop', '').toLowerCase();
        
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });
        
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            
            const word = e.dataTransfer.getData('text/plain');
            const wordCategory = e.dataTransfer.getData('category');
            
            // Remover da lista original se existir
            const wordEl = Array.from(wordsEl.children).find(el => el.dataset.word === word);
            if (wordEl) {
                wordEl.remove();
            }
            
            // Remover de outras categorias
            Object.keys(sortState).forEach(cat => {
                sortState[cat] = sortState[cat].filter(w => w !== word);
                const otherZone = document.getElementById(`drop${cat.charAt(0).toUpperCase() + cat.slice(1)}`);
                const item = Array.from(otherZone.children).find(el => el.textContent === word);
                if (item) item.remove();
            });
            
            // Adicionar à categoria correta
            if (!sortState[category].includes(word)) {
                sortState[category].push(word);
                
                const item = document.createElement('div');
                item.className = 'drop-zone-item';
                item.textContent = word;
                item.draggable = true;
                item.dataset.word = word;
                item.dataset.category = wordCategory;
                
                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', word);
                    e.dataTransfer.setData('category', wordCategory);
                    item.classList.add('dragging');
                });
                
                item.addEventListener('dragend', () => {
                    item.classList.remove('dragging');
                });
                
                item.addEventListener('dblclick', () => {
                    item.remove();
                    sortState[category] = sortState[category].filter(w => w !== word);
                    wordsEl.appendChild(wordEl);
                });
                
                zone.appendChild(item);
            }
        });
    });
    
    document.getElementById('sortFeedback').textContent = '';
    document.getElementById('resetSort').style.display = 'none';
}

function checkSortAnswer() {
    const feedbackEl = document.getElementById('sortFeedback');
    const resetBtn = document.getElementById('resetSort');
    
    let correct = 0;
    let total = 0;
    
    Object.keys(sortWords).forEach(category => {
        const correctWords = sortWords[category];
        const userWords = sortState[category] || [];
        
        total += correctWords.length;
        
        correctWords.forEach(word => {
            if (userWords.includes(word)) {
                correct++;
            }
        });
    });
    
    const percentage = Math.round((correct / total) * 100);
    
    if (percentage === 100) {
        feedbackEl.textContent = `✓ Perfeito! Você acertou todas as ${total} palavras!`;
        feedbackEl.className = 'feedback correct';
    } else if (percentage >= 70) {
        feedbackEl.textContent = `Bom trabalho! Você acertou ${correct} de ${total} palavras (${percentage}%).`;
        feedbackEl.className = 'feedback correct';
    } else {
        feedbackEl.textContent = `Você acertou ${correct} de ${total} palavras (${percentage}%). Continue tentando!`;
        feedbackEl.className = 'feedback incorrect';
    }
    
    resetBtn.style.display = 'block';
}

