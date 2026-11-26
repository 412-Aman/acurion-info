# Acurion information site

The public site about Acurion, the anti-money-laundering investigation workspace built by Team OMNYX. Six real pages, each with its own address, rather than one long page of anchors:

| Page | What it covers |
| --- | --- |
| Home (`index.html`) | What Acurion is, the challenge, the six capabilities, the workflow and responsible use |
| Platform (`platform.html`) | Acurion K7, dataset analysis, the rules engine, explainable alerts, account networks, cases and reporting |
| How it works (`how-it-works.html`) | Detect, review, investigate and report, with a product view that follows each step |
| Technology (`technology.html`) | The architecture, the three ways Acurion scores risk, security controls and the stack |
| Results (`results.html`) | Acurion K7's validation results, what they mean, quality checks and responsible use |
| Team (`team.html`) | Team OMNYX, the project timeline and the Innovation Fair |

The colours, logo, icons and product snippets come from the Acurion workspace itself (https://acurion.vercel.app): navy `#101d2d`, muted teal `#168c83`, cool grey `#eaf0f3`.

## Run it

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # type check and production build into dist/
npm run preview
```

## How it is built

- Vite multi-page build. The shared head, header and footer live in `src/partials/` and are placed into every page at build time, with the current page marked; `<i data-i="name"></i>` becomes an inline icon from `src/icons.ts`.
- `src/styles/site.css` holds the design tokens and shared parts, `pages.css` the page layouts, `product.css` the snippets of the Acurion workspace.
- Moving between pages uses cross-document view transitions: the header stays put and the current-page marker slides to the new page.
- The animated product scenes (`src/scenes/`) are React components built on the Stageshow kit (`src/kit/`, MIT licensed). They load only on pages that show them, when they scroll near the viewport, and show their finished state when reduced motion is on.
- `vercel.json` sets a Content Security Policy and security headers.
