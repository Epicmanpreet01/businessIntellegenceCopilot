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

## Table of Contents

1. [What Is Business AI Copilot?](#1-what-is-Business-AI-Copilot)
2. [The Problem We Solve](#2-the-problem-we-solve)
3. [Why Existing Solutions Fall Short](#3-why-existing-solutions-fall-short)
4. [Our Solution](#4-our-solution)
5. [Product Philosophy](#5-product-philosophy)
6. [Who This Is For](#6-who-this-is-for)
7. [Core Features](#7-core-features)
8. [End-to-End Workflow](#8-end-to-end-workflow)
9. [Technical Architecture](#9-technical-architecture)
10. [Intelligence Engines](#10-intelligence-engines)
11. [AI Chat Copilot](#11-ai-chat-copilot)
12. [API Reference](#12-api-reference)
13. [Database Design](#13-database-design)
14. [Security & Ownership Model](#14-security--ownership-model)
15. [Why Business AI Copilot Is Unique](#15-why-Business-AI-Copilot-is-unique)
16. [Competitive Comparison](#16-competitive-comparison)
17. [Example Use Cases](#17-example-use-cases)
18. [Scalability & Engineering Decisions](#18-scalability--engineering-decisions)
19. [Future Roadmap](#19-future-roadmap)
20. [Local Setup](#20-local-setup)

---

## 1. What Is Business AI Copilot?

Most businesses generate data every single day — sales transactions, orders, revenue, customer visits, inventory movement, web traffic, leads, bookings. The list goes on. But generating data and _understanding_ data are two fundamentally different things.

**Business AI Copilot** is an AI-powered analytics platform built to close that gap. It takes raw time-series business data — the kind that sits untouched in spreadsheets or CSV exports — and automatically runs it through a multi-stage intelligence pipeline: cleaning, forecasting, anomaly detection, seasonality analysis, root-cause reasoning, and finally a conversational AI copilot that answers questions about the data in plain language.

At its core, Business AI Copilot is designed to answer the five questions every business leader actually cares about:

| #   | Question                       | How Business AI Copilot Answers It                        |
| --- | ------------------------------ | --------------------------------------------------------- |
| 1   | **What is happening?**         | Automated trend detection, KPI dashboards, anomaly alerts |
| 2   | **Why is it happening?**       | Rule-based + signal-driven reasoning engine               |
| 3   | **What will happen next?**     | Prophet-based time-series forecasting                     |
| 4   | **What should I do now?**      | Prioritized, context-aware recommendations                |
| 5   | **Can you explain it simply?** | Groq-powered LLaMA 3.3 copilot grounded in your data      |

Traditional analytics tools answer question one — they show you a chart. Business AI Copilot answers all five.

---

## 2. The Problem We Solve

Data is only valuable when it informs decisions. For most businesses, that chain breaks somewhere between "the data exists" and "we know what to do about it."

### Small Businesses

- Sales data lives in CSV exports from a POS system but is never systematically analyzed
- There's no dedicated analyst, no BI tool, and no forecasting system in place
- Decisions are made on gut instinct or last month's memory
- Problems are noticed weeks after they start — often too late to course-correct

### Growing Businesses

- Reporting is a manually assembled weekly ritual consuming hours of time
- Multiple teams maintain their own spreadsheets with conflicting numbers
- Trends only become visible after they've already caused damage
- There's no forward-looking signal — just a rearview mirror

### Analysts

- The majority of analytical time is spent cleaning and wrangling data, not generating insights
- Executives send repeat requests for the same summaries, charts, and slide decks
- Communicating findings requires re-explaining statistical concepts to non-technical audiences

### Decision Makers

Decision makers don't need more data. They need answers:

> _Why did revenue drop last week?_
> _Is this decline temporary or a structural problem?_
> _Are our weekends consistently weak, or is this a one-time thing?_
> _Should we increase inventory heading into next month?_

Business AI Copilot is engineered to answer these questions automatically, every time data is uploaded.

---

## 3. Why Existing Solutions Fall Short

### Spreadsheets

Spreadsheets are genuinely useful for storage and basic arithmetic — but they were not designed for intelligence.

- Formulas must be written manually and maintained as data changes
- Charts are static snapshots with no interpretation attached
- There is no native anomaly detection — outliers are invisible unless you're already looking
- Forecasting requires statistical knowledge that most users don't have
- There's no mechanism to ask a spreadsheet _why_ something happened

### Traditional BI Platforms

Enterprise BI tools are powerful in the hands of trained users, but carry significant overhead:

- Building useful dashboards requires dedicated setup time and data modeling expertise
- Most require SQL proficiency or a technical admin to configure data sources
- The learning curve is steep enough that non-technical users rarely get direct value
- Licensing costs are often prohibitive for SMBs
- They show you data beautifully but still require you to draw your own conclusions

### Standalone Forecasting Tools

Statistical forecasting tools do one thing well — they predict future values. But prediction alone isn't enough:

- They output numbers without explaining _why_ those numbers are what they are
- They rarely connect forecasts to root causes or operational context
- No recommendations are attached — just a trendline
- There's no conversational interface for follow-up questions

**The gap is real.** Most businesses sit between these categories — too complex for a spreadsheet, not resourced enough for enterprise BI, and without the data science expertise to operationalize forecasting tools. Business AI Copilot was built to fill exactly that gap.

---

## 4. Our Solution

Business AI Copilot unifies five analytical capabilities into a single automated pipeline that runs the moment data is uploaded:

```
Raw CSV Data
     │
     ▼
┌──────────────────────┐
│   Automated Cleaning │  ← Detects columns, removes bad rows, infers frequency
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│      Forecasting     │  ← Prophet model generates future value predictions
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│   Analytics Signals  │  ← STL decomposition: trend, anomalies, seasonality
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│   Business Insights  │  ← Signal-to-language engine: causes + recommendations
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│    Visual Dashboard  │  ← Precomputed data served instantly via API
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│   AI Copilot (Groq)  │  ← LLaMA 3.3 grounded in stored analytics via Redis
└──────────────────────┘
```

Instead of giving users _more charts_, we give them _clarity_.

---

## 5. Product Philosophy

### Simplicity Without Sacrificing Intelligence

The platform is built on the belief that analytical complexity should be _invisible_ to the end user. Users don't need to understand STL decomposition, Prophet model fitting, z-score anomaly thresholds, or prompt engineering. All of that lives inside the intelligence engines. What users see is an upload button, a dashboard, and a chat window.

### Decision-First Design

Every output — every KPI card, insight summary, forecast chart, and chat response — is designed around one question: _does this help the user make a better decision?_ Metrics that don't drive action aren't shown. Insights that can't be operationalized aren't surfaced.

### Explainability as a First-Class Feature

Forecasts and recommendations are only useful if users trust them. The system never just says _"revenue is declining"_ — it says _why_, with specific signals (weekend dips, anomaly count, 30-day change %) and a confidence score (high / medium / low) tied to how strongly those signals support the conclusion.

### Grounded AI, Not Guessing

The AI copilot never invents trends or hallucinates numbers. Every response is grounded in pre-computed, validated analytics stored in the database and injected into the LLM's context window. The model is given facts — not raw data — and asked to reason about them.

---

## 6. Who This Is For

### Small & Medium Businesses

- Retail shops and brick-and-mortar stores (POS sales data)
- E-commerce brands (orders, revenue, conversion)
- Restaurants and food service (covers, revenue, item performance)
- Clinics and healthcare practices (patient volume, billing)
- Agencies (project revenue, utilization, pipeline)
- Service providers (bookings, revenue, churn)
- Subscription businesses (MRR, churn, growth rate)

### Teams Within Larger Organizations

- **Operations managers** who need to spot problems before they escalate
- **Founders and executives** who need a fast pulse on business health
- **Finance teams** running monthly or quarterly reporting cycles
- **Growth and marketing teams** tracking campaign and channel performance
- **Analysts** who want to spend less time on rote cleanup and more time on insight

### Individuals

Anyone with time-series data and a desire to understand it — consultants, freelancers, researchers, students.

---

## 7. Core Features

### 7.1 CSV Upload

The entry point is intentionally simple: upload a CSV file. Business AI Copilot accepts any time-series data, including:

- Daily or monthly sales data
- Revenue exports from any POS or billing system
- Website traffic reports
- Order history
- Inventory movement logs
- Any custom operational metric tracked over time

The file size limit is 5MB (configurable via `MAX_SIZE` in settings). Only `.csv` files are accepted.

---

### 7.2 Automatic Data Preparation — `DataEngine`

Raw business data is messy. Column names are inconsistent. Date formats vary. Rows go missing. Numeric fields contain text. The `DataEngine` handles all of this without any user intervention.

**Column detection uses fuzzy matching + scoring:**

The engine maintains a `key_map` of known date and metric keywords (`date`, `time`, `datetime`, `revenue`, `sales`, `profit`, `amount`, etc.) and a `weights` dictionary that scores metric columns by business priority — `revenue` scores highest (1.0), followed by `sales` (0.95), `profit` (0.9), and so on down to `discount` (0.3).

Date column selection evaluates each non-numeric column by parsing a sample of its values using `dateutil.parser` and scoring columns by: proportion of valid parseable dates (60% threshold) + a 0.2 bonus if the column name matches a known date keyword.

Metric column selection scores each numeric column by: completeness (proportion of non-null rows), variance (penalizes constant columns), non-zero ratio, and a weighted keyword match bonus.

**After column selection, the engine:**

- Normalizes column names (strips non-alpha characters, lowercases)
- Drops null or unparseable rows
- Detects the correct aggregation function per column (`sum` for revenue/sales/profit, `mean` for price/discount/rate)
- Groups duplicate dates using that aggregation function
- Clips outliers at the 1st and 99th percentile to prevent model distortion
- Sorts chronologically and validates that at least 2 unique values remain

**Frequency inference** examines the most common time gap between consecutive rows:

- 1 day → `D` (daily)
- 6–8 days → `W` (weekly)
- 28–31 days → `M` (monthly)

Output is a clean `{ ds, y }` DataFrame ready for Prophet.

---

### 7.3 Forecasting — `ForecastEngine`

The `ForecastEngine` wraps Facebook Prophet to generate forward-looking projections. The number of forecast periods is dynamically scaled to the dataset size: `max(100, len(data) // 20)` — so larger datasets get proportionally longer forecasts.

Forecasting runs with full history included (`include_history=True`), which means the returned DataFrame spans both historical and future dates. This enables the frontend to render a seamless historical-to-forecast chart without a visual break.

The engine stores `{ dataset_id, ds, yhat }` records in the `forecasts` table via `bulk_insert_mappings` for efficient batch writes. A composite index on `(dataset_id, ds)` ensures fast time-ordered reads at query time.

---

### 7.4 Analytics Engine — `AnalyticsEngine`

The analytics engine is the factual core of the platform. It extracts structured numerical signals from the processed historical data, which every downstream system (insights, chat) depends on.

**Trend Detection**

Linear regression (`np.polyfit`) is applied across the full time series. The slope determines direction:

- Slope > 0 → `upwards`
- Slope < 0 → `downwards`
- Slope ≈ 0 → `flat`

Strength is classified by absolute slope magnitude:

- `> 5` → strong
- `> 2` → moderate
- otherwise → weak

**Change Analysis**

Computes rolling window comparisons, normalizing window sizes by frequency (e.g., a "7-day" window becomes 1 week for weekly data, 1 month for monthly). Compares the most recent window against the prior window of equal length:

```
change_pct = ((current_window_mean - prior_window_mean) / prior_window_mean) * 100
```

Returns `last_7d` and `last_30d` percentage changes.

**Anomaly Detection (STL)**

Uses Seasonal-Trend decomposition using LOESS (STL) with `robust=True` to extract residuals that are not explained by trend or seasonality. Residuals are then z-score normalized. Any point with `|z| >= 2.5` is flagged as an anomaly, with severity tiers:

- `|z| >= 4.0` → `high`
- `|z| >= 3.0` → `medium`
- `|z| >= 2.5` → `low`

Each anomaly record includes: `{ ds, y, type (spike/drop), severity, z_score }`.

The period parameter adapts to data frequency:

- Daily → 7 (weekly seasonality)
- Weekly → 52 (yearly)
- Monthly → 12 (yearly)

**Seasonality Detection (STL)**

The same STL decomposition extracts the seasonal component. Seasonal strength is quantified as:

```
strength = 1 - Var(residual) / Var(seasonal + residual)
```

- `> 0.65` → strong
- `> 0.35` → medium
- `> 0.15` → weak

For daily data, average seasonal components are computed per day-of-week and compared: weekend vs. weekday mean determines the pattern (`weekend dips`, `weekend spikes`, or `stable weekly pattern`).

For weekly/monthly data, seasonal components are grouped by month name to surface yearly peaks and troughs.

**Forecast Signal**

Takes the last 7 predicted values from the forecast DataFrame and applies linear regression to classify direction and compute percentage change from first to last predicted value.

**Full analytics output:**

```json
{
  "trend": { "direction": "upwards", "strength": "moderate" },
  "change": { "last_7d": 11.8, "last_30d": 10.1 },
  "anomalies": [
    { "ds": "2024-11-14T00:00:00", "y": 412.0, "type": "drop", "severity": "high", "z_score": -4.2 }
  ],
  "anomaly_summary": { "count": 2, "recent_count": 1 },
  "seasonality": {
    "pattern": "weekend dips",
    "strength": "medium",
    "seasonal_strength_score": 0.48,
    "dominant_period": "weekly",
    "distribution": { "Monday": 12.4, "Tuesday": 11.9, ..., "Saturday": -8.2, "Sunday": -9.1 }
  },
  "forecast": { "trend": "upward", "change_pct": 16.0 }
}
```

---

### 7.5 Insights Engine — `InsightsEngine`

The `InsightsEngine` takes the structured analytics output and translates it into human-readable business reasoning. This is entirely rule-based — every sentence it produces is deterministically derived from the analytics signals, not generated by a language model. This guarantees that insights are factually grounded and never hallucinated.

**Summary generation** composes a natural-language sentence by combining trend direction + strength + seasonality pattern + 30-day change percentage.

**Reasons list** is built by evaluating every signal combination:

- Trend direction and strength → baseline narrative
- `last_7d` and `last_30d` thresholds (±10%, ±25%) → severity-tiered change reasons
- Momentum comparison (`last_7d` vs `last_30d`) → improving or weakening momentum
- Seasonality strength and pattern → recurring behavioral factors
- Anomaly count and recent count → irregularity reasons
- High-severity anomaly breakdown by type (spike vs. drop)
- Forecast direction and change percentage → forward-looking signals
- Combined signal combinations (e.g., downward trend + negative recent change + downward forecast = compounding decline)

**Recommendations list** follows the same multi-signal logic and maps every detected condition to an actionable business response:

- Declining trend → acquisition/retention actions
- Strong decline → urgent pricing/product audit
- Weekend dips → weekend promotions, staffing review
- Recent anomalies → investigate operational changes
- Positive forecast + upward trend → scale campaigns, expand capacity

Duplicates are stripped from both lists using a `seen` set before returning.

**Confidence scoring** evaluates three binary signals (strong trend, non-none seasonality, any anomalies). Two or more → `high`. One → `medium`. Zero → `low`.

---

### 7.6 Interactive Dashboard

The `/dashboard/{dataset_id}/dashboard` endpoint aggregates all four data sources (analytics, insights, forecast, processed data) into a single API response. It also triggers a background task (`warm_dashboard_chat_state`) that pre-loads the Redis cache with the dataset's analytics context and message history — so the first chat message is fast, not slow.

**Dashboard payload structure:**

```json
{
  "analytics": { ...AnalyticsEngineOut },
  "insights": { ...InsightEngineOut },
  "forecast": [ { "ds": "...", "yhat": ... }, ... ],
  "processed_data": [ { "ds": "...", "y": ... }, ... ]
}
```

All data is pre-computed. The dashboard endpoint performs zero analytical computation — it is entirely composed of database reads.

---

### 7.7 AI Business Copilot Chat

The chat system uses Groq's API with the `llama-3.3-70b-versatile` model. Every response is grounded in pre-computed analytics — the LLM never sees raw data or is asked to calculate anything. Instead, the system prompt is constructed from the stored analytics and insights and injected as the leading system message on every API call.

The system prompt defines response format rules by question type:

- **WHY questions** → `## Cause / ## Evidence / ## Action`
- **WHAT happened** → `## Summary / ## Key Metrics / ## Meaning`
- **WHAT should I do** → `## Top Actions / ## Priority / ## Expected Impact`
- **Risk questions** → `## Risk Level / ## Why / ## Next Step`
- **Summary requests** → `## Executive Summary / ## Key Signals / ## Recommended Focus`

Model parameters: `temperature=0.4`, `max_tokens=700`, `top_p=0.9` — tuned for factual, concise, business-appropriate responses without hallucination.

---

## 8. End-to-End Workflow

```
Step 1:  User uploads a CSV via POST /api/datasets/upload
          │
Step 2:  File is validated (.csv only, ≤ 5MB), parsed with pandas
          │
Step 3:  DataEngine.preprocess() → cleans, normalizes, aggregates
          │
Step 4:  DataEngine.infer_freq() → detects D / W / M
          │
Step 5:  Cleaned rows bulk-inserted into processed_data table
          │
Step 6:  ForecastEngine.forecast() → Prophet model generates yhat values
          │
Step 7:  Forecast rows bulk-inserted into forecasts table
          │
Step 8:  AnalyticsEngine.run() → trend, change, anomalies, seasonality, forecast signal
          │
Step 9:  Analytics object inserted into analytics table
          │
Step 10: InsightsEngine.generate() → summary, reasons, recommendations, confidence
          │
Step 11: Insights object inserted into insights table
          │
Step 12: db.commit() → all data persisted atomically
          │
Step 13: GET /api/analytics/{id}/dashboard → reads all tables, returns aggregated payload
          │
Step 14: Background task warms Redis cache with analytics context + message history
          │
Step 15: POST /api/chats/{id} → chat messages grounded in cached context
```

---

## 9. Technical Architecture

### Backend Stack

| Component        | Technology     | Details                                                   |
| ---------------- | -------------- | --------------------------------------------------------- |
| Web Framework    | FastAPI        | Async Python API server with automatic OpenAPI docs       |
| Language         | Python 3.x     | Core application logic                                    |
| ORM              | SQLAlchemy 2.x | Mapped classes with `Mapped` / `mapped_column` syntax     |
| Database         | PostgreSQL     | Primary store — all processed outputs persisted here      |
| Cache            | Redis          | Analytics context + chat history caching per user session |
| Validation       | Pydantic v2    | Request/response schema validation with `model_validate`  |
| Auth             | python-jose    | JWT token encoding/decoding                               |
| Password Hashing | bcrypt         | Secure password storage                                   |

### Analytics Stack

| Component          | Technology      | Role                                                               |
| ------------------ | --------------- | ------------------------------------------------------------------ |
| Data Processing    | Pandas          | DataFrame manipulation, cleaning, aggregation                      |
| Numerical Analysis | NumPy           | Linear regression (polyfit), variance computation                  |
| Forecasting        | Prophet         | Time-series modeling with trend + seasonality + holidays           |
| Decomposition      | statsmodels STL | Seasonal-trend decomposition for anomaly and seasonality detection |
| Date Parsing       | python-dateutil | Fuzzy date parsing for flexible column detection                   |

### AI Layer

| Component        | Details                                                     |
| ---------------- | ----------------------------------------------------------- |
| LLM Provider     | Groq API                                                    |
| Model            | `llama-3.3-70b-versatile`                                   |
| Context Strategy | Pre-computed analytics + insights injected as system prompt |
| History          | Last 10 messages included in every API call                 |
| Caching          | Redis `hset` with 1-hour TTL per user session               |
| Temperature      | 0.4 (factual, consistent, low hallucination risk)           |

### Project Structure

```
├── api/
│   ├── dependencies/
│   │   └── auth_dep.py          # JWT cookie extraction + validation
│   └── routes/
│       ├── auth_routes.py       # /api/auth
│       ├── dataset_routes.py    # /api/datasets
│       ├── analytics_routes.py  # /api/analytics
│       └── chat_routes.py       # /api/chats
├── context_engine/
│   └── redis.py                 # Redis client initialization
├── core/
│   ├── config.py                # Pydantic settings (env vars)
│   └── exceptions.py            # Typed HTTP exceptions
├── db/
│   ├── base.py                  # SQLAlchemy engine + declarative base
│   └── session.py               # Session factory + get_db dependency
├── engines/
│   ├── data_engine.py           # CSV parsing, cleaning, freq inference
│   ├── forecast_engine.py       # Prophet wrapper
│   ├── analytics_engine.py      # Trend, change, anomaly, seasonality
│   └── insights_engine.py       # Signal-to-language reasoning
├── models/                      # SQLAlchemy ORM models
├── orchestrators/
│   └── pipeline.py              # run_dataset_pipeline() — full upload flow
├── schemas/                     # Pydantic input/output schemas
├── services/                    # Business logic per domain
├── tasks/
│   └── analytics_task.py        # warm_dashboard_chat_state background task
├── utils/
│   ├── auth_utils.py            # bcrypt + JWT helpers
│   └── chat_utils.py            # create_chat_context() system prompt builder
└── main.py                      # FastAPI app, routers, exception handlers, static serving
```

---

## 10. Intelligence Engines

### 10.1 DataEngine — `engines/data_engine.py`

**Responsibility:** Transform any raw CSV into a clean, model-ready `{ ds, y }` time series.

Key design decisions:

- **Fuzzy matching** over rigid column name requirements — works with messy real-world exports
- **Weighted scoring** for metric column selection — prioritizes revenue over price over discount
- **Aggregation inference** — detects whether to `sum` or `mean` based on the metric type before grouping duplicate dates
- **Outlier clipping** at 1st/99th percentile before forecasting to prevent Prophet from fitting to noise

---

### 10.2 ForecastEngine — `engines/forecast_engine.py`

**Responsibility:** Generate future predictions from clean historical data using Prophet.

Key design decisions:

- **Dynamic period sizing** — `max(100, len(data) // 20)` scales forecast horizon with dataset length
- **Full history included** — enables seamless historical + future chart rendering on the frontend
- **Frequency-aware** — passes the inferred `D`/`W`/`M` freq directly to `make_future_dataframe`

---

### 10.3 AnalyticsEngine — `engines/analytics_engine.py`

**Responsibility:** Extract structured analytical signals from historical + forecast data.

Key design decisions:

- **STL with `robust=True`** — resistant to outliers in both anomaly detection and seasonality decomposition
- **Frequency-normalized windows** — all window sizes (7d, 30d) are converted to the correct number of data points for the inferred frequency
- **Minimum data guards** — every computation checks `len(df) >= max(period * 2, 8)` before running to avoid errors on small datasets
- **Silent failure on exceptions** — analytics methods return safe defaults (`[]`, `{}`) rather than crashing the pipeline if an edge case is hit

---

### 10.4 InsightsEngine — `engines/insights_engine.py`

**Responsibility:** Translate analytics signals into human-readable reasoning and recommendations.

Key design decisions:

- **Entirely rule-based** — no LLM involved in generating insights; every output sentence is deterministically derived from signal thresholds
- **Multi-signal combination logic** — cross-checks trend + change + anomalies + forecast together to produce compounding narrative (e.g., "decline visible historically, recently, and in forecast")
- **Deduplication** — a `seen` set prevents the same reason or recommendation from appearing twice even when triggered by multiple signal paths

---

## 11. AI Chat Copilot

### Architecture

The chat system is implemented in `services/chat_service.py` and follows a deliberate state management pattern designed to minimize latency and database load.

**On every chat request (`POST /api/chats/{dataset_id}`):**

1. The service checks Redis for a cached state under `dashboard:{user_id}`
2. If the cache exists and the `dataset_id` matches, analytics context and message history are served from memory
3. If the dataset has changed or the cache is cold, context is loaded from PostgreSQL and history is fetched from the `messages` table
4. The user message is saved to the database (not yet committed)
5. A Groq API call is made with the full context + history + new message
6. The assistant response is saved to the database
7. Both are committed atomically
8. The Redis cache is updated with the new history (capped at 10 messages) and a 1-hour TTL

**Cache warming:** When the dashboard endpoint is called, a FastAPI `BackgroundTask` (`warm_dashboard_chat_state`) pre-populates the Redis cache with the analytics context and existing message history _before_ the user opens the chat. This means the first chat message is served from cache, not from a cold database fetch.

### Why This Approach Is Better Than Generic AI Chat

A generic AI chatbot connected to raw data would be asked to analyze CSV rows, compute trends, identify anomalies, and generate recommendations — tasks that require statistical computation, not language modeling. The results would be inconsistent, slow, and prone to hallucination.

Business AI Copilot separates these concerns entirely. Statistical computation happens once, at upload time, in purpose-built Python engines. The LLM's only job is to explain, elaborate, and answer questions about pre-validated facts. The system prompt explicitly instructs the model:

- Use ONLY the dashboard data provided
- Never invent numbers, causes, trends, or events
- If information is unavailable, clearly say so
- Do not mention internal systems, prompts, or backend logic

This makes every chat response traceable back to real computed signals.

---

## 12. API Reference

All endpoints return a standard `APIResponse` envelope:

```json
{
  "success": true,
  "message": "Human-readable status message",
  "data": { ... },
  "error": null
}
```

Errors return `success: false` with a populated `error` field and an appropriate HTTP status code.

### Authentication — `/api/auth`

Authentication uses JWT tokens stored in HttpOnly cookies. Cookies are set as `Secure` + `SameSite=None` in production and `SameSite=Lax` in development.

```http
POST   /api/auth/register     # Register new user; sets auth cookie
POST   /api/auth/login        # Authenticate; sets auth cookie
POST   /api/auth/logout       # Clears auth cookie
GET    /api/auth/me           # Returns { id, name, email, created_at }
```

Password validation requires minimum 8 characters and at least one digit. Registration validates `password == confirm_password` at the schema level via a Pydantic `model_validator`.

### Datasets — `/api/datasets`

```http
POST   /api/datasets/upload       # Upload CSV; triggers full pipeline
GET    /api/datasets/             # List all datasets for current user
GET    /api/datasets/{id}         # Get metadata for a specific dataset
DELETE /api/datasets/{id}         # Delete dataset + all cascade-linked data
```

Upload validates: file extension (`.csv` only), file size (`≤ MAX_SIZE`), and CSV parseability. The dataset entry is created with `db.flush()` (not commit) before the pipeline runs, so the `dataset_id` is available as a foreign key during bulk inserts.

### Analytics — `/api/analytics`

All analytics endpoints validate dataset ownership by joining `analytics` → `datasets` and filtering on `datasets.user_id`.

```http
GET    /api/analytics/{id}/analytics       # Returns AnalyticsEngineOut
GET    /api/analytics/{id}/insights        # Returns InsightEngineOut
GET    /api/analytics/{id}/forecast        # Returns [{ ds, yhat }, ...]
GET    /api/analytics/{id}/processed-data  # Returns [{ ds, y }, ...]
GET    /api/analytics/{id}/dashboard       # Returns DashboardOut (all of the above)
```

The `/dashboard` endpoint additionally fires the `warm_dashboard_chat_state` background task.

### Chat — `/api/chats`

```http
GET    /api/chats/{dataset_id}    # Returns full message history for dataset
POST   /api/chats/{dataset_id}    # Send message; returns assistant MessageOut
```

The POST body is a raw string (`Annotated[str, Body()]`). The response returns only the assistant's reply message, not the full history.

---

## 13. Database Design

### Schema Overview

| Table            | Primary Key          | Key Columns                                                                              |
| ---------------- | -------------------- | ---------------------------------------------------------------------------------------- |
| `users`          | `id` (UUID)          | `name`, `email` (unique), `password_hash`, `created_at`                                  |
| `datasets`       | `id` (UUID)          | `user_id` (FK), `name`, `length`, `freq`, `file_size`, `created_at`                      |
| `processed_data` | `id` (UUID)          | `dataset_id` (FK), `ds`, `y`                                                             |
| `forecasts`      | `id` (UUID)          | `dataset_id` (FK), `ds`, `yhat`                                                          |
| `analytics`      | `dataset_id` (PK/FK) | `trend`, `change`, `anomalies`, `anomaly_summary`, `seasonality`, `forecast` (all JSONB) |
| `insights`       | `dataset_id` (PK/FK) | `summary`, `reasons`, `recommendations`, `confidence`                                    |
| `messages`       | `id` (UUID)          | `dataset_id` (FK), `role`, `content`, `created_at`                                       |

All foreign keys use `ondelete="CASCADE"` — deleting a dataset removes all downstream records automatically.

### Performance Indexes

```sql
-- Fast time-ordered reads for charts
CREATE INDEX idx_processed_dataset_time ON processed_data (dataset_id, ds);
CREATE INDEX idx_forecast_dataset_time  ON forecasts (dataset_id, ds);

-- Fast ownership lookups
CREATE INDEX ON datasets (user_id);
CREATE INDEX ON analytics (dataset_id);
CREATE INDEX ON insights (dataset_id);
```

### JSONB for Analytical Data

The `analytics` and `insights` tables store their structured outputs as PostgreSQL `JSONB` columns. This approach is intentional:

- The shape of analytics signals (seasonality distribution, anomaly list) is variable in length and structure
- JSONB allows the full output of each engine to be stored and retrieved as a single database row per dataset
- No schema migration is needed when adding new signal types to the engines

### Why `analytics` and `insights` Use `dataset_id` as Primary Key

Each dataset has exactly one analytics record and one insights record — they are computed once and stored. Using `dataset_id` as the primary key enforces this one-to-one relationship at the database level and eliminates an unnecessary surrogate key column.

---

## 14. Security & Ownership Model

### Authentication

JWT tokens are issued at login/register and stored in HttpOnly cookies, making them inaccessible to JavaScript and immune to XSS token theft. Token payload: `{ sub: user_id, exp: now + 24h }`. All protected routes extract and validate the token via the `get_curr_user_id` FastAPI dependency.

### Ownership Validation

Every analytics, insights, forecast, processed data, and dataset query joins to the `datasets` table and filters on `datasets.user_id == current_user_id`. This is enforced at the query level, not the application level — even if a route handler had a bug, the SQL query itself would return no rows for a non-owning user.

**Example — analytics ownership check:**

```python
stmt = select(Analytics).join(Datasets, Analytics.dataset_id == Datasets.id).where(
    and_(
        Analytics.dataset_id == dataset_id,
        Datasets.user_id == user_id   # ← ownership enforced in SQL
    )
)
```

### Exception Hierarchy

Custom typed exceptions map to specific HTTP status codes:

| Exception               | Status |
| ----------------------- | ------ |
| `BadRequestException`   | 400    |
| `UnauthorizedException` | 401    |
| `NotFoundException`     | 404    |
| `ConflictException`     | 409    |

A global `AppException` handler and a fallback `Exception` handler are registered on the FastAPI app to ensure consistent error response formatting.

---

## 15. Why Business AI Copilot Is Unique

The business intelligence market is split between tools that are powerful but inaccessible, and tools that are accessible but shallow. Business AI Copilot sits in a distinct category by combining capabilities that have historically existed in separate products:

| Capability                        | Standalone Tools       | Business AI Copilot       |
| --------------------------------- | ---------------------- | ------------------------- |
| Data visualization and dashboards | BI platforms           | Built-in                  |
| Time-series forecasting           | Prophet, statsmodels   | Built-in                  |
| Anomaly detection                 | Data science libraries | Built-in (STL)            |
| Seasonality analysis              | statsmodels            | Built-in (STL)            |
| Business reasoning from signals   | Custom logic           | Built-in (InsightsEngine) |
| Conversational AI                 | Generic chatbots       | Built-in, grounded        |

**The integration is the product.** Any one of these capabilities in isolation is useful. All six working together, automatically, on data you uploaded five minutes ago — that's the differentiator.

**What makes the AI different:** The copilot is grounded in pre-computed, validated analytics. It cannot hallucinate a trend that doesn't exist in your data. The confidence score on every insight reflects real signal strength, not model confidence.

**What makes the pipeline different:** The entire journey from raw CSV to chat-ready dashboard is zero-configuration. No column mapping. No template selection. No dashboard building. Just upload and receive clarity.

---

## 16. Competitive Comparison

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

## 17. Example Use Cases

### Retail Shop — Diagnosing a Sales Slump

A retail store owner exports their weekly POS data as a CSV. Within seconds, Business AI Copilot detects a consistent weekend dip in revenue (STL seasonality: `weekend dips`, strength: `medium`), two high-severity anomalous drops in the past month (z-scores of -4.1 and -3.8), and a Prophet forecast projecting continued softness over the next 8 weeks.

The InsightsEngine surfaces: "Weekend revenue is consistently below weekday average. One or more severe drops were detected. Forecast suggests near-term softening."

The recommendations: run targeted weekend promotions, investigate the two anomaly dates for operational issues, and prepare contingency plans for the forecast period.

The owner opens the chat and asks: _"Should I be worried about the drop on November 14th?"_ The copilot responds with a structured breakdown — the drop is classified as high-severity, is isolated (not part of a trend), and the recommendation is to investigate operational logs for that date before drawing conclusions.

---

### E-commerce Brand — Scaling Into Growth

An e-commerce brand uploads three months of daily order history. The analytics engine detects strong upward trend (slope strength: `strong`), `+18.4%` over the last 30 days, no anomalies, and a forecast projecting a further `+22%` over the next month.

The InsightsEngine generates: "Growth is consistent across historical, recent, and forecast signals." Recommendations: increase ad spend, pre-build inventory, scale top-performing channels.

The brand asks the copilot: _"Is this growth sustainable?"_ It responds with the supporting evidence — strong trend, consistent momentum, positive forecast — while noting no anomalies that might suggest the growth is artificial or fragile.

---

### Analyst — Compressing the Reporting Cycle

An analyst uploads a monthly KPI dataset ahead of a quarterly review. Instead of spending time on chart assembly and narrative writing, they receive an instant executive summary, a root-cause list with specific signal evidence, and a forecast narrative. The dashboard is ready to screenshot. The copilot answers any stakeholder question live during the meeting.

---

## 18. Scalability & Engineering Decisions

### Precomputed Analytics

All statistical computation — STL decomposition, Prophet model fitting, linear regression, anomaly detection — runs once at upload time inside `run_dataset_pipeline()`. Dashboard API endpoints perform zero computation. They are pure database reads on indexed tables. This means dashboard load time is O(1) with respect to dataset size or analytical complexity.

### Bulk Inserts

Processed data and forecast rows are written using `db.bulk_insert_mappings()`, which bypasses SQLAlchemy's per-object overhead and issues a single batched SQL statement. For a dataset with 1,000 rows and 365 forecast periods, this means 2 INSERT statements instead of 1,365.

### Atomic Pipeline Commit

The entire pipeline — processed data, forecasts, analytics, insights — is committed in a single `db.commit()` at the end of `run_dataset_pipeline()`. If any step fails, nothing is persisted. The database never ends up with partial pipeline outputs.

### Redis Chat Caching

Analytics context for each dataset is a structured string of approximately 50–100 lines. Loading it from PostgreSQL on every chat message adds a join query on every API call. Redis eliminates this: the context is serialized once, stored in a hash with a 1-hour TTL, and served from memory on all subsequent requests. The history is capped at 10 messages to bound the token count sent to the LLM.

### Background Cache Warming

The dashboard endpoint fires `warm_dashboard_chat_state` as a FastAPI `BackgroundTask` — it runs _after_ the HTTP response is returned to the client, so it doesn't add to dashboard load time. By the time the user opens the chat panel, Redis is already warm.

### Modular Engine Design

Each engine (`DataEngine`, `ForecastEngine`, `AnalyticsEngine`, `InsightsEngine`) is a standalone class with a clean interface. The orchestrator (`run_dataset_pipeline`) simply calls them in sequence. This means:

- The forecasting model can be upgraded (e.g., replacing Prophet with a neural model) without changing any other engine
- The anomaly detection threshold can be tuned in one place without affecting the insights logic
- The LLM provider can be swapped from Groq to any OpenAI-compatible API by changing the client initialization in `chat_service.py`
- Each engine can be unit tested with a DataFrame fixture in complete isolation

### Frontend Serving

In production, the FastAPI app serves the React frontend's static build from the `STATIC_DIR` path. A catch-all `/{full_path:path}` route serves `index.html` for all non-API routes, enabling client-side routing. API routes are explicitly excluded from the catch-all.

---

## 19. Future Roadmap

**Live Data Integrations**

- Shopify, Stripe, Square POS, Google Analytics 4, Xero connectors
- Automatic scheduled data refresh (daily/weekly)
- Webhook support for real-time anomaly alerts via email or Slack

**Deeper Analysis**

- Multi-metric dashboards — analyze and correlate multiple KPIs from a single dataset
- Segment-level analysis — break down performance by product, channel, region, or customer cohort
- Industry benchmarking — compare your metrics against sector averages

**Outputs & Collaboration**

- Scheduled email digests with AI-generated performance summaries
- One-click exportable PDF reports formatted for stakeholder presentations
- Team workspaces with shared datasets, collaborative annotations, and role-based access
- What-if scenario simulations ("what happens to revenue if weekend sales improve 15%?")

**AI & Intelligence**

- Goal-setting and progress tracking ("we want $50k/month — are we on track?")
- Multi-step strategic planning assistant with sequential reasoning
- Cross-metric anomaly correlation ("did the traffic drop cause the revenue drop?")
- Improved seasonality modeling with holiday calendars by country/region

---

## 20. Local Setup

### Prerequisites

- Python 3.9+
- PostgreSQL 13+
- Redis 6+
- Node.js (if building the frontend)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd Business AI Copilot

# Install Python dependencies
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Application
MODE=development                        # 'development' or 'production'
HOST=localhost
PORT=8000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/Business AI Copilot

# Authentication
JWT_SECRET_KEY=your-secure-random-secret-key
JWT_ALGORITHM=HS256

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AI Layer (Groq)
GROQ_API=your-groq-api-key
GROQ_MODEL=llama-3.3-70b-versatile

# File Upload
MAX_SIZE=5242880                        # 5MB in bytes

# Frontend (production only)
STATIC_DIR=../frontend/dist
```

### Run the Server

```bash
# Start the development server with hot reload
uvicorn main:app --reload

# API available at:         http://localhost:8000
# Interactive API docs at:  http://localhost:8000/docs
# Health check:             http://localhost:8000/health
```

### Database Initialization

Tables are created automatically on startup via:

```python
Base.metadata.create_all(bind=engine)
```

No migration tool is required for initial setup.

### Running with Docker (optional)

```bash
# Build and run with docker-compose (add your own docker-compose.yml)
docker-compose up --build
```

---

<div align="center">

## The Bottom Line

Business AI Copilot was built around a single conviction:

**Business intelligence should not be limited to those with technical expertise.**

Every business owner, operations manager, and decision maker should be able to upload their data, understand what's happening, see what's coming next, and ask intelligent questions in plain language — without needing an analyst, a BI platform, a statistics degree, or a data engineering team.

Upload a CSV. Get clarity.

---

_FastAPI · PostgreSQL · Redis · Prophet · STL · Groq · LLaMA 3.3 · Python_

</div>
