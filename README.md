<div align="center">
  <img src="static/base64bender.svg" alt="Base64Bender Logo" width="200"/>
  
  # Base64Bender

A modern, feature-rich Base64 text encoder and decoder built with cutting-edge web technologies.

[![GitHub Pages](https://img.shields.io/badge/demo-live-success)](https://cristicriss17g.github.io/Base64Bender/)
[![License](https://img.shields.io/github/license/CristiCriss17G/Base64Bender)](LICENSE)

</div>

## 🚀 Features

- **Dual Mode**: Encode and decode Base64 text seamlessly
- **User Settings**: Persistent preferences with local storage
- **PWA Support**: Install as a Progressive Web App
- **Modern UI**: Clean, responsive interface with theme switching
- **Copy to Clipboard**: Quick copy functionality
- **Drag & Drop**: Enhanced user experience
- **Offline Ready**: Works without an internet connection

## 🛠️ Tech Stack

This project leverages modern web technologies and serves as a showcase for:

### Core Framework

- [SvelteKit](https://kit.svelte.dev/) - Full-stack web framework
- [Svelte 5](https://svelte.dev/) - Latest version with modern reactivity
- [Bun](https://bun.sh/) - Fast JavaScript runtime and package manager

### Build Tools

- [Vite 7](https://vitejs.dev/) - Next-generation frontend tooling with Rolldown
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

### UI & Styling

- [Skeleton UI v4](https://www.skeleton.dev/) - Modern component library
- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful icon set

### Testing

- [Vitest](https://vitest.dev/) - Unit testing framework
- [Playwright](https://playwright.dev/) - End-to-end testing

### DevOps & Deployment

- [GitHub Pages](https://pages.github.com/) - Static site hosting
- [GitHub Actions](https://github.com/features/actions) - CI/CD automation
- [GitHub Container Registry](https://ghcr.io/) - Docker image hosting
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) - Containerization
- [Kubernetes](https://kubernetes.io/) - Container orchestration
- [CodeQL](https://securitylab.github.com/tools/codeql) - Security analysis
- [Dependabot](https://github.com/dependabot) - Automated dependency updates

## 📋 Prerequisites

- [Bun](https://bun.sh/) v1.0 or higher

## 🚀 Getting Started

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/CristiCriss17G/Base64Bender.git
cd Base64Bender
bun install
```

### Development

Start the development server:

```bash
bun run dev

# or start the server and open the app in a new browser tab
bun run dev --open
```

### Building

Create a production-optimized build:

```bash
bun run build
```

Preview the production build locally:

```bash
bun run preview
```

### Testing

Run unit tests:

```bash
bun run test:unit
```

Run end-to-end tests:

```bash
bun run test:e2e
```

Run all tests:

```bash
bun test
```

### Code Quality

Format code with Prettier:

```bash
bun run format
```

Lint code with ESLint:

```bash
bun run lint
```

Type-check with Svelte:

```bash
bun run check
```

### Dependency Management

Check for available updates:

```bash
bun run updates:check
```

Upgrade dependencies to latest versions:

```bash
bun run updates:upgrade
```

## 🐳 Docker

### Using Docker Compose

```bash
docker-compose up
```

### Building Docker Image

```bash
docker build -t base64bender .
```

### Running Docker Container

```bash
docker run -p 80:80 base64bender
```

## ☸️ Kubernetes

Example Kubernetes manifests are available in the `kubernetes/` directory:

- `namespace.example.yaml` - Namespace configuration
- `deploy.example.yaml` - Deployment configuration
- `service.example.yaml` - Service configuration
- `vs.example.yaml` - Virtual Service configuration

## 📦 Distribution

The project is available through multiple channels:

- **Live Demo**: [Base64Bender on GitHub Pages](https://cristicriss17g.github.io/Base64Bender/)
- **Docker Image**: [ghcr.io/cristicriss17g/base64bender](https://ghcr.io/cristicriss17g/base64bender)
- **Releases**: [GitHub Releases](https://github.com/CristiCriss17G/Base64Bender/releases) with source code and build artifacts

## 🔄 Recent Major Updates

- **Package Manager**: Migrated from pnpm to Bun for faster dependency management and runtime
- **Svelte 5**: Updated to the latest version with modern reactivity system
- **Skeleton UI v4**: Upgraded to version 4 with improved components
- **Tailwind CSS v4**: Migrated to the latest major version
- **Vite 7 with Rolldown**: Upgraded to Vite 7 using Rolldown for faster builds
- **Dependency Modernization**: All dependencies updated to their latest stable versions

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**CristiCriss17G**

- GitHub: [@CristiCriss17G](https://github.com/CristiCriss17G)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/CristiCriss17G/Base64Bender/issues).

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!
