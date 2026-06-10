# ResearchOS — Project Structure

## Root Layout

```
researchos/
├── frontend/               # Next.js 15 app
├── backend/                # FastAPI Python app
├── docker-compose.yml      # Local dev orchestration
├── .env.example            # Environment variable template
└── README.md
```

---

## Frontend (`/frontend`)

```
frontend/
├── public/
│   └── icons/
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── onboarding/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx           # Sidebar + main layout
│   │   │   ├── page.tsx             # Dashboard home
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx         # All projects
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Single project workspace
│   │   │   ├── search/
│   │   │   │   └── page.tsx         # AI paper search
│   │   │   ├── library/
│   │   │   │   └── page.tsx         # Saved papers
│   │   │   ├── upload/
│   │   │   │   └── page.tsx         # PDF upload + chat
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/                     # Next.js API routes (proxy layer)
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   │
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css
│   │   └── page.tsx                 # Landing page
│   │
│   ├── components/
│   │   ├── ui/                      # shadcn/ui primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── toast.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx          # Left sidebar
│   │   │   ├── RightPanel.tsx       # AI suggestions panel
│   │   │   ├── TopBar.tsx
│   │   │   └── MobileNav.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── OnboardingFlow.tsx
│   │   │
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── PaperCard.tsx
│   │   │   ├── SearchFilters.tsx
│   │   │   └── SearchResults.tsx
│   │   │
│   │   ├── pdf/
│   │   │   ├── PDFUploader.tsx
│   │   │   ├── PDFViewer.tsx
│   │   │   └── PDFChatPanel.tsx
│   │   │
│   │   ├── workspace/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── FolderTree.tsx
│   │   │   ├── Editor.tsx
│   │   │   └── CitationList.tsx
│   │   │
│   │   ├── ai/
│   │   │   ├── AIChat.tsx
│   │   │   ├── AIMessage.tsx        # Evidence-first message renderer
│   │   │   ├── StreamingText.tsx
│   │   │   ├── LitReviewPanel.tsx
│   │   │   └── SuggestionsPanel.tsx
│   │   │
│   │   └── citations/
│   │       ├── CitationGenerator.tsx
│   │       └── CitationCard.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSearch.ts
│   │   ├── usePDFChat.ts
│   │   ├── useStreamingAI.ts
│   │   └── useProject.ts
│   │
│   ├── store/                       # Zustand stores
│   │   ├── authStore.ts
│   │   ├── projectStore.ts
│   │   ├── searchStore.ts
│   │   └── uiStore.ts
│   │
│   ├── lib/
│   │   ├── api.ts                   # Axios/fetch client
│   │   ├── auth.ts                  # NextAuth config
│   │   ├── utils.ts                 # cn() and helpers
│   │   └── constants.ts
│   │
│   └── types/
│       ├── paper.ts
│       ├── project.ts
│       ├── user.ts
│       └── ai.ts
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json              # shadcn/ui config
└── package.json
```

---

## Backend (`/backend`)

```
backend/
├── app/
│   ├── main.py                      # FastAPI entry point
│   ├── config.py                    # Settings (pydantic-settings)
│   │
│   ├── api/
│   │   └── v1/
│   │       ├── router.py            # Mounts all routers
│   │       ├── auth.py              # /auth endpoints
│   │       ├── papers.py            # /papers endpoints
│   │       ├── projects.py          # /projects endpoints
│   │       ├── pdf.py               # /pdf upload + chat
│   │       ├── citations.py         # /citations endpoints
│   │       ├── litreview.py         # /litreview generator
│   │       ├── suggestions.py       # /suggestions endpoints
│   │       └── payments.py          # /payments (Stripe + SSLCOMMERZ)
│   │
│   ├── core/
│   │   ├── database.py              # SQLAlchemy async engine
│   │   ├── security.py              # JWT, password hashing
│   │   ├── dependencies.py          # FastAPI dependency injection
│   │   └── exceptions.py
│   │
│   ├── models/                      # SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── paper.py
│   │   ├── pdf_upload.py
│   │   ├── ai_session.py
│   │   └── saved_paper.py
│   │
│   ├── schemas/                     # Pydantic request/response schemas
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── paper.py
│   │   ├── pdf.py
│   │   └── ai.py
│   │
│   ├── services/                    # Business logic
│   │   ├── auth_service.py
│   │   ├── search_service.py        # OpenAlex + Semantic Scholar + arXiv
│   │   ├── pdf_service.py           # Text extraction + chunking
│   │   ├── embedding_service.py     # pgvector embeddings
│   │   ├── ai_service.py            # LiteLLM wrapper
│   │   ├── citation_service.py
│   │   ├── litreview_service.py
│   │   └── payment_service.py
│   │
│   ├── agents/                      # Multi-agent AI system
│   │   ├── search_agent.py
│   │   ├── verification_agent.py
│   │   ├── citation_agent.py
│   │   ├── writing_agent.py
│   │   ├── gap_detection_agent.py
│   │   └── trend_agent.py
│   │
│   ├── tasks/                       # Celery async tasks
│   │   ├── celery_app.py
│   │   ├── pdf_tasks.py
│   │   ├── embedding_tasks.py
│   │   └── litreview_tasks.py
│   │
│   └── utils/
│       ├── s3.py                    # AWS S3 helpers
│       ├── cache.py                 # Redis helpers
│       └── text.py                  # Chunking, cleaning
│
├── alembic/                         # DB migrations
│   ├── env.py
│   └── versions/
│
├── tests/
│   ├── test_auth.py
│   ├── test_search.py
│   └── test_pdf.py
│
├── requirements.txt
├── Dockerfile
└── .env
```

