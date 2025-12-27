# Notes Azure App - Project Summary

**Author:** Rudra Agrawal  
**Project Name:** Notes Azure App  
**Version:** 1.0.0  
**Date:** 2024

## Executive Summary

Notes Azure App is a comprehensive, cloud-native personal notes management application that enables users to create, edit, and manage notes with document attachment capabilities. The application is built using modern industry best practices and leverages Azure cloud services for scalable, secure, and reliable document storage and management.

## Core Features Implemented

### ✅ Notes Management
- **Create Notes** - Users can create new notes with title and content
- **Edit Notes** - Full editing capabilities for existing notes
- **Delete Notes** - Remove notes with cascade deletion of attached documents
- **Search Notes** - Full-text search across note titles and content
- **Note Metadata** - Support for tags and timestamps (created/updated dates)

### ✅ Document Management
- **Upload Documents** - Attach multiple files to notes (PDF, images, documents, etc.)
- **View Attachments** - List all documents attached to a note
- **Download Files** - Secure download of attached documents
- **Delete Documents** - Remove individual attachments from notes
- **File Metadata** - Track file name, size, content type, and upload date

## Technology Stack

### Frontend
- **React 18** - Modern UI framework with hooks and context API
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Fluent UI** - Microsoft's design system components
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication

### Backend
- **ASP.NET Core 8.0** - High-performance web framework
- **C#** - Strongly-typed programming language
- **Minimal APIs** - Lightweight endpoint definitions
- **Swagger/OpenAPI** - API documentation

### Data Storage
- **Azure Cosmos DB (NoSQL)** - Document database for notes and metadata
  - Serverless pricing model
  - Global distribution
  - Automatic scaling
- **Azure Blob Storage** - Object storage for document files
  - Standard LRS (Locally Redundant Storage)
  - Secure access via Managed Identity
  - Support for all file types

### Infrastructure & DevOps
- **Azure App Service** - Platform-as-a-Service hosting
  - Linux containers
  - Automatic scaling
  - Built-in monitoring
- **Azure Key Vault** - Secrets management
- **Azure Monitor & Application Insights** - Observability and telemetry
- **Docker** - Containerization for consistent deployments
- **NGINX** - Reverse proxy and static file serving
- **GitHub Actions** - CI/CD pipeline automation
- **Bicep** - Infrastructure as Code (IaC)

## Architecture Overview

### System Architecture

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
│            Azure App Service (API)                     │
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

### Data Flow

1. **Note Creation:**
   - User creates note via React UI
   - Frontend sends POST to `/notes` endpoint
   - API saves note to Cosmos DB
   - Returns created note with ID

2. **Document Upload:**
   - User selects file in UI
   - Frontend sends multipart/form-data to `/notes/{id}/documents`
   - API uploads file to Blob Storage
   - API updates note in Cosmos DB with attachment metadata
   - Returns updated note

3. **Document Download:**
   - User clicks download button
   - Frontend requests `/notes/{id}/documents/{docId}/download`
   - API retrieves file from Blob Storage
   - API streams file to client
   - Browser downloads file

## Security Implementation

### Authentication & Authorization
- **Azure Managed Identity** - No connection strings in code
- **Role-Based Access Control (RBAC)** - Fine-grained permissions
- **DefaultAzureCredential** - Automatic credential management

### Data Protection
- **Azure Key Vault** - Secure storage of secrets
- **HTTPS Only** - Encrypted data in transit
- **Private Blob Access** - No public blob access
- **CORS Configuration** - Controlled cross-origin requests

### Best Practices
- No hardcoded credentials
- Principle of least privilege
- Secure defaults (HTTPS, private storage)
- Regular security updates via dependency management

## Deployment Architecture

### Docker Containers
- **Web Container** - React app built with Vite, served via NGINX
- **API Container** - .NET 8.0 API with all dependencies

### NGINX Configuration
- Serves static React files
- Proxies API requests to backend
- Handles routing for SPA

### CI/CD Pipeline
1. **Build Phase**
   - Builds Docker images for API and Web
   - Runs unit tests
   - Validates code quality

2. **Push Phase**
   - Pushes images to Docker Hub
   - Tags with version and commit SHA

3. **Deploy Phase**
   - Deploys to Azure App Services
   - Updates infrastructure if needed
   - Runs health checks

## API Endpoints

### Notes Endpoints
- `GET /notes` - List all notes (with pagination)
- `GET /notes/{id}` - Get specific note
- `POST /notes` - Create new note
- `PUT /notes/{id}` - Update note
- `DELETE /notes/{id}` - Delete note (cascades to documents)
- `GET /notes/search?query={term}` - Search notes

