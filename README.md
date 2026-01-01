# LiveKit Voice Frontend

A modern, dark-mode frontend for a LiveKit Voice Agent built with Next.js 14 (App Router), Tailwind CSS, Lucide React icons, and the @livekit/components-react SDK.

## Features

### Visual Style
- Sleek, minimalist 'AI Voice Mode' aesthetic with deep blacks and subtle glowing gradients
- Dark mode by default

### Core Features

#### 1. Connection Screen
- Clean start screen with a 'Connect' button
- Microphone permission pre-check with visual status indicator
- Error handling display

#### 2. Active Session View

**Audio Visualizers**
- Two distinct circular frequency-based visualizers side-by-side
- User's Mic: Green/Cyan accent (#22d3ee)
- AI Agent's Voice: Purple/Pink accent (#a855f7)
- Glow effects that respond to speaking

**Dynamic Transcript Display**
- Real-time transcript in the center of the screen
- Focus Animation based on who is currently speaking:
  - When User Speaks: User's text is Large (text-4xl) and bright white
  - When AI Speaks: AI's text becomes Large (text-4xl) and bright
  - Non-active speaker's text shrinks to Small (text-lg) and dims
- Smooth transitions between states

**Control Bar**
- Floating pill-shaped dock at the bottom
- Mute/Unmute Toggle (central)
- Disconnect button (red)
- Device Selector: Dropdown to select active microphone
- Chat toggle button

**Chat History**
- Scrollable side panel on the right (collapsible)
- Displays full persistent chat history
- Auto-scrolls to the bottom on new messages

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS** for styling
- **LiveKit** for real-time voice communication
- **@livekit/components-react** for LiveKit React components
- **Lucide React** for icons

## File Structure

```
├── app/
│   ├── layout.tsx              # Root layout with global styles
│   ├── page.tsx                # Main page component
│   ├── globals.css             # Global CSS with Tailwind
│   └── api/token/route.ts      # API route for LiveKit token generation
├── components/
│   ├── Room.tsx                # LiveKit room wrapper
│   ├── TranscriptView.tsx      # Dynamic transcript display
│   ├── AudioVisualizer.tsx     # Circular audio visualizers
│   ├── ControlBar.tsx          # Bottom control bar
│   ├── ChatHistory.tsx         # Side panel chat history
│   └── ConnectionScreen.tsx    # Initial connection screen
├── hooks/
│   └── useTranscription.ts     # Custom hook for transcription state
├── package.json
├── tailwind.config.ts
└── next.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A LiveKit server instance (cloud or self-hosted)
- LiveKit API credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/makiladamsuka/livekit-voice-frontend.git
cd livekit-voice-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Usage

1. Open the application in your browser
2. Enter a room name and your name
3. Click "Connect" to join the voice session
4. Grant microphone permissions when prompted
5. Start speaking to see real-time transcription
6. Use the control bar to:
   - Mute/unmute your microphone
   - Select different microphone devices
   - Toggle the chat history panel
   - Disconnect from the session

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_LIVEKIT_URL` | Your LiveKit server WebSocket URL | Yes |
| `LIVEKIT_API_KEY` | LiveKit API key for token generation | Yes |
| `LIVEKIT_API_SECRET` | LiveKit API secret for token generation | Yes |

## License

ISC
