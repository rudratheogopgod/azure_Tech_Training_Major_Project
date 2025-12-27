# Running Notes Azure App - Quick Guide

## Current Status

✅ **.NET SDK 8.0** - Installed and ready  
❌ **Node.js/npm** - Not installed (required for frontend)  
⚠️ **API Process** - Running but may need Azure credentials

## What You Need to Run the Full Application

### 1. Install Node.js (Required for Frontend)

Download and install Node.js 18+ from: https://nodejs.org/

After installation, verify:
```powershell
node --version
npm --version
```

### 2. Azure Account Setup

The application requires Azure services:
- **Azure Cosmos DB** - For storing notes
- **Azure Blob Storage** - For storing document attachments

You have two options:

#### Option A: Use Azure Developer CLI (Easiest)

```powershell
# Install Azure Developer CLI
# Visit: https://aka.ms/azd-install

# Login to Azure
azd auth login

# Provision and deploy everything
azd up
```

This will:
- Create all Azure resources automatically
- Deploy the application
- Configure all connections

#### Option B: Manual Azure Setup

1. **Create Azure Resources:**
   - Create a Cosmos DB account (NoSQL API)
   - Create a Storage Account with Blob Storage
   - Create a container named "documents" in Blob Storage

2. **Set Environment Variables:**
   ```powershell
   $env:AZURE_COSMOS_ENDPOINT = "https://your-cosmos-account.documents.azure.com:443/"
   $env:AZURE_COSMOS_DATABASE_NAME = "Notes"
   $env:AZURE_BLOB_STORAGE_ENDPOINT = "https://your-storage-account.blob.core.windows.net/"
   $env:AZURE_BLOB_STORAGE_CONTAINER_NAME = "documents"
   ```

3. **Login to Azure CLI:**
   ```powershell
   az login
   az account set --subscription "your-subscription-id"
   ```

## Running the Application

### Step 1: Start the API Backend

```powershell
cd src/api
dotnet run
```

The API should start on:
- HTTP: http://localhost:3100
- HTTPS: https://localhost:3101

**Note:** If you see errors about Azure credentials, you need to:
1. Login to Azure CLI: `az login`
2. Set the environment variables above
3. Ensure your Azure resources exist

### Step 2: Start the Web Frontend

**First, install Node.js if you haven't:**

Then:
```powershell
cd src/web
npm install
npm run dev
```

The web app will be available at: http://localhost:5173

### Step 3: Access the Application

1. Open your browser to: http://localhost:5173
2. The React app will connect to the API at http://localhost:3100
3. Start creating notes and uploading documents!

## Quick Start (After Prerequisites)

```powershell
# Terminal 1: API Backend
cd src/api
dotnet run

# Terminal 2: Web Frontend (after installing Node.js)
cd src/web
npm install
npm run dev
```

## Using Docker (Alternative)

If you have Docker installed:

```powershell
# Make sure to set environment variables in docker-compose.yml
docker-compose up
```

## Troubleshooting

### "Unable to connect to Azure services"
- Run `az login` to authenticate
- Verify your Azure resources exist
- Check environment variables are set

### "Node.js not found"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### "Port already in use"
- Change the port in `launchSettings.json` (API)
- Change the port in `vite.config.ts` (Web)

### API starts but shows errors
- Check Azure CLI is logged in: `az account show`
- Verify Cosmos DB and Blob Storage accounts exist
- Ensure Managed Identity has proper permissions

## Next Steps

1. **Install Node.js** - Required for frontend
2. **Set up Azure** - Either use `azd up` or manually create resources
3. **Run both services** - API and Web frontend
4. **Start using the app!** - Create notes and upload documents

For detailed setup instructions, see `LOCAL_SETUP.md`

