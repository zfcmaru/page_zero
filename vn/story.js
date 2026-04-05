// ─────────────────────────────────────────────────────────────
// CHARACTERS — define display name e cor do name-box
// ─────────────────────────────────────────────────────────────
const CHARACTERS = {
  player: { name: "Player",  color: "#a0c0ff" },
  kanon:  { name: "Kanon",   color: "#c084fc" }
};

// ─────────────────────────────────────────────────────────────
// SPRITES — mapa de nome para caminho de arquivo
// ─────────────────────────────────────────────────────────────
const SPRITES = {
  neutral:   "../art/Girl_neutral.png",
  semi_rest: "../art/Girl_semi_rest.png",
  rest:      "../art/Girl_rest.png",
  angry:     "../art/Girl_angry.png"
};

// ─────────────────────────────────────────────────────────────
// SCRIPT — grafo de nós da história
//
// Campos de cada nó:
//   speaker : chave de CHARACTERS (ou "" para narração)
//   text    : string do diálogo
//   bg      : caminho do background (opcional, só quando muda)
//   sprite  : chave de SPRITES (opcional, herda o anterior se omitido)
//   next    : id do próximo nó (ou "END")
// ─────────────────────────────────────────────────────────────
const SCRIPT = {
  s01: {
    speaker: "",
    text: "...",
    bg: "../art/Background.png",
    sprite: "neutral",
    next: "s02"
  },
  s02: {
    speaker: "player",
    text: "Hey... have you seen a girl around here? Her name's Mika. My sister.",
    next: "s03"
  },
  s03: {
    speaker: "kanon",
    text: "Mika? Doesn't ring a bell.",
    next: "s04"
  },
  s04: {
    speaker: "kanon",
    text: "I'm Kanon, by the way. Fitness content creator. I basically live at this pier.",
    next: "s05"
  },
  s05: {
    speaker: "player",
    text: "Right. I'm just passing through, looking for her.",
    next: "s06"
  },
  s06: {
    speaker: "kanon",
    text: "Well, while you wait — come windsurfing with me. Wind's perfect right now.",
    next: "choice_01"
  },

  // Branch YES
  choice_yes: {
    speaker: "player",
    text: "Sure. I've got time.",
    next: "s_yes_end"
  },
  s_yes_end: {
    speaker: "kanon",
    text: "Let's go then.",
    next: "END"
  },

  // Branch NO
  choice_no: {
    speaker: "player",
    text: "I'd rather not.",
    sprite: "angry",
    next: "s_no_end"
  },
  s_no_end: {
    speaker: "kanon",
    text: "You're so boring!",
    sprite: "angry",
    next: "END"
  }
};

// ─────────────────────────────────────────────────────────────
// CHOICES — nós de bifurcação (separados do SCRIPT)
// ─────────────────────────────────────────────────────────────
const CHOICES = {
  choice_01: {
    options: [
      { label: "Sure, I've got time.", next: "choice_yes" },
      { label: "I'd rather not.",      next: "choice_no"  }
    ]
  }
};
