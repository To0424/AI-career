# AI Career Planner

A modern React-based career planning application powered by AXIOM.AI that helps users explore job opportunities and plan their career paths.

## Features

- 🎯 **Smart Job Matching**: Browse and filter job opportunities tailored to your profile
- 📊 **Career Analytics**: View company insights and industry statistics
- 🤖 **AI Assistant**: Get personalized career guidance through our OpenRouter-powered chatbot
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎓 **Educational Background Support**: Tailored for both high school and university graduates
- 🧠 **Intelligent Responses**: Role-specific AI responses using OpenRouter LLM models

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Routing**: React Router
- **AI Integration**: OpenRouter API with GPT-4o Mini
- **Data**: Demo data with localStorage persistence

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/To0424/AI-career.git
cd AI-career
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5174`

## OpenRouter AI Integration

The chatbot uses OpenRouter to provide intelligent, role-specific responses:

### Configuration

1. **Get an OpenRouter API key**:
   - Sign up at [OpenRouter.ai](https://openrouter.ai)
   - Generate an API key from your dashboard

2. **Set up environment variables**:
   ```bash
   # Create .env.local file in the project root
   VITE_OPENROUTER_API_KEY=your_actual_api_key_here
   ```

3. **Fallback Mode**:
   - If no API key is configured, the chatbot will use smart fallback responses
   - Perfect for development and testing without API costs

### Features

- **Role-specific prompts**: Different system prompts for high school vs university students
- **Hong Kong context**: Tailored advice for Hong Kong's education and job market
- **Smart fallbacks**: Graceful degradation when API is unavailable
- **Cost-effective**: Uses GPT-4o Mini model for optimal performance/cost ratio

### Customization

You can customize the AI behavior by modifying:
- `src/services/openRouterService.ts` - System prompts and model configuration
- Model selection (currently using `openai/gpt-4o-mini`)
- Response parameters (temperature, max tokens, etc.)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # Business logic and API calls
└── lib/           # Utilities and demo data
```

## Demo Data

This application uses hardcoded demo data for demonstration purposes, featuring:
- Sample job listings from Hong Kong tech companies
- Mock company statistics and insights
- Simulated user profiles and applications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).