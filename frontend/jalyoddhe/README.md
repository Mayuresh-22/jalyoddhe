# Jalyoddhe – Frontend
## Marine Debris Detection & Insights Dashboard  
**Built with React + Vite, Tailwind CSS, Bootstrap, FontAwesome, and Leaflet (OpenStreetMap)**

The Jalyoddhe frontend is a fast, responsive web application that visualizes marine debris, coastal pollution insights, and environmental information using interactive maps and reusable UI components.  
It consumes REST APIs from the backend and supports both user-facing and admin interfaces.

---

## Tech Stack

### **Core Technologies**
- **React + Vite**
- **Tailwind CSS**
- **Bootstrap 5**
- **Leaflet + OpenStreetMap**
- **FontAwesome Icon Library**
- **Custom SVG icons (stored in `/assets`)**
---

## 📁 Project Structure
```bash
src/
│
├── assets/
│   ├── about.jpg
│   ├── hero.jpg
│   ├── hero.png
│   ├── logo.png
│   ├── mission.png
│   ├── vision.png
│   └── pin.png
│
├── components/
│   ├── DebrisCards.jsx
│   ├── FiltersOverlay.jsx
│   ├── Footer.jsx
│   ├── HeroSection.jsx
│   ├── MapSection.jsx
│   ├── Navbar.jsx
│   ├── PrimaryButton.jsx
│   ├── ScrollToTop.jsx
│   └── SecondaryButton.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── AdminLogin.jsx
│   └── AdminDashboard.jsx
│
├── utils/
│   └── (helper functions)
│
├── App.jsx
├── index.css
└── main.jsx
```

---

## Installation & Setup

### **Install dependencies**
```bash
npm install
```

### Start Development Server

```bash
npm run dev
```
Access the app at: http://localhost:5173

### Build for Production
```bash
npm run build
```
### Preview Production Build
```bash
npm run preview
```

### Environment Variables
Create a .env.local file:
```bash
VITE_ENV=LOCAL
VITE_API_BASE_URL_LOCAL=...
VITE_API_BASE_URL_PROD=...
```

## Interactive Map (Leaflet + OpenStreetMap)
The application uses:
- Leaflet (JS map library)
- OpenStreetMap tiles
- Custom map markers
- On-map filter overlay

All map logic is handled inside MapSection.jsx and FiltersOverlay.jsx.

## Icons Used
### FontAwesome Icons
Install:

```bash
npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
```

## Key Components Overview
| Component          | Purpose                           |
|--------------------|-----------------------------------|
| Navbar.jsx         | Website navigation bar            |
| HeroSection.jsx    | Home page hero banner             |
| MapSection.jsx     | Leaflet-based interactive map     |
| FiltersOverlay.jsx | Filters for debris categories     |
| DebrisCards.jsx    | Displays pollution/debris info    |
| Footer.jsx         | Website footer                    |
| PrimaryButton.jsx  | Styled primary button             |
| SecondaryButton.jsx| Styled secondary button           |
| ScrollToTop.jsx	 | Auto-scroll feature               |

## Pages Overview
| Page              | Description                     |
|--------------------|---------------------------------|
| Home.jsx          | Hero section + map + filters     |
| About.jsx         | About, mission, vision content   |
| AdminLogin.jsx    | Admin authentication page        |
| AdminDashboard.jsx| Admin data & controls            |

## Contributing
Keep components modular
- Use Tailwind for layout & spacing
- Use Bootstrap for grid layouts
- Store all images in /assets
- Keep helper functions inside /utils
- Follow existing folder structure

## Credits
**Team Jalyoddhe**
* Mayuresh Choudhary
* Yashshri Mule