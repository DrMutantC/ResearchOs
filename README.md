# ResearchOS

AI-powered operating system for scientific research.

ResearchOS combines academic search, AI-assisted literature reviews, PDF intelligence, citation management, and project organization into a single platform.

---

## Features

### Academic Search
- OpenAlex integration
- Semantic Scholar integration
- arXiv integration
- AI query expansion
- Advanced filtering
- Relevance ranking

### AI Research Assistant
- Literature review generation
- Research gap detection
- Evidence-based responses
- Citation-backed answers
- Research suggestions

### PDF Intelligence
- PDF upload
- AI chat with papers
- Automatic summaries
- Semantic document search
- Citation extraction

### Research Workspace
- Project management
- Saved paper library
- Research collections
- Knowledge organization

---

## Tech Stack

### Frontend
- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Zustand
- TanStack Query
- shadcn/ui

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- Redis
- Celery

### AI
- OpenAI
- LiteLLM
- Vector Embeddings
- Multi-Agent Architecture

---

## Project Structure

```text
researchos/
├── frontend/
├── backend/
├── docker-compose.yml
├── .env.example
└── README.md
```

### Frontend

```text
frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── store/
│   ├── lib/
│   └── types/
```

### Backend

```text
backend/
├── app/
│   ├── api/
│   ├── core/
│   ├── services/
│   ├── agents/
│   ├── tasks/
│   └── models/
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/DrMutantC/ResearchOS.git
cd ResearchOS
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```text
http://localhost:3000
```

### Backend

```bash
cd backend

python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Runs on:

```text
http://localhost:8000
```

---

## Environment Variables

### Frontend

Create:

```bash
frontend/.env.local
```

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Backend

Create:

```bash
backend/.env
```

```env
DATABASE_URL=
OPENAI_API_KEY=
REDIS_URL=
SECRET_KEY=
```

---

## Roadmap

- [x] Authentication
- [x] Academic search
- [x] PDF upload workflow
- [x] AI chat foundation
- [x] Dashboard UI
- [ ] Citation generator
- [ ] Automated literature reviews
- [ ] Research graph visualization
- [ ] Team collaboration
- [ ] Mobile support

---

## Author

**Md Saffat Hossain**

GitHub:
https://github.com/DrMutantC

---

## License

MIT License