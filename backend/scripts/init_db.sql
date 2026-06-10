-- =============================================================================
-- ResearchOS — DB Initialization Script
-- Runs once automatically when the postgres container first starts.
-- =============================================================================

-- Enable pgvector for semantic search embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable case-insensitive text
CREATE EXTENSION IF NOT EXISTS citext;