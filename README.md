# FindBin ♻️ — Material Recovery & Recycling Platform

FindBin is a full-stack platform connecting individual users, businesses, and material generators with certified collection, recycling, and recovery organizations.

## Features

- **Smart Material Categorization**: AI-powered category classification (using Google Gemini 2.5 Flash with rule-based offline fallbacks) to accurately direct items to appropriate handlers.
- **Dual Portal Experience**: 
  - **Individual / Business User**: Browse certified organizations, create material pickup/drop-off requests, track request journeys in real-time, and leave verified ratings.
  - **Collection Organization**: Manage incoming pickup requests, schedule collectors, monitor collector availability, view ratings, and update request statuses.
- **Real-Time Request Lifecycle Tracking**: Detailed timeline tracking from pickup creation to final certified recycling completion.
- **Feedback & Quality Assurance**: Ratings, reviews, and issue resolution tracking.

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend Server**: Node.js, Express, TypeScript (`tsx`)
- **AI Engine**: `@google/genai` (Gemini API Integration)
- **Bundler**: Vite

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment Variables:
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   PORT=3000
   ```

3. Run in Development Mode:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

### Production Deployment

1. Build the production assets:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   NODE_ENV=production npm run start
   ```

## License

MIT License
