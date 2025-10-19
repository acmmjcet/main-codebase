# ACM - Main Codebase
<img alt="Status" src="https://img.shields.io/badge/status-under--development-orange" />
<div style="display: flex; justify-content: space-between; align-items: center;">
  <!-- <img alt="Status" src="https://img.shields.io/badge/status-production-brightgreen" /> -->
  <!-- <img alt="Status" src="https://img.shields.io/badge/bug%20fixes-required-orange" /> -->
  <!-- <img alt="Status" src="https://img.shields.io/badge/security%20improvements-needed-red" /> -->
  <!-- <img alt="Status" src="https://img.shields.io/badge/maintenance-off-red" /> -->
  <!-- <img alt="Status" src="https://img.shields.io/badge/status-production--in--progress-yellow" /> -->
</div>

<div align="center">
<img src="./apps/web/public/logo.png" alt="ACM Logo" width="200"/>


**A Modern, Scalable System Architecture with the Edge compute power**

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.3-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![PNPM](https://img.shields.io/badge/PNPM-10.12.1-orange?style=for-the-badge&logo=pnpm)](https://pnpm.io)
[![Nx](https://img.shields.io/badge/Nx-21.6.4-blue?style=for-the-badge&logo=nx)](https://nx.dev)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-4.0-lightgray?style=for-the-badge&logo=cloudflare)](https://developers.cloudflare.com/workers)
[![HonoJS](https://img.shields.io/badge/HonoJS-4.0-blue?style=for-the-badge&logo=honodev)](https://hono.dev)
[![D1 Database](https://img.shields.io/badge/D1_Database-1.0-blue?style=for-the-badge&logo=cloudflare)](https://developers.cloudflare.com/d1)
[![Drizzle](https://img.shields.io/badge/Drizzle-0.1-blue?style=for-the-badge&logo=drizzle)](https://www.drizzle.com)
[![Mailtrap](https://img.shields.io/badge/Mailtrap-1.0-blue?style=for-the-badge&logo=mailtrap)](https://mailtrap.io)
[![Resend](https://img.shields.io/badge/Resend-1.0-green?style=for-the-badge&logo=resend)](https://resend.com)
[![Supabase](https://img.shields.io/badge/Supabase-1.0-green?style=for-the-badge&logo=supabase)](https://supabase.com)
[![GCP OAuth](https://img.shields.io/badge/GCP%20OAuth-1.0-blue?style=for-the-badge&logo=googlecloud)](https://cloud.google.com/docs/authentication)
[![ESLint](https://img.shields.io/badge/ESLint-8.35.0-blue?style=for-the-badge&logo=eslint)](https://eslint.org/)
[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-enabled-blue?style=for-the-badge&logo=github-actions)](https://github.com/features/actions)


<p align="center">
    Official website of ACM MJCET — empowering students in computer science and technology through learning, collaboration, and innovation.
    <br />
    <br />
    <a href="#getting-started"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://acmmjcet.com">View Website</a>
    ·
    <a href="https://github.com/acmmjcet/main-website/blob/main/.github/ISSUE_TEMPLATE/bug_report.md">Report Bug</a>
    ·
    <a href="https://github.com/acmmjcet/main-website/blob/main/.github/ISSUE_TEMPLATE/feature_request.md">Request Feature</a>
  </p>

</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#overview">Overview</a>
    </li>
    <li>
      <a href="#core-principles">Core Principles</a>
      <ul>
        <li><a href="#project-structure">Project Structure</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#features">Getting Started</a></li>
        <li><a href="#running-web-ui">Running Web UI</a></li>
      </ul>
    </li>
    <li><a href="#general-nx-commands">General commands</a></li>
    <li><a href="#top-contributers">Top Contributers</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>


## 🌟 Overview

ACM Main Codebase is a comprehensive enterprise grade monorepo contains multiple applications organized in a scalable architecture.

### Core Principles

- **Security by Design**: Every component is built with security as a priority
- **Scalable Architecture**: Designed to grow with traffic
- **Maintainable Codebase**: Clean, documented, and easy to maintain
- **Cloud Native**: Optimized for modern cloud environments

## 📁 Project Structure

```
main-codebase/
├── apps/                    # Application packages
│   ├── web/                 # Main web application
│   ├── cf-server/           # Cloudflare backend worker
│   ├── admin-web/           # Admin-portal for the entire infrastructure management and overlook
├── packages/                # Shared packages
│   ├── api-endpoints/       # Api-endpoints shared across tools, apps and packages
└── tools/                   # Build and development tools to ease ACM Event management or plan execution
```

##  Features

- **Microservices Architecture**
- **DevOps Integration**
- **CI/CD Pipeline Support**
- **Detailed Documentation**
- **Animation System**
- **Modern UI Components**

## 🚦 Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/acmmjcet/main-codebase.git
cd main-codebase
```

2. **Install pnpm**
pnpm is the package manager used for managing dependencies in this repository. To install pnpm, follow the steps below based on your operating system:

You can install pnpm globally using Homebrew (macOS) or npm (Linux/macOS/Windows) :
```
npm install -g pnpm
```
If you encounter any issues with the installation, refer to the official pnpm documentation.

3. **Install dependencies**
```bash
pnpm install
```

# Running the Web UI
The project contains a web application built using Next.js. To run the application, follow these steps:

1. Run the Web UI Locally
To start the web application locally, use the following command:

nx serve web
This will start the development server on a local machine and you can access the application in your browser at http://localhost:3000. If port 3000 is already in use, it will automatically use the next available port (e.g., 3001).

2. What Happens in the web Application
The web application is built using Next.js, a React framework, and is designed to be used as the user interface of this project. Any changes made within the web directory will trigger rebuilding the project and potentially redeploying the application to Cloudflare Workers.

# Deployment to Cloudflare Workers
The web application is also deployed to Cloudflare Workers. This deployment happens automatically when changes are made inside the web folder.

1. Deployment Flow
Changes made within the apps/web folder will trigger automated web deployment to Cloudflare Workers. This is managed by OpenNext scripts written with pnpm run build and pnpm run deploy, through CD pipeline using Cloudflare accont ID and API token.
Every time you run the nx serve web command and changes are made, the build will trigger the deployment process to Cloudflare Workers, ensuring the latest version is always live.

## 📦 Available Scripts

- `pnpm install` - Install all dependencies
- `npx nx dev <app>` - Start development server
- `npx nx build <app>` - Build application
- `npx nx test <app>` - Run tests
- `pnpm lint` - Lint code

## General Nx Commands
Nx provides several commands for managing your monorepo, including tasks like running, building, testing, and linting applications and libraries.

1. nx serve <project>
Starts the development server for a given project (e.g., web).

nx serve web
This will start the development server for the web project, and you can access the application at http://localhost:3000 (or the next available port).

2. nx build <project>
Builds the project and compiles the code.

nx build web
This command will build the web project and output the compiled code to the dist/ folder, which is ready for deployment.

3. nx lint <project>
Runs linting checks on the specified project.

nx lint web
This will check the web project for linting errors, and output any issues found.

4. nx test <project>
Runs unit tests for a given project.

nx test web
This will run the unit tests for the web project and show the results in the terminal.

5. nx affected:build
Builds the affected projects based on the changes made to the workspace.

nx affected:build --base=main --head=HEAD
This will only build projects that were affected by the changes between the main branch and the current branch.

6. nx run-many
Run a target (e.g., build, test, lint) for multiple projects at once.

nx run-many --target=build --projects=web,other-app
This command allows you to run the build target for both the web project and another app in the workspace.

7. nx migrate
Upgrade the Nx workspace and its dependencies to the latest version.

nx migrate latest
This will migrate your workspace to the latest Nx version, making sure everything is up-to-date.

## Troubleshooting
If you run into any issues, here are a few things to check:

Make sure pnpm is installed: Verify that you can run pnpm --version to ensure pnpm is installed globally.
Run Nx with --verbose: If a command isn't working as expected, try adding --verbose to get more detailed error logs.
Clear Nx cache: If things are stuck, try clearing the Nx cache with nx reset and reinstall dependencies.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## Contributing Guidelines

### 1. Branching Strategy

Start from **dev** branch. When starting any work, always create your branch from **dev**.

**Branch naming convention:**

- `feat/featurename` → For new features  
- `fix/whatyouarefixing` → For bug fixes  
- `update/whereyouareupdating` → For content updates  
- `docs/whatyouupdated` → For documentation changes  
- `refactor/whatyourefactored` → For code refactoring  
- `hotfix/urgentfix` → For urgent production fixes  

---

### 2. Pull Request (PR) Workflow

**Step 1: Development**  
- Push your changes and create a PR to merge into `dev`.  
- Provide a clear description of your work.

**Step 2: Testing**  
- After merging into `dev`, create a PR to `test`.  
- Ensure all code passes checks.  
- Minimum 2 approvals required.

**Step 3: Production**  
- Create a PR from `test` → `main`.  
- Must be approved by **Tech Captain** and one reviewer.  
- Upon approval, code is deployed.

---

### 3. Commit Message Guidelines

Use prefixes for consistent commits:

| Prefix | Purpose |
|---------|----------|
| feat | New features |
| fix | Bug fixes |
| docs | Documentation updates |
| refactor | Code refactoring |
| style | Non-functional changes (formatting) |
| test | Adding/updating tests |
| chore | Maintenance tasks |

**Example:**  
`feat: add events page with dynamic fetching`

---

### 4. CI/CD Pipeline
All CI/CD checks (ESLint, build, and deployment validations) must pass before merging.

### 5. Conflict Resolution
If merge conflicts occur, contact the **Tech Captain** immediately.

### 6. PR Review Time
All PRs should be reviewed within **5 days** of submission.

### 7. Emergency Procedure
In case of urgent fixes, the Tech Captain may merge directly to production.

---
## 🏅 Top Contributers

<a href="https://github.com/acmmjcet/main-website/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=acmmjcet/main-website" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 🧾 License

This project is licensed under **GPL-3.0** — [Learn More](https://github.com/acmmjcet/main-website/blob/main/LICENSE)

---

## 📞 Contact

📧 Email – acm@mjcollege.ac.in
🌐 Website – [acmmjcet.com](https://acmmjcet.com)

---

## 🙏 Acknowledgments

These open-source projects power ACM MJCET’s website:

- [Shadcn](https://ui.shadcn.com)  
- [Supabase](https://supabase.io)  
- [Next.js](https://nextjs.org)  
- [Tailwind CSS](https://tailwindcss.com)

<!--Markdown Links-->

[contributors-shield]: https://img.shields.io/github/contributors/acmmjcet/main-website.svg?style=for-the-badge
[contributors-url]: https://github.com/acmmjcet/main-website/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/acmmjcet/main-website.svg?style=for-the-badge
[forks-url]: https://github.com/acmmjcet/main-website/network/members
[stars-shield]: https://img.shields.io/github/stars/acmmjcet/main-website.svg?style=for-the-badge
[stars-url]: https://github.com/acmmjcet/main-website/stargazers
[issues-shield]: https://img.shields.io/github/issues/acmmjcet/main-website.svg?style=for-the-badge
[issues-url]: https://github.com/acmmjcet/main-website/issues
[license-shield]: https://img.shields.io/github/license/acmmjcet/main-website.svg?style=for-the-badge
[license-url]: https://github.com/acmmjcet/main-website/blob/main/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/company/acm-mjcet/



<div align="center">
Built with ❤️ by the ACM Tech Team
</div>
        