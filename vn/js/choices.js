// ── CHOICE UI ─────────────────────────────────────────────────────────────
let choiceIndex     = 0;
let currentChoiceId = null;

function showChoice(choiceId) {
  currentChoiceId = choiceId;
  choiceIndex = 0;
  const choice = CHOICES[choiceId];

  els.choiceContainer.innerHTML = '';
  choice.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = opt.label;
    btn.dataset.index = i;
    btn.addEventListener('click', () => confirmChoice(choice, i));
    btn.addEventListener('touchstart', e => {
      e.preventDefault();
      confirmChoice(choice, i);
    }, { passive: false });
    btn.addEventListener('mouseenter', () => {
      choiceIndex = i;
      updateChoiceHighlight();
    });
    els.choiceContainer.appendChild(btn);
  });

  updateChoiceHighlight();

  els.nameBox.textContent = '';
  els.nameBox.style.display = 'none';
  els.dialogText.textContent = '';
  els.hint.style.opacity = '0';

  els.choiceContainer.classList.add('is-active');
  els.choicePlaceholder.style.display = 'none';

  enterChoosing(choiceId);
}

function updateChoiceHighlight() {
  const btns = els.choiceContainer.querySelectorAll('.choice-btn');
  btns.forEach((btn, i) => {
    btn.classList.toggle('choice-btn--active', i === choiceIndex);
  });
}

function confirmChoice(choice, index) {
  els.choiceContainer.classList.remove('is-active');
  els.choiceContainer.innerHTML = '';
  els.choicePlaceholder.style.display = '';
  gameState.phase = 'dialogue';
  showBeat(choice.options[index].next);
}
