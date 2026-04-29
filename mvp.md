You are an expert full-stack engineer. You are running inside Claude Code with permission to create files, modify files, and run shell commands.

Your task: fully scaffold and implement an MVP project called "system-design-playground".

You MUST:
- Create files directly in the workspace (do not just output code)
- Run shell commands when needed (npm, etc.)
- Ensure the project can run successfully

----------------------------------

STEP 1: Initialize project

- Create a Vite + React + TypeScript project
- Project name: system-design-playground

Run:
npm create vite@latest system-design-playground -- --template react-ts

Then:
cd system-design-playground
npm install

----------------------------------

STEP 2: Install dependencies

Install required libraries:

npm install reactflow zustand

----------------------------------

STEP 3: Project structure

Inside src/, create:

- App.tsx
- main.tsx (modify if needed)
- components/
    - Canvas.tsx
    - ComponentPalette.tsx
    - AnalysisPanel.tsx
- store/
    - useStore.ts
- logic/
    - rules.ts
- styles/
    - layout.css

----------------------------------

STEP 4: Implement core features

Implement a 3-column layout:

LEFT: ComponentPalette
CENTER: Canvas (React Flow)
RIGHT: AnalysisPanel

----------------------------------

ComponentPalette.tsx:

- Show draggable items:
  - Load Balancer (type: lb)
  - App Server (type: app)
  - Database (type: db)
  - Cache (type: cache)

----------------------------------

Canvas.tsx:

- Use React Flow
- Support:
  - Dragging nodes into canvas
  - Connecting nodes
- Node structure:
  {
    id: string
    type: string
    data: { label: string }
  }

----------------------------------

AnalysisPanel.tsx:

- Add button: "Analyze"
- Display:
  - Issues (red)
  - Suggestions (green)

----------------------------------

rules.ts:

Implement function:

analyze(nodes, edges)

Rules:

1. No db → "Missing database"
2. Only 1 db → "Single point of failure"
3. No cache → "No cache, poor read performance"
4. No lb → "No load balancer, poor scalability"

Return:
{
  issues: string[],
  suggestions: string[]
}

----------------------------------

STEP 5: Reference architecture

Add button:
"Load Reference"

When clicked:
Render:

LB → App → Cache → DB

----------------------------------

STEP 6: Styling

- Basic clean layout (flexbox)
- 3 columns
- Minimal but readable UI

----------------------------------

STEP 7: Run project

After all files are created:

Run:
npm run dev

----------------------------------

IMPORTANT:

- Do NOT just print code
- You MUST create and write files
- You MUST execute commands
- Ensure project compiles without errors

Start now.