---

## Docker Compose (root)

```
docker-compose.yml                   # postgres + redis + backend + frontend
.env.example                         # all required env vars listed
```

---

## Build Order (file-by-file plan)

| # | File | Location |
|---|------|----------|
| 1 | PROJECT_STRUCTURE.md | root |
| 2 | .env.example | root |
| 3 | docker-compose.yml | root |
| 4 | package.json | frontend/ |
| 5 | next.config.ts | frontend/ |
| 6 | tailwind.config.ts | frontend/ |
| 7 | globals.css | frontend/src/app/ |
| 8 | tsconfig.json | frontend/ |
| 9 | components.json | frontend/ |
| 10 | lib/utils.ts | frontend/src/lib/ |
| 11 | lib/constants.ts | frontend/src/lib/ |
| 12 | types/*.ts (all 4) | frontend/src/types/ |
| 13 | store/authStore.ts | frontend/src/store/ |
| 14 | store/projectStore.ts | frontend/src/store/ |
| 15 | app/layout.tsx (root) | frontend/src/app/ |
| 16 | app/page.tsx (landing) | frontend/src/app/ |
| 17 | app/(auth)/login/page.tsx | frontend/src/app/ |
| 18 | app/(auth)/register/page.tsx | frontend/src/app/ |
| 19 | app/(auth)/onboarding/page.tsx | frontend/src/app/ |
| 20 | components/layout/Sidebar.tsx | frontend/src/components/ |
| 21 | components/layout/TopBar.tsx | frontend/src/components/ |
| 22 | components/layout/RightPanel.tsx | frontend/src/components/ |
| 23 | app/(dashboard)/layout.tsx | frontend/src/app/ |
| 24 | app/(dashboard)/page.tsx | frontend/src/app/ |
| 25 | components/search/* | frontend/src/components/ |
| 26 | app/(dashboard)/search/page.tsx | frontend/src/app/ |
| 27 | components/pdf/* | frontend/src/components/ |
| 28 | app/(dashboard)/upload/page.tsx | frontend/src/app/ |
| 29 | components/ai/AIChat.tsx | frontend/src/components/ |
| 30 | components/ai/LitReviewPanel.tsx | frontend/src/components/ |
| 31 | backend/requirements.txt | backend/ |
| 32 | backend/Dockerfile | backend/ |
| 33 | backend/app/config.py | backend/app/ |
| 34 | backend/app/main.py | backend/app/ |
| 35 | backend/app/core/database.py | backend/app/core/ |
| 36 | backend/app/core/security.py | backend/app/core/ |
| 37 | backend/app/models/*.py (all) | backend/app/models/ |
| 38 | backend/app/schemas/*.py (all) | backend/app/schemas/ |
| 39 | backend/app/api/v1/auth.py | backend/app/api/ |
| 40 | backend/app/services/auth_service.py | backend/app/services/ |
| 41 | backend/app/api/v1/papers.py | backend/app/api/ |
| 42 | backend/app/services/search_service.py | backend/app/services/ |
| 43 | backend/app/api/v1/pdf.py | backend/app/api/ |
| 44 | backend/app/services/pdf_service.py | backend/app/services/ |
| 45 | backend/app/services/embedding_service.py | backend/app/services/ |
| 46 | backend/app/services/ai_service.py | backend/app/services/ |
| 47 | backend/app/agents/*.py (all 6) | backend/app/agents/ |
| 48 | backend/app/tasks/* | backend/app/tasks/ |
| 49 | backend/app/api/v1/router.py | backend/app/api/ |
| 50 | alembic/ setup | backend/alembic/ |
