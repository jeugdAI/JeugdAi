# JeugdAi Frontend

Een moderne React + Vite frontend applicatie met Tailwind CSS en custom UI componenten.

## 🚀 Features

- **React 19** - Laatste versie van React
- **Vite** - Snelle development en build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Custom UI Componenten** - Button, Card, Input, Textarea, Badge, Alert, Label
- **Hot Module Replacement (HMR)** - Instant feedback in development
- **React Compiler** - Geoptimaliseerde performance

## 📦 Installatie

```bash
# Dependencies installeren
npm install

# Development server starten
npm run dev

# Build voor productie
npm run build

# Preview van build
npm run preview
```

## 📁 Projectstructuur

```
src/
├── components/
│   └── ui/                # UI componenten library
│       ├── button.jsx
│       ├── card.jsx
│       ├── input.jsx
│       ├── textarea.jsx
│       ├── label.jsx
│       ├── badge.jsx
│       ├── alert.jsx
│       └── utils.js
├── App.jsx               # Hoofd component
├── main.jsx             # Entry point
└── index.css            # Tailwind styles
```

## 🎨 UI Componenten

### Button
```jsx
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
```

### Card
```jsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Input
```jsx
<Input placeholder="Voer tekst in..." type="text" />
<Input placeholder="je@email.com" type="email" />
```

## 🎯 Development

- HMR is ingeschakeld - wijzigingen worden direct weergegeven
- ESLint is geconfigureerd voor code quality
- React Compiler is actief voor optimalisatie

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build voor productie
- `npm run lint` - Voer ESLint uit
- `npm run preview` - Preview production build
