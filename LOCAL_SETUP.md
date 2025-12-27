# Local Development Setup Guide

## Prerequisites

To run the Notes Azure App locally, you need:

1. **.NET SDK 8.0** ✅ (Installed: 8.0.204)
2. **Node.js 18+ and npm** ❌ (Not installed - Required for frontend)
3. **Azure Account** (For Cosmos DB and Blob Storage access)
4. **Azure Developer CLI (azd)** (Optional, for full Azure deployment)

## Running the Application

### Option 1: Using Azure Developer CLI (Recommended)

This is the easiest way to run the full application with all Azure services:

```bash
# Install Azure Developer CLI if not installed
# https://aka.ms/azd-install

# Login to Azure
azd auth login

# Provision and deploy (this sets up all Azure resources)
azd up

# Or just provision infrastructure
azd provision

# Then deploy
azd deploy --all
```

### Option 2: Local Development (Requires Azure Services)

#### Step 1: Set Up Environment Variables

Create a `src/api/appsettings.Development.json` or set environment variables:

```json
{
  "AZURE_COSMOS_ENDPOINT": "https://your-cosmos-account.documents.azure.com:443/",
  "AZURE_COSMOS_DATABASE_NAME": "Notes",
  "AZURE_BLOB_STORAGE_ENDPOINT": "https://your-storage-account.blob.core.windows.net/",
  "AZURE_BLOB_STORAGE_CONTAINER_NAME": "documents"
}
```

Or set environment variables:
```powershell
$env:AZURE_COSMOS_ENDPOINT = "https://your-cosmos-account.documents.azure.com:443/"
$env:AZURE_COSMOS_DATABASE_NAME = "Notes"
$env:AZURE_BLOB_STORAGE_ENDPOINT = "https://your-storage-account.blob.core.windows.net/"
$env:AZURE_BLOB_STORAGE_CONTAINER_NAME = "documents"
```

#### Step 2: Run the API Backend

```bash
cd src/api
dotnet restore
dotnet run
```

The API will be available at:
- HTTP: http://localhost:3100
- HTTPS: https://localhost:3101

#### Step 3: Run the Web Frontend

**First, install Node.js:**
- Download from: https://nodejs.org/
- Install Node.js 18+ (includes npm)

**Then run the frontend:**

```bash
cd src/web
npm install
npm run dev
```

The web app will be available at: http://localhost:5173

### Option 3: Using Docker Compose

**Prerequisites:**
- Docker Desktop installed
- Azure credentials configured

```bash
# Set environment variables in docker-compose.yml or use .env file
docker-compose up
```

This will start both API and Web containers.

## Authentication

The application uses Azure Managed Identity for authentication. For local development, you need to:

1. **Login to Azure CLI:**
   ```bash
   az login
   ```

2. **Set your Azure subscription:**
   ```bash
   az account set --subscription "your-subscription-id"
   ```

The `DefaultAzureCredential` will automatically use your Azure CLI credentials.

## Troubleshooting

### API won't start
- Check that Azure CLI is logged in: `az account show`
- Verify environment variables are set correctly
- Check that Cosmos DB and Blob Storage accounts exist in Azure

### Frontend won't start
- Install Node.js from https://nodejs.org/
- Run `npm install` in the `src/web` directory
- Check that port 5173 is not in use

### Connection errors
- Verify your Azure resources are created and accessible
- Check that Managed Identity has proper permissions
- Ensure firewall rules allow your IP address

## Quick Start Commands

```bash
# 1. Install Node.js (if not installed)
# Download from https://nodejs.org/

# 2. Login to Azure
az login

# 3. Run API
cd src/api
dotnet run

# 4. In a new terminal, run Web
cd src/web
npm install
npm run dev

# 5. Open browser to http://localhost:5173
```

## API Endpoints (when running locally)

- Base URL: http://localhost:3100
- Swagger UI: http://localhost:3100 (root)
- Notes API: http://localhost:3100/notes
- Health Check: http://localhost:3100/notes

## Notes

- The API requires Azure Cosmos DB and Blob Storage to function
- For true local development without Azure, you would need to:
  - Use Cosmos DB Emulator (Windows only)
  - Use Azurite (Azure Storage Emulator)
  - Or mock the services

