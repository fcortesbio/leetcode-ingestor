# LeetCode Ingestor Engine

A specialized metadata ingestor designed to synchronize LeetCode algorithm problems into a local SQLite database, ultimately facilitating a structured learning workflow within Obsidian.

## 🏗 Architecture

The system is built on a "Service-to-Sink" pattern:

- **Source:** LeetCode GraphQL API (Category: Algorithms).
- **Service Layer:** Strictly typed TypeScript services using Node.js 25 native fetch.
- **Sink:** SQLite database for persistent state tracking and idempotency.
- **Quality Gate:** Automated pre-commit hooks using Husky, Lint-Staged, Prettier, and ESLint (Flat Config).

## 🚀 Getting Started

### Prerequisites

- **Node.js 25+** (Required for native fetch support)
- **npm**
- **SQLite3**

### Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Initialize Husky hooks:

```bash
npm run prepare
```

### Configuration

Create a `.env` file in the root directory (refer to `.env.example`):

```bash
# Example
OBSIDIAN_VAULT_PATH=/home/user/vault/algorithms
```

## Usage

### Ingestion Pipeline

The ingestor is state-aware. It checks the local database count to calculate the `skip` offset automatically.
To build and run the sync:

```bash
npm run build && npm start
```

### Development

- **Dev Mode:** `npm run dev` (uses ts-node/esm loader)
- **Linting:** `npm run lint`
- **Manual Database Check:**

```bash
sqlite3 leetcode_vault.db "SELECT * FROM problems;"
```

## 📝 Schema Data Points

| Field          | Type      | Description                               |
| -------------- | --------- | ----------------------------------------- |
| `id`           | TEXT (PK) | The frontend question ID (e.g., "1")      |
| `title`        | TEXT      | Full problem title                        |
| `slug`         | TEXT      | URL-friendly title for link generation    |
| `difficulty`   | TEXT      | Easy, Medium, or Hard                     |
| `is_paid_only` | BOOLEAN   | Premium status toggle                     |
| `status`       | TEXT      | Tracks workflow state (pending, ingested) |

## ⚖️ License

MIT
