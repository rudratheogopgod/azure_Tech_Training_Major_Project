namespace NotesAzureApp.Api;

public class Note
{
    public Note(string title)
    {
        Title = title;
    }

    public string? Id { get; set; }
    public string Title { get; set; }
    public string? Content { get; set; }
    public List<DocumentAttachment>? Attachments { get; set; }
    public DateTimeOffset CreatedDate { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? UpdatedDate { get; set; }
    public Dictionary<string, string>? Tags { get; set; }
}

public class DocumentAttachment
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string BlobName { get; set; } = string.Empty;
    public DateTimeOffset UploadedDate { get; set; } = DateTimeOffset.UtcNow;
}


