# Georgia Tech Esports Website

The main website for Georgia Tech Esports, built with React, TypeScript, Tailwind CSS, and Vite. Supabase provides authentication and data storage.

## Run locally

Install Node.js 22 LTS and npm, then clone the repository and install dependencies:

```bash
git clone https://github.com/gt-esports/gtesports-website.git
cd gtesports-website
npm ci
```

Create a `.env.local` file in the project root with these values:

```dotenv
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```

Ask Kevin Hu for the development project URL and publishable key. Both values are required for the app to start. Use only the publishable key in the frontend; never use a service-role or secret key. Keep local environment files out of Git.

Start the development server:

```bash
npm run dev
```

Open the local URL printed in the terminal (usually `http://localhost:5173`). Restart the server after changing environment variables. No separate backend server is needed to start the frontend.

For database migrations, authentication redirects, and admin access setup, see [Supabase setup](supabase/README.md).

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Type-check and build the site into `dist/` |
| `npm run preview` | Preview the production build locally after building |
| `npm run lint` | Run ESLint |
| `npm test` | Run the automated tests |

## Contributing

Use the [GT Esports Development Trello board](https://trello.com/b/PkcWcga9/gt-esports-development) to find tasks and track progress. Ask Kevin for access if needed. Assign yourself to a card and keep it updated as you work.

Create a branch for your changes, run the relevant checks above, and open a pull request. Request review from [Kevin Hu (@thekevinhu)](https://github.com/thekevinhu) before merging.

Discuss design suggestions and development questions in the development department channel of the GT Esports administration Discord.

## Contact

Contact **Kevin Hu**, Director of Innovation, through the GT Esports administration Discord or [GitHub (@thekevinhu)](https://github.com/thekevinhu) for onboarding, project access, and pull request reviews.
