# QEE Clarity Orbit Hero

A full-width, scroll-driven Three.js hero concept for QEE.

## Concept

Fragmented operational signals flow into a smooth glass assurance system. Internal audit, risk, finance, governance and cybersecurity align around a central clarity lens. The final stage produces three structured output currents: Quality, Efficiency and Effectiveness.

## Features

- Full-screen live Three.js scene
- Smooth spheres, torus rings and high-resolution tube curves
- Four scroll-controlled chapters
- Pointer-responsive camera, lighting and object parallax
- QEE dark/cyan visual palette
- Loading screen that prevents unstyled HTML flashes
- Responsive mobile composition
- Reduced-motion support
- Node.js 20 configuration for Vercel

## Local development

```bash
npm ci --no-audit --no-fund
npm run dev
```

## Production build

```bash
npm run build
```

## Vercel

- Framework: Vite
- Node.js: 20.x
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci --no-audit --no-fund`

The repository includes `.nvmrc`, `.node-version`, `package.json` engines and `vercel.json` configured for Node 20.
