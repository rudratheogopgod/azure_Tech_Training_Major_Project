# Notes Azure App

<div align="center">

![Notes Azure App](https://img.shields.io/badge/Notes-Azure%20App-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![.NET](https://img.shields.io/badge/.NET-8.0-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge)

**A modern, cloud-native personal notes management application with document attachment support**

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Contributing](#-contributing) • [License](#-license)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Local Development](#-local-development)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

## 🎯 Overview

**Notes Azure App** is a full-stack, cloud-native application that enables users to create, edit, and manage personal notes with document attachment capabilities. Built with modern industry best practices, it leverages Azure cloud services for scalable, secure, and reliable document storage and management.

### Key Highlights

- ✨ **Modern UI/UX** - Beautiful React interface with Fluent UI components
- ☁️ **Cloud-Native** - Built on Azure PaaS services
- 🔒 **Secure** - Managed Identity authentication, no hardcoded credentials
- 🚀 **Scalable** - Auto-scaling capabilities with serverless options
- 📦 **Containerized** - Docker support for consistent deployments
- 🔄 **CI/CD Ready** - GitHub Actions pipeline included
- 📱 **Responsive** - Works on desktop and tablet devices

## ✨ Features

### Core Functionality

- ✅ **Create and Edit Notes** - Rich text note creation and editing
- ✅ **Upload Documents** - Attach multiple files to notes (PDF, images, documents, etc.)
- ✅ **View and Download Files** - Secure file viewing and downloading
- ✅ **Search Notes** - Full-text search across notes and content
- ✅ **Delete Notes** - Remove notes with cascade deletion of attachments
- ✅ **Note Metadata** - Support for tags and timestamps

### Advanced Features

- 🔍 **Full-Text Search** - Search across note titles and content
- 📎 **Multiple Attachments** - Attach multiple files per note
- 🏷️ **Tagging System** - Organize notes with custom tags
- 📊 **File Metadata** - Track file size, type, and upload date
- 🎨 **Modern UI** - Clean, intuitive interface with Fluent UI
- 📱 **Responsive Design** - Works on various screen sizes

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Fluent UI** - Microsoft design system
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **ASP.NET Core 8.0** - High-performance web framework
- **C#** - Strongly-typed language
- **Minimal APIs** - Lightweight endpoints
- **Swagger/OpenAPI** - API documentation

### Data & Storage
- **Azure Cosmos DB (NoSQL)** - Document database for notes
- **Azure Blob Storage** - Object storage for documents

### Infrastructure
- **Azure App Service** - Platform hosting
- **Azure Key Vault** - Secrets management
- **Azure Monitor** - Observability
- **Docker** - Containerization
- **NGINX** - Reverse proxy
- **GitHub Actions** - CI/CD automation
- **Bicep** - Infrastructure as Code

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                          │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Azure App Service (Web)                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │           NGINX Reverse Proxy                      │  │
│  │  - Serves React static files                      │  │
│  │  - Routes /api/* to backend                       │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ /api/*
                     ▼
┌─────────────────────────────────────────────────────────┐
│            Azure App Service (API)                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │         ASP.NET Core 8.0 API                     │  │
│  │  - RESTful endpoints                             │  │
│  │  - Managed Identity authentication               │  │
│  └──────────────────────────────────────────────────┘  │
└─────┬───────────────────────────────────────┬──────────┘
      │                                       │
      │ Notes & Metadata                     │ Documents
      ▼                                       ▼
┌─────────────────────┐          ┌──────────────────────┐
│  Azure Cosmos DB    │          │  Azure Blob Storage  │
│  (NoSQL API)        │          │  (Container: docs)  │
│  - Note documents    │          │  - File blobs        │
│  - Attachment refs   │          │  - Secure access     │
└─────────────────────┘          └──────────────────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [.NET SDK 8.0](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) (includes npm)
- [Azure Developer CLI (azd)](https://aka.ms/azd-install) (optional, for Azure deployment)
- [Docker](https://www.docker.com/get-started) (optional, for containerized deployment)
- [Git](https://git-scm.com/)

## 🚀 Quick Start

### Option 1: Azure Deployment (Recommended)

The easiest way to get started is using Azure Developer CLI:

```bash
# Clone the repository
git clone https://github.com/yourusername/notes-azure-app.git
cd notes-azure-app

# Login to Azure
azd auth login

# Provision and deploy everything
azd up
```

This will:
- Create all Azure resources automatically
- Deploy the application
- Configure all connections
- Provide you with the application URL

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/notes-azure-app.git
cd notes-azure-app

# Set up Azure resources manually or use existing ones
# Set environment variables
export AZURE_COSMOS_ENDPOINT="https://your-cosmos.documents.azure.com:443/"
export AZURE_COSMOS_DATABASE_NAME="Notes"
export AZURE_BLOB_STORAGE_ENDPOINT="https://your-storage.blob.core.windows.net/"
export AZURE_BLOB_STORAGE_CONTAINER_NAME="documents"

# Login to Azure CLI
az login

# Run API (Terminal 1)
cd src/api
dotnet restore
dotnet run

# Run Web (Terminal 2)
cd src/web
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## 💻 Local Development

### Running the API

```bash
cd src/api
dotnet restore
dotnet run
```

The API will be available at:
- HTTP: http://localhost:3100
- HTTPS: https://localhost:3101
- Swagger UI: http://localhost:3100

### Running the Web Frontend

```bash
cd src/web
npm install
npm run dev
```

The web app will be available at: http://localhost:5173

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up

# Or build individually
docker build -t notes-api ./src/api
docker build -t notes-web ./src/web
```

## 🚢 Deployment

### Azure Deployment

```bash
# Using Azure Developer CLI
azd up

# Or manually
azd provision  # Create infrastructure
azd deploy    # Deploy application
```

### Docker Hub Deployment

```bash
# Build and push images
docker build -t yourusername/notes-azure-app-api ./src/api
docker build -t yourusername/notes-azure-app-web ./src/web

docker push yourusername/notes-azure-app-api
docker push yourusername/notes-azure-app-web
```

### CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci-cd.yml`) that:

1. Builds Docker images
2. Runs tests
3. Pushes to Docker Hub
4. Deploys to Azure

**Setup GitHub Secrets:**
- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Your Docker Hub password/token
- `AZURE_CREDENTIALS` - Azure service principal (JSON)

## 📚 API Documentation

### Base URL
- Local: `http://localhost:3100`
- Production: `https://your-api.azurewebsites.net`

### Notes Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notes` | Get all notes |
| GET | `/notes/{id}` | Get specific note |
| POST | `/notes` | Create new note |
| PUT | `/notes/{id}` | Update note |
| DELETE | `/notes/{id}` | Delete note |
| GET | `/notes/search?query={term}` | Search notes |

### Document Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/notes/{noteId}/documents` | Upload document |
| GET | `/notes/{noteId}/documents/{documentId}/download` | Download document |
| DELETE | `/notes/{noteId}/documents/{documentId}` | Delete document |

### Example Requests

**Create Note:**
```bash
curl -X POST http://localhost:3100/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "My Note", "content": "Note content"}'
```

**Upload Document:**
```bash
curl -X POST http://localhost:3100/notes/{noteId}/documents \
  -F "file=@document.pdf"
```

See `openapi.yaml` for complete API documentation.

## 📁 Project Structure

```
notes-azure-app/
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # GitHub Actions CI/CD
├── infra/                         # Infrastructure as Code
│   ├── app/
│   │   ├── api-appservice-avm.bicep
│   │   ├── web-appservice-avm.bicep
│   │   ├── db-avm.bicep          # Cosmos DB
│   │   ├── blob-storage-avm.bicep # Blob Storage
│   │   └── cosmos-role-assignment.bicep
│   ├── main.bicep                 # Main infrastructure
│   └── abbreviations.json
├── src/
│   ├── api/                       # C# Backend
│   │   ├── Note.cs
│   │   ├── NotesRepository.cs
│   │   ├── BlobStorageService.cs
│   │   ├── NotesEndpointsExtensions.cs
│   │   ├── Program.cs
│   │   └── Dockerfile
│   └── web/                       # React Frontend
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   └── models/
│       ├── nginx/
│       │   └── nginx.conf
│       └── Dockerfile
├── docker-compose.yml             # Local development
├── azure.yaml                     # Azure Developer CLI config
└── README.md                      # This file
```

## 🤝 Contributing

Contributions are welcome! This is an open-source project, and we encourage community participation.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and patterns
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure code compiles without errors

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Rudra Agrawal**

- GitHub: [@rudratheogopgod](https://github.com/rudratheogopgod)
- Email: agrawalrudra710.com

## 🙏 Acknowledgments

- Built with [Azure](https://azure.microsoft.com/) cloud services
- UI components from [Fluent UI](https://developer.microsoft.com/en-us/fluentui)
- Infrastructure templates from [Azure Developer CLI](https://aka.ms/azd)

## 📞 Support

- 📖 [Documentation](https://github.com/yourusername/notes-azure-app/wiki)
- 🐛 [Report Issues](https://github.com/yourusername/notes-azure-app/issues)
- 💬 [Discussions](https://github.com/yourusername/notes-azure-app/discussions)

---

<div align="center">

**Made with ❤️ by Rudra Agrawal**

⭐ Star this repo if you find it helpful!

</div>
