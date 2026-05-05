<div align="center">

# Business AI Copilot

### AI-Powered Business Intelligence for Everyone

**Transform raw time-series data into forecasts, insights, dashboards, and conversational guidance — no technical skills required.**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Language-Python-3776AB?style=flat-square&logo=python)](https://python.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql)](https://postgresql.org/)
[![Redis](https://img.shields.io/badge/Cache-Redis-DC382D?style=flat-square&logo=redis)](https://redis.io/)
[![Prophet](https://img.shields.io/badge/Forecasting-Prophet-4285F4?style=flat-square)](https://facebook.github.io/prophet/)
[![Groq](https://img.shields.io/badge/LLM-Groq%20%2F%20LLaMA%203.3-orange?style=flat-square)](https://groq.com/)

</div>

---

> [!IMPORTANT]
> This project is NOT open source.  
> It is released under a proprietary license.  
> Commercial use, redistribution, or SaaS deployment is not allowed without explicit permission.

---

## Table of Contents

1. [What Is Business AI Copilot?](#1-what-is-business-ai-copilot)
2. [The Problem We Solve](#2-the-problem-we-solve)
3. [Core Features](#3-core-features)
4. [How It Works](#4-how-it-works)
5. [Intelligence Engines](#5-intelligence-engines)
6. [AI Chat Copilot](#6-ai-chat-copilot)
7. [API Reference](#7-api-reference)
8. [Technical Architecture](#8-technical-architecture)
9. [Database Design](#9-database-design)
10. [Security & Ownership](#10-security--ownership)
11. [Why Business AI Copilot?](#11-why-business-ai-copilot)
12. [Competitive Comparison](#12-competitve-comparison)
13. [Example Use Cases](#13-example-use-cases)
14. [Local Setup](#14-local-setup)
15. [Roadmap](#15-roadmap)

---

## 1. What Is Business AI Copilot?

Most businesses generate data every day — sales, orders, revenue, traffic, bookings. But generating data and _understanding_ it are two different things.

**Business AI Copilot** takes raw time-series CSV data and automatically runs it through a multi-stage intelligence pipeline: cleaning, forecasting, anomaly detection, seasonality analysis, root-cause reasoning, and a conversational AI copilot that answers questions in plain language.

It's built to answer the five questions every business leader actually cares about:

| #   | Question                       | How We Answer It                                     |
| --- | ------------------------------ | ---------------------------------------------------- |
| 1   | **What is happening?**         | Trend detection, KPI dashboards, anomaly alerts      |
| 2   | **Why is it happening?**       | Rule-based signal-driven reasoning engine            |
| 3   | **What will happen next?**     | Prophet-based time-series forecasting                |
| 4   | **What should I do?**          | Prioritized, context-aware recommendations           |
| 5   | **Can you explain it simply?** | Groq-powered LLaMA 3.3 copilot grounded in your data |

Traditional analytics tools answer question one — they show you a chart. Business AI Copilot answers all five.

---

## 2. The Problem We Solve

For most businesses, value breaks down somewhere between "the data exists" and "we know what to do about it."

**Small businesses** have sales data sitting in CSV exports that's never systematically analyzed. Decisions are made on gut instinct. Problems are noticed weeks after they start — often too late.

**Growing businesses** spend hours assembling reports manually, maintain conflicting spreadsheets across teams, and have no forward-looking signal — just a rearview mirror.

**Analysts** spend most of their time cleaning data, not generating insight. Communicating findings requires re-explaining statistical concepts to non-technical audiences every time.

**Decision makers** don't need more data. They need answers:

- _Why did revenue drop last week?_
- _Is this decline temporary or structural?_
- _Should we increase inventory heading into next month?_

Business AI Copilot is engineered to answer these questions automatically, every time data is uploaded.

---

## 3. Core Features

### CSV Upload

Upload any time-series CSV — daily sales, monthly revenue, web traffic, order history, inventory logs. The platform accepts flexible column names and formats, with a 5MB file size limit. No template required.

### Automatic Data Preparation

Raw business data is messy. The data engine automatically detects date and metric columns using fuzzy matching and weighted scoring, handles inconsistent date formats, drops bad rows, aggregates duplicates, clips outliers, and infers data frequency (daily / weekly / monthly) — all without any user configuration.

### Forecasting

Facebook Prophet generates forward-looking projections scaled to your dataset size, with forecast horizon dynamically set based on data length. The output spans both historical and future dates for seamless chart rendering.

### Analytics Signals

Four analytical signals are extracted from every dataset:

- **Trend** — linear regression across the full time series classifies direction (upward / downward / flat) and strength (strong / moderate / weak)
- **Change** — rolling window comparisons compute recent performance vs. prior periods (7-day and 30-day percentage change)
- **Anomaly Detection** — STL decomposition extracts residuals, z-score normalized. Points with `|z| ≥ 2.5` are flagged with severity tiers (low / medium / high) and classified as spikes or drops
- **Seasonality** — STL decomposition identifies weekly or yearly patterns, quantifies seasonal strength, and characterizes the pattern (e.g., "weekend dips", "weekend spikes")

### Business Insights

A rule-based reasoning engine translates every analytical signal into natural-language summaries, root-cause explanations, and actionable recommendations. This step is entirely deterministic — no LLM is involved in generating insights, so outputs are always traceable to real signals.

### Interactive Dashboard

A single API call aggregates analytics, insights, forecasts, and processed data into one ready-to-render payload. All data is pre-computed at upload time — the dashboard performs zero computation at query time.

### AI Chat Copilot

A Groq-powered LLaMA 3.3 copilot answers questions about your data in plain language. Every response is grounded in pre-computed analytics injected into the model's context — the LLM explains and elaborates on validated facts rather than computing from raw data.

---

## 4. How It Works

```
CSV Upload
    │
    ▼
Data Cleaning & Frequency Inference
    │
    ▼
Prophet Forecasting
    │
    ▼
Analytics Signals (trend, change, anomalies, seasonality)
    │
    ▼
Business Insights (summary, reasons, recommendations)
    │
    ▼
Dashboard API (zero-computation reads from indexed tables)
    │
    ▼
AI Copilot Chat (Groq / LLaMA 3.3, grounded in stored analytics)
```

The entire pipeline — from raw CSV to chat-ready dashboard — runs automatically on upload. No column mapping, no template selection, no dashboard building required.

**Pipeline integrity:** All outputs (processed data, forecasts, analytics, insights) are committed atomically. If any step fails, nothing is persisted — the database never ends up with partial results.

---

## 5. Intelligence Engines

The platform is composed of four modular engines, each with a clean interface. They can be upgraded or replaced independently without affecting the others.

### DataEngine

Transforms any raw CSV into a clean `{ date, value }` time series. Uses fuzzy column matching and weighted scoring to handle messy real-world exports — prioritizing revenue columns over price, price over discount, and so on. Infers whether to sum or average when aggregating duplicate dates based on the metric type.

### ForecastEngine

Wraps Facebook Prophet to generate predictions. Forecast horizon scales dynamically with dataset length. Full history is included in the output, enabling a seamless historical-to-forecast chart with no visual break.

### AnalyticsEngine

Extracts structured numerical signals using STL decomposition and linear regression. Uses `robust=True` in decomposition to resist outlier distortion. Window sizes for change calculations are normalized to the inferred data frequency (so "7 days" means the right number of data points whether data is daily, weekly, or monthly). All computations include minimum data guards to handle small datasets gracefully.

### InsightsEngine

Translates analytics signals into human-readable reasoning. Entirely rule-based — every output sentence is deterministically derived from signal thresholds, not generated by an LLM. Cross-checks trend, change, anomalies, and forecast together to produce compound narratives (e.g., "decline visible historically, recently, and in forecast"). Assigns a confidence score (high / medium / low) based on how many strong signals align.

**Example analytics output:**

```json
{
  "trend": { "direction": "downwards", "strength": "moderate" },
  "change": { "last_7d": -8.3, "last_30d": -11.2 },
  "anomaly_summary": { "count": 3, "recent_count": 1 },
  "seasonality": {
    "pattern": "weekend dips",
    "strength": "medium",
    "seasonal_strength_score": 0.48
  },
  "forecast": { "trend": "downward", "change_pct": -9.5 }
}
```

---

## 6. AI Chat Copilot

### How It Works

The copilot is powered by Groq's API with `llama-3.3-70b-versatile`. On every chat request, the service checks Redis for a cached analytics context. If warm, context and message history are served directly from memory. If cold, they are loaded from PostgreSQL and cached for subsequent requests.

The analytics context is injected as a system prompt on every API call, grounding every response in pre-computed, validated data. The model is explicitly instructed to use only the provided dashboard data, never invent numbers or trends, and clearly state when information isn't available.

**Why this is better than a generic AI chatbot:**
A generic chatbot asked to analyze a CSV would attempt statistical computations inside the language model, often producing inconsistent and hallucinated results. Here, all computation happens once at upload time in purpose-built Python engines. The LLM’s role is strictly to interpret and explain verified data in plain language.

---

### Response Format

The system prompt enforces structured outputs based on question type:

- “Why” questions → cause, evidence, action
- “What should I do” → prioritized recommendations

The model runs at a low temperature (0.4) to ensure consistent, factual responses.

---

### Caching Strategy

- Analytics context is stored in Redis with a 1-hour TTL and reused across requests
- The system caches **fully constructed LLM-ready context and recent message history**, avoiding repeated context generation and history reconstruction
- Message history is capped at 10 messages to keep token usage predictable
- Cache is **dataset-aware**, automatically refreshing when the dataset changes
- A background task pre-warms the cache when the dashboard loads, ensuring the first chat message is instant

**Performance impact:**
Without caching, each message required database queries, context building, and prompt reconstruction—resulting in **~10–20 seconds latency**.
With caching, responses are generated directly from memory, reducing latency to **milliseconds** and creating a real-time chat experience.

---

## 7. API Reference

All endpoints return a standard response envelope:

```json
{
  "success": true,
  "message": "Human-readable status message",
  "data": { ... },
  "error": null
}
```

### Authentication — `/api/auth`

JWT tokens stored in HttpOnly cookies (immune to XSS). Tokens expire after 24 hours.

```
POST   /api/auth/register     → Register; sets auth cookie
POST   /api/auth/login        → Authenticate; sets auth cookie
POST   /api/auth/logout       → Clears auth cookie
GET    /api/auth/me           → Returns { id, name, email, created_at }
```

### Datasets — `/api/datasets`

```
POST   /api/datasets/upload       → Upload CSV; triggers full pipeline
GET    /api/datasets/             → List all datasets for current user
GET    /api/datasets/{id}         → Get dataset metadata
DELETE /api/datasets/{id}         → Delete dataset + all associated data
```

Upload validates file extension (`.csv` only), file size (≤ 5MB), and CSV parseability before running the pipeline.

### Analytics — `/api/analytics`

All endpoints validate dataset ownership — users can only access their own data.

```
GET    /api/analytics/{id}/analytics       → AnalyticsEngine output
GET    /api/analytics/{id}/insights        → InsightsEngine output
GET    /api/analytics/{id}/forecast        → [{ ds, yhat }, ...]
GET    /api/analytics/{id}/processed-data  → [{ ds, y }, ...]
GET    /api/analytics/{id}/dashboard       → All of the above in one call
```

The `/dashboard` endpoint fires a background task to warm the Redis chat cache.

### Chat — `/api/chats`

```
GET    /api/chats/{dataset_id}    → Full message history
POST   /api/chats/{dataset_id}    → Send message; returns assistant reply
```

---

## 8. Technical Architecture

### Stack

| Layer           | Technology       | Role                                         |
| --------------- | ---------------- | -------------------------------------------- |
| Web Framework   | FastAPI          | Async API server with OpenAPI docs           |
| ORM             | SQLAlchemy 2.x   | Database access with typed mapped classes    |
| Database        | PostgreSQL       | Primary store for all pipeline outputs       |
| Cache           | Redis            | Analytics context + chat history per session |
| Auth            | JWT + bcrypt     | HttpOnly cookie-based authentication         |
| Data Processing | Pandas + NumPy   | Cleaning, aggregation, linear regression     |
| Forecasting     | Prophet          | Time-series prediction                       |
| Decomposition   | statsmodels STL  | Anomaly and seasonality detection            |
| LLM             | Groq / LLaMA 3.3 | Conversational AI grounded in analytics      |

### Project Structure

```
├── api/routes/          # Auth, dataset, analytics, chat endpoints
├── engines/             # DataEngine, ForecastEngine, AnalyticsEngine, InsightsEngine
├── orchestrators/       # run_dataset_pipeline() — full upload flow
├── services/            # Business logic per domain
├── models/              # SQLAlchemy ORM models
├── schemas/             # Pydantic request/response schemas
├── tasks/               # Background task: warm Redis cache on dashboard load
├── context_engine/      # Redis client
├── utils/               # Auth helpers, chat context builder
└── main.py              # App entry point, routers, exception handlers
```

### Performance Decisions

**Precomputed analytics:** All statistical computation runs once at upload time. Dashboard API calls are pure indexed reads — O(1) with respect to dataset size.

**Bulk inserts:** Processed data and forecast rows are written in single batched SQL statements, not row-by-row.

**Background cache warming:** The background task runs _after_ the HTTP response is returned to the client — it doesn't add to dashboard load time.

---

## 9. Database Design

| Table            | Key Columns                                                                     |
| ---------------- | ------------------------------------------------------------------------------- |
| `users`          | id (UUID), name, email (unique), password_hash                                  |
| `datasets`       | id, user_id (FK), name, length, freq, file_size                                 |
| `processed_data` | id, dataset_id (FK), ds, y                                                      |
| `forecasts`      | id, dataset_id (FK), ds, yhat                                                   |
| `analytics`      | dataset_id (PK/FK), trend, change, anomalies, seasonality, forecast (all JSONB) |
| `insights`       | dataset_id (PK/FK), summary, reasons, recommendations, confidence               |
| `messages`       | id, dataset_id (FK), role, content, created_at                                  |

All foreign keys use `CASCADE` delete — removing a dataset cleans up all associated data automatically.

Analytics and insights use JSONB columns because their output shapes (anomaly lists, seasonality distributions) are variable. This also means no schema migration is needed when adding new signal types to the engines.

The `analytics` and `insights` tables use `dataset_id` as their primary key, enforcing the one-to-one relationship with each dataset at the database level.

---

## 10. Security & Ownership

**Authentication:** JWT tokens are stored in HttpOnly cookies, making them inaccessible to JavaScript and immune to XSS token theft.

**Ownership validation:** Every analytics, forecast, and data query joins to the `datasets` table and filters on the current user's ID at the SQL level — not the application level. A non-owning user will get zero rows back even in the presence of application bugs.

**Error handling:** Custom typed exceptions map cleanly to HTTP status codes (400, 401, 404, 409) with consistent response formatting across all routes.

---

## 11. Why Business AI Copilot?

### vs. Spreadsheets

Spreadsheets require manual formulas, produce static charts with no interpretation, have no native anomaly detection, and can't forecast or explain trends. Every insight requires a human to look for it.

### vs. Traditional BI Platforms

Powerful but inaccessible — require SQL expertise, dedicated setup time, and data modeling knowledge. They visualize data beautifully but still leave the interpretation to you. Licensing costs are often prohibitive for SMBs.

### vs. Standalone Forecasting Tools

Predict future values but don't explain _why_ those values are what they are, don't surface root causes, and have no recommendations or conversational interface attached.

### The Integration Is the Product

| Capability                 | Standalone Tools       | Business AI Copilot  |
| -------------------------- | ---------------------- | -------------------- |
| Dashboards & visualization | BI platforms           | ✓ Built-in           |
| Time-series forecasting    | Prophet, statsmodels   | ✓ Built-in           |
| Anomaly detection          | Data science libraries | ✓ Built-in (STL)     |
| Seasonality analysis       | statsmodels            | ✓ Built-in (STL)     |
| Root-cause reasoning       | Custom logic           | ✓ Built-in           |
| Conversational AI          | Generic chatbots       | ✓ Built-in, grounded |
| Time to first insight      | Hours to days          | **Seconds**          |
| Technical skill required   | Medium to high         | **None**             |

Any one of these capabilities in isolation is useful. All six working together, automatically, on data you uploaded five minutes ago — that's the differentiator.

---

## 12. Competitive Comparison

| Capability                 |   Spreadsheet   | Traditional BI | Forecast Tool |     **Business AI Copilot**     |
| -------------------------- | :-------------: | :------------: | :-----------: | :-----------------------------: |
| Upload CSV                 |       Yes       |      Yes       |      Yes      |               Yes               |
| Auto-detect and clean data |     Manual      |    Partial     |    Limited    | Full (fuzzy matching + scoring) |
| Frequency inference        |       No        |       No       |    Manual     |            Automatic            |
| Forecast future values     | Manual formulas |      Rare      |      Yes      |          Yes (Prophet)          |
| Trend detection            |     Manual      |    Partial     |      No       |     Yes (linear regression)     |
| Anomaly detection          |     Manual      |    Partial     |    Limited    |        Yes (STL z-score)        |
| Seasonality analysis       |     Manual      |    Partial     |    Limited    |     Yes (STL decomposition)     |
| Root-cause reasoning       |       No        |       No       |      No       |    Yes (rule-based signals)     |
| Actionable recommendations |       No        |       No       |      No       |               Yes               |
| AI chat explanations       |       No        |    Limited     |      No       |   Grounded (Groq / LLaMA 3.3)   |
| Non-technical friendly     |     Medium      |      Low       |    Medium     |              High               |
| Time to first insight      |      Hours      |      Days      |     Hours     |             Seconds             |

---

## 13. Example Use Cases

### Retail — Diagnosing a Sales Slump

A shop owner exports weekly POS data. Business AI Copilot detects consistent weekend revenue dips, two high-severity anomalous drops in the past month, and a forecast projecting continued softness. Recommendations surface automatically: run weekend promotions, investigate the anomaly dates for operational issues, prepare contingency plans for the forecast period. The owner then asks the copilot _"Should I be worried about the drop on November 14th?"_ and gets a structured response explaining severity, context, and next steps.

### E-commerce — Scaling Into Growth

A brand uploads three months of daily orders. The platform detects a strong upward trend, +18% over 30 days, no anomalies, and a forecast projecting +22% further growth. Recommendations: increase ad spend, pre-build inventory, scale top-performing channels. The copilot confirms the growth signals are consistent across historical, recent, and forecast data when asked about sustainability.

### Analyst — Compressing the Reporting Cycle

An analyst uploads a monthly KPI dataset ahead of a quarterly review. Instead of assembling charts and writing narrative manually, they get an instant executive summary, a root-cause list with evidence, and a forecast breakdown. The copilot fields stakeholder questions live during the meeting.

---

## 14. Local Setup

### Prerequisites

- Python 3.9+
- PostgreSQL 13+
- Redis 6+
- Node.js (if building the frontend)

### Installation

```bash
git clone <repo-url>
cd business-ai-copilot
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in the project root:

```env
MODE=development
HOST=localhost
PORT=8000

DATABASE_URL=postgresql://user:password@localhost:5432/business_ai_copilot

JWT_SECRET_KEY=your-secure-random-secret-key
JWT_ALGORITHM=HS256

REDIS_HOST=localhost
REDIS_PORT=6379

GROQ_API=your-groq-api-key
GROQ_MODEL=llama-3.3-70b-versatile

MAX_SIZE=5242880        # 5MB in bytes
STATIC_DIR=../frontend/dist   # production only
```

### Run

```bash
uvicorn main:app --reload

# API:       http://localhost:8000
# API docs:  http://localhost:8000/docs
# Health:    http://localhost:8000/health
```

Database tables are created automatically on startup. No migration tool required for initial setup.

---

## 15. Roadmap

**Live Data Integrations**

- Shopify, Stripe, Square, Google Analytics 4, Xero connectors
- Scheduled data refresh (daily / weekly)
- Real-time anomaly alerts via email or Slack

**Deeper Analysis**

- Multi-metric dashboards with cross-KPI correlation
- Segment-level breakdowns (product, channel, region, cohort)
- Industry benchmarking against sector averages

**Outputs & Collaboration**

- Scheduled email digests with AI-generated summaries
- Exportable PDF reports for stakeholder presentations
- Team workspaces with shared datasets and role-based access
- What-if scenario simulations

**AI & Intelligence**

- Goal tracking ("we want $50k/month — are we on track?")
- Multi-step strategic planning assistant
- Cross-metric anomaly correlation
- Holiday calendar support for seasonality modeling

---

## License

This project is proprietary software.

- Personal/internal use allowed
- Modification allowed with attribution
- Commercial use requires permission

See [LICENSE](./LICENSE) and [CLAUSES.txt](./CLAUSES.txt).

---

<div align="center">

## The Bottom Line

**Business intelligence should not be limited to those with technical expertise.**

Every business owner, operations manager, and decision maker should be able to upload their data, understand what's happening, see what's coming, and ask intelligent questions in plain language — without needing an analyst, a BI platform, or a statistics degree.

Upload a CSV. Get clarity.

---

_FastAPI · PostgreSQL · Redis · Prophet · STL · Groq · LLaMA 3.3 · Python_

</div>
