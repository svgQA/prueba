<p align="center"><img src="https://preactjs.com/app-icon.png" width=200></p>
<h3 align="center">Voxline Dashboard</h3>
<p align="center">
    <a href=""><img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
    <a href=""><img src="https://img.shields.io/badge/preact-%23673ab8.svg?style=for-the-badge&logo=preact" alt="Preact"></a>
    <a href=""><img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"></a>
    <a href=""><img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"></a>
    <a href=""><img src="https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest"></a>
    <a href=""><img src="https://img.shields.io/badge/-Playwright-%23242424?style=for-the-badge&logo=playwright&logoColor=058a5e" alt="Playwright"></a>
</p>

# Description

# Features

# Environment Vars

| VAR NAME                     | DEFAULT                | DESCRIPTION |
| ---------------------------- | ---------------------- | ----------- |
| VITE_UCA_DEFAULT_SERVICE_URL | http://localhost:8080/ | Server URL  |

# Scaffolding

This project scaffolding organizes the main aspects of a scalable and maintainable application into specific, well-defined folders:

- **components/**: This folder contains all the reusable and generic React components. It's further subdivided into:
- **common/**: Houses fundamental UI elements like buttons and inputs that can be used throughout the application.
- **layout/**: Includes components that dictate the overall layout structure, such as headers, footers, and containers.
- **hooks/**: Stores custom React hooks for encapsulating reusable logic.
- **pages/**: Consists of components that represent entire pages in the application, typically aligning with different routes.
- **services/**: Contains service files for handling external interactions, like API calls, ensuring the business logic is separated from the UI.
- **utils/**: Holds utility functions and constants that provide helper functionality across the application, promoting code reusability and maintainability.
- **app/**: Includes the main App component (App.js) that acts as the root of the React application, along with its specific styles (App.css).

```bash
uca-web-client/
│
├── public/
│   └── index.html           # Main HTML page
│
├── src/
│   ├── assets/
│   │   └── css/
    │       ├── general.css
    │       ├── icons.css
    │       ├── root.css
    │       └── tailwind.css
│   │
│   ├── components/          # Reusable and generic React components
│   │   ├── common/          # Common components like buttons, inputs, etc.
│   │   ├── layout/          # Components related to page layout
│   │   └── hooks/           # Custom React hooks
│   │
│   ├── pages/               # Page components, correspond to views/routes
│   │
│   ├── services/            # Services for handling logics like API calls
│   │
│   ├── utils/               # Utility functions, constants
│   │
│   ├── app/
│   │   └── App.js           # Main application component
│   │
│   ├── index.js             # Entry point for the React application, renders the App component
│   └── index.css            # Global styles
│
├── .gitignore               # Files and folders to be ignored by Git
├── package.json             # Package management and npm scripts
├── README.md                # Project documentation
└── test
    ├── e2e/
    └── unit/

```

# Installation

### Install Packages

```bash
bun i
```

## Commands

### Dev Mode

```bash
bun run start
```

### Pro Mode

```bash
bun run build
```

# NAMING ELEMENTS IN FRONTEND Only en ID

- vx-{element}-{page}-{name}

## ELEMENTS
	1. input = inp
	2. checkbox = che
	3. radiobutton = rdb
	4. switch = swt
	5. dropdown = dpn
	6. number = nmr
	7. texarea = txa
	8. button = btn