### Document Endpoints
- `POST /notes/{noteId}/documents` - Upload document (multipart/form-data)
- `GET /notes/{noteId}/documents/{documentId}/download` - Download document
- `DELETE /notes/{noteId}/documents/{documentId}` - Delete document

## Database Schema

### Cosmos DB Container: "Note"
```json
{
  "id": "guid",
  "title": "string",
  "content": "string",
  "attachments": [
    {
      "id": "guid",
      "fileName": "string",
      "contentType": "string",
      "fileSize": "number",
      "blobName": "string",
      "uploadedDate": "datetime"
    }
  ],
  "tags": { "key": "value" },
  "createdDate": "datetime",
  "updatedDate": "datetime"
}
```

### Blob Storage Container: "documents"
- Blob naming: `{guid}_{originalFileName}`
- Metadata stored in Cosmos DB
- Access via Managed Identity

## Modern Industry Practices

### Development Practices
✅ **Type Safety** - TypeScript + C#  
✅ **Clean Architecture** - Separation of concerns  
✅ **SOLID Principles** - Maintainable code structure  
✅ **RESTful API Design** - Standard HTTP methods and status codes  
✅ **Error Handling** - Comprehensive exception handling  
✅ **Logging** - Structured logging with Application Insights  
✅ **Code Organization** - Modular, reusable components  

### DevOps Practices
✅ **Infrastructure as Code** - Bicep templates  
✅ **Containerization** - Docker for consistency  
✅ **CI/CD Automation** - GitHub Actions  
✅ **Version Control** - Git with semantic versioning  
✅ **Environment Management** - Separate dev/staging/prod  
✅ **Monitoring** - Application Insights integration  

### Cloud Practices
✅ **Managed Services** - Leverage Azure PaaS  
✅ **Scalability** - Auto-scaling capabilities  
✅ **High Availability** - Redundant services  
✅ **Cost Optimization** - Serverless where possible  
✅ **Security First** - Managed Identity, Key Vault  
✅ **Observability** - Comprehensive monitoring  

## Project Structure

```
notes-azure-app/
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # GitHub Actions pipeline
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
│   │   ├── Todo.Api.csproj
│   │   └── Dockerfile
│   └── web/                       # React Frontend
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   │   └── notesPage.tsx
│       │   ├── services/
│       │   │   └── noteService.ts
│       │   ├── models/
│       │   │   └── note.ts
│       │   ├── actions/
│       │   │   └── noteActionCreators.ts
│       │   └── App.tsx
│       ├── nginx/
│       │   └── nginx.conf
│       ├── Dockerfile
│       └── package.json
├── docker-compose.yml             # Local development
├── azure.yaml                     # Azure Developer CLI config
└── README.md                      # Project documentation
```

## Key Features & Capabilities

### User Experience
- **Intuitive UI** - Clean, modern interface with Fluent UI
- **Responsive Design** - Works on desktop and tablet
- **Real-time Updates** - Immediate feedback on actions
- **Search Functionality** - Quick note discovery
- **File Management** - Easy upload/download of documents

### Developer Experience
- **Type Safety** - Catch errors at compile time
- **Hot Reload** - Fast development iteration
- **API Documentation** - Swagger/OpenAPI integration
- **Local Development** - Docker Compose setup
- **Clear Structure** - Easy to navigate and extend

### Operations
- **Automated Deployment** - CI/CD pipeline
- **Monitoring** - Application Insights dashboards
- **Logging** - Centralized log aggregation
- **Scaling** - Automatic resource scaling
- **Backup** - Cosmos DB automatic backups

## Cost Optimization

- **Cosmos DB Serverless** - Pay per request, no minimum
- **App Service Basic Plan** - Cost-effective for small to medium scale
- **Blob Storage LRS** - Lower cost for non-critical data
- **Auto-scaling** - Scale down during low usage

## Future Enhancements (Potential)

- User authentication and multi-tenancy
- Note sharing and collaboration
- Rich text editing with markdown support
- Note categories and folders
- Export notes to PDF/Word
- Mobile app (React Native)
- Advanced search with filters
- Note versioning and history
- Integration with OneDrive/Google Drive

## Conclusion

Notes Azure App is a production-ready, cloud-native application that demonstrates modern software development practices. It provides a solid foundation for personal notes management with document storage capabilities, built on Azure's scalable and secure cloud platform.

The application showcases:
- Full-stack development (React + .NET)
- Cloud-native architecture
- Infrastructure as Code
- CI/CD automation
- Security best practices
- Comprehensive monitoring

**Developed by:** Rudra Agrawal  
**Project:** Notes Azure App  
**Version:** 1.0.0

