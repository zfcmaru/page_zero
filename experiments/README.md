# experiments/

Pasta para experimentos browser self-contained. Cada experimento mora em sua própria subpasta com `index.html` próprio.

## Convenção

```
experiments/
└── <slug>/
    ├── index.html      # ponto de entrada
    ├── assets/         # imagens, sons, dados (opcional)
    └── README.md       # 1-2 parágrafos descrevendo o experimento (opcional)
```

## Regras

- **Sem build step.** Nada de bundler, npm, framework. HTML + CSS + JS vanilla.
- **Sem dependências em runtime que exijam chave.** Nenhuma chamada de LLM em runtime no front (chave vazaria).
- **Herda a grammar visual do site.** Importa `../../assets/css/style.css` se quiser os tokens PC-98 (`--bg`, `--fg`, `--accent`, `--font-display`). Pode adicionar CSS local depois.
- **Auto-contido.** Não depende de outros experimentos. `vn/` (Ocean Park) é a exceção histórica e fica na raiz por compatibilidade de URL pública.
- **Linkar do hub.** Quando publicar, adicionar entrada em `index.html` na seção "Experiments".

## Por que essa pasta existe

`page_zero` está virando playground de experimentos feitos com Claude Code como assistente. Ocean Park é o primeiro; o próximo experimento entra aqui. Sem essa convenção, cada novo experimento vira uma decisão estrutural — com ela, é só `mkdir experiments/<slug>` e começar.

## O que NÃO colocar aqui

- Posts de blog (vão para `blog/`).
- Arte sem código (vai para `art/`).
- Componentes/utilidades compartilhadas (este repo não tem isso — se aparecer, decidir caso a caso).
