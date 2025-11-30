# GumWall - Plan & Image Generator

A React application for creating and generating gum wall designs, built with AWS Amplify and styled with the Listty theme.

## Features

- **Landing Page**: Beautiful hero section showcasing GumWall features
- **User Authentication**: Login and signup pages with AWS Amplify authentication
- **Dashboard**: User dashboard for managing designs and generating AI images
- **Listty Theme**: Professional UI using the Listty HTML theme assets

## Project Structure

```
├── public/
│   └── assets/          # Listty theme assets (CSS, JS, images, plugins)
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx   # Public landing page
│   │   ├── Login.tsx         # Login page with Amplify auth
│   │   ├── SignUp.tsx        # Signup page with Amplify auth
│   │   └── Dashboard.tsx     # Protected dashboard
│   ├── App.tsx          # Original app (now at /app route)
│   ├── main.tsx         # Router configuration
│   └── index.css        # Custom styles and Amplify UI overrides
└── theme/               # Original Listty theme files
```

## Routes

- `/` - Landing page (public)
- `/login` - Login page (public)
- `/signup` - Signup page (public)
- `/dashboard` - User dashboard (protected)
- `/app` - Original pink team app (protected)
- `/setup` - Setup guide (protected)
- `/presentation` - Presentation (public)

## Theme Integration

The application uses the **Listty** theme from `/theme/Static HTML/`:

- All theme assets are copied to `/public/assets/`
- CSS and JavaScript are loaded in `index.html`
- React components use Listty's HTML structure and classes
- Custom branding for "GumWall" with pink/purple color scheme

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Customization

### Colors
The primary colors are defined in the Listty theme CSS:
- Primary: `#FF6B9D` (pink)
- Secondary: `#C44569` (darker pink)
- Gradients: Purple to pink for hero sections

### Amplify UI
Amplify Authenticator is customized in `src/index.css` to match the GumWall theme colors.

## Technologies

- React 18
- TypeScript
- AWS Amplify (Auth, Data)
- React Router
- Listty Theme (Bootstrap 5, jQuery)
- Vite

## Next Steps

1. Implement gum wall design canvas
2. Integrate AI image generation (AWS Bedrock/Stable Diffusion)
3. Add design saving functionality with Amplify DataStore
4. Create color palette selector
5. Add design gallery and sharing features
