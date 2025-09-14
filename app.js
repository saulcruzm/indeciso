// Data
const categories = {
    food: ['Pizza', 'Sushi', 'Alitas', 'Tacos', 'Chinese', 'Junk', 'Salty', 'Fit', 'Sweet'],
    drinks: ['Coffee', 'Tea', 'Water', 'Juice', 'Smoothie', 'Beer', 'Smoothie'],
    movies: [],
    custom: []
};

let currentCategory = 'food';
let currentOptions = [...categories.food];

// DOM
const categoryBtns = document.querySelectorAll('.category-btn');
const optionInput = document.getElementById('optionInput');
const addBtn = document.getElementById('addBtn');
const optionsList = document.getElementById('optionsList');
const decideBtn = document.getElementById('decideBtn');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');
const diceIcon = document.querySelector('.dice-icon');

// Events
categoryBtns.forEach(btn => btn.addEventListener('click', () => switchCategory(btn.dataset.category)));
addBtn.addEventListener('click', addOption);
optionInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addOption(); });
decideBtn.addEventListener('click', makeDecision);
// Event delegation for removing options
optionsList.addEventListener('click', (e) => {
    const btn = e.target.closest('.remove-option');
    if (!btn) return;
    const index = Number(btn.dataset.index);
    if (Number.isInteger(index)) removeOption(index, btn);
});

// Functions
function switchCategory(category) {
    currentCategory = category;
    currentOptions = [...categories[category]];
    categoryBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.category === category));
    renderOptions();
}

function addOption() {
    const value = optionInput.value.trim();
    if (value && !currentOptions.includes(value)) {
        currentOptions.push(value);
        optionInput.value = '';
        renderOptions(true);
    }
}

function removeOption(index, el) {
    const tag = el ? el.closest('.option-tag') : null;
    if (tag) {
        tag.classList.add('exit');
        setTimeout(() => {
            currentOptions.splice(index, 1);
            renderOptions();
        }, 180);
    } else {
        currentOptions.splice(index, 1);
        renderOptions();
    }
}

function renderOptions(justAdded = false) {
    if (!currentOptions.length) {
        optionsList.innerHTML = '<div class="empty-state">Add some options to get started</div>';
        decideBtn.disabled = true;
        return;
    }
    optionsList.innerHTML = currentOptions.map((opt, i) => `
    <div class="option-tag${justAdded && i === currentOptions.length - 1 ? ' new' : ''}">
      ${opt}
      <button class="remove-option" data-index="${i}" aria-label="Remove ${opt}">×</button>
    </div>
  `).join('');
    decideBtn.disabled = false;
}

function makeDecision() {
    if (!currentOptions.length) return;

    // Button bounce
    decideBtn.classList.remove('fx');
    void decideBtn.offsetWidth; // restart animation
    decideBtn.classList.add('fx');

    // Dice spin
    diceIcon.classList.remove('rolling');
    void diceIcon.offsetWidth;
    diceIcon.classList.add('rolling');

    // Choose & animate result card (visible pop)
    setTimeout(() => {
        const choice = currentOptions[Math.floor(Math.random() * currentOptions.length)];
        resultText.textContent = choice;

        // Ensure it's in the document flow and visible
        resultSection.classList.add('show');

        // Retrigger the pop animation each time
        resultSection.classList.remove('fx');
        void resultSection.offsetWidth;   // force reflow to restart
        resultSection.classList.add('fx');

        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
}

const closeResultBtn = document.getElementById('closeResult');

closeResultBtn.addEventListener('click', () => {
    resultSection.classList.remove('fx');
    resultSection.classList.add('hide');
    setTimeout(() => {
        resultSection.classList.remove('show', 'hide');
        resultText.textContent = '';
    }, 300); // match animation duration
});


// Init
renderOptions();
