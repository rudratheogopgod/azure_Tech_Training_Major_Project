using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace NotesAzureApp.Api;

public class BlobStorageService
{
    private readonly BlobContainerClient _containerClient;

    public BlobStorageService(IConfiguration configuration)
    {
        var blobServiceClient = new BlobServiceClient(
            new Uri(configuration["AZURE_BLOB_STORAGE_ENDPOINT"]!),
            new Azure.Identity.DefaultAzureCredential());
        
        var containerName = configuration["AZURE_BLOB_STORAGE_CONTAINER_NAME"] ?? "documents";
        _containerClient = blobServiceClient.GetBlobContainerClient(containerName);
        
        // Ensure container exists
        _containerClient.CreateIfNotExistsAsync().Wait();
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
    {
        var blobName = $"{Guid.NewGuid()}_{fileName}";
        var blobClient = _containerClient.GetBlobClient(blobName);
        
        await blobClient.UploadAsync(fileStream, new BlobUploadOptions
        {
            HttpHeaders = new BlobHttpHeaders
            {
                ContentType = contentType
            }
        });

        return blobName;
    }

    public async Task<Stream> DownloadFileAsync(string blobName)
    {
        var blobClient = _containerClient.GetBlobClient(blobName);
        var response = await blobClient.DownloadStreamingAsync();
        return response.Value.Content;
    }

    public async Task<bool> DeleteFileAsync(string blobName)
    {
        var blobClient = _containerClient.GetBlobClient(blobName);
        return await blobClient.DeleteIfExistsAsync();
    }

    public string GetFileUrl(string blobName, TimeSpan? expiryTime = null)
    {
        var blobClient = _containerClient.GetBlobClient(blobName);
        var expiry = expiryTime ?? TimeSpan.FromHours(1);
        
        // Generate SAS token using BlobSasBuilder
        var sasBuilder = new Azure.Storage.Sas.BlobSasBuilder
        {
            BlobContainerName = _containerClient.Name,
            BlobName = blobName,
            Resource = "b", // blob
            ExpiresOn = DateTimeOffset.UtcNow.Add(expiry)
        };
        sasBuilder.SetPermissions(Azure.Storage.Sas.BlobSasPermissions.Read);
        
        var sasUri = blobClient.GenerateSasUri(sasBuilder);
        return sasUri.ToString();
    }
}


