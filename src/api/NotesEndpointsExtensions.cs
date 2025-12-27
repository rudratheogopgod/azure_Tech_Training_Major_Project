using Microsoft.AspNetCore.Http.HttpResults;
using System.Text.Json;

namespace NotesAzureApp.Api
{
    public static class NotesEndpointsExtensions
    {
        public static RouteGroupBuilder MapNotesApi(this RouteGroupBuilder group)
        {
            group.MapGet("/", GetNotes);
            group.MapPost("/", CreateNote);
            group.MapGet("/{noteId}", GetNote);
            group.MapPut("/{noteId}", UpdateNote);
            group.MapDelete("/{noteId}", DeleteNote);
            group.MapGet("/search", SearchNotes);
            
            // Document endpoints
            group.MapPost("/{noteId}/documents", UploadDocument);
            group.MapGet("/{noteId}/documents/{documentId}/download", DownloadDocument);
            group.MapDelete("/{noteId}/documents/{documentId}", DeleteDocument);
            
            return group;
        }

        public static async Task<Ok<IEnumerable<Note>>> GetNotes(
            NotesRepository repository, 
            int? skip = null, 
            int? batchSize = null)
        {
            return TypedResults.Ok(await repository.GetNotesAsync(skip, batchSize));
        }

        public static async Task<IResult> CreateNote(
            NotesRepository repository, 
            CreateUpdateNote note)
        {
            var newNote = new Note(note.title)
            {
                Content = note.content,
                Tags = note.tags
            };

            await repository.AddNoteAsync(newNote);

            return TypedResults.Created($"/notes/{newNote.Id}", newNote);
        }

        public static async Task<IResult> GetNote(
            NotesRepository repository, 
            string noteId)
        {
            var note = await repository.GetNoteAsync(noteId);

            return note == null ? TypedResults.NotFound() : TypedResults.Ok(note);
        }

        public static async Task<IResult> UpdateNote(
            NotesRepository repository, 
            string noteId, 
            CreateUpdateNote note)
        {
            var existingNote = await repository.GetNoteAsync(noteId);
            if (existingNote == null)
            {
                return TypedResults.NotFound();
            }

            existingNote.Title = note.title;
            existingNote.Content = note.content;
            existingNote.Tags = note.tags;
            existingNote.UpdatedDate = DateTimeOffset.UtcNow;

            await repository.UpdateNote(existingNote);

            return TypedResults.Ok(existingNote);
        }

        public static async Task<IResult> DeleteNote(
            NotesRepository repository, 
            BlobStorageService blobService,
            string noteId)
        {
            var note = await repository.GetNoteAsync(noteId);
            if (note == null)
            {
                return TypedResults.NotFound();
            }

            // Delete associated documents
            if (note.Attachments != null)
            {
                foreach (var attachment in note.Attachments)
                {
                    await blobService.DeleteFileAsync(attachment.BlobName);
                }
            }

            await repository.DeleteNoteAsync(noteId);

            return TypedResults.NoContent();
        }

        public static async Task<IResult> SearchNotes(
            NotesRepository repository, 
            string query, 
            int? skip = null, 
            int? batchSize = null)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return TypedResults.BadRequest("Search query is required");
            }

            return TypedResults.Ok(await repository.SearchNotesAsync(query, skip, batchSize));
        }

        public static async Task<IResult> UploadDocument(
            NotesRepository repository,
            BlobStorageService blobService,
            string noteId,
            HttpRequest request)
        {
            var note = await repository.GetNoteAsync(noteId);
            if (note == null)
            {
                return TypedResults.NotFound();
            }

            if (!request.HasFormContentType)
            {
                return TypedResults.BadRequest("Request must be multipart/form-data");
            }

            var form = await request.ReadFormAsync();
            var file = form.Files.FirstOrDefault();
            
            if (file == null || file.Length == 0)
            {
                return TypedResults.BadRequest("No file uploaded");
            }

            using var stream = file.OpenReadStream();
            var blobName = await blobService.UploadFileAsync(stream, file.FileName, file.ContentType);

            var attachment = new DocumentAttachment
            {
                FileName = file.FileName,
                ContentType = file.ContentType,
                FileSize = file.Length,
                BlobName = blobName
            };

            note.Attachments ??= new List<DocumentAttachment>();
            note.Attachments.Add(attachment);
            note.UpdatedDate = DateTimeOffset.UtcNow;

            await repository.UpdateNote(note);

            return TypedResults.Created($"/notes/{noteId}/documents/{attachment.Id}", attachment);
        }

        public static async Task<IResult> DownloadDocument(
            NotesRepository repository,
            BlobStorageService blobService,
            string noteId,
            string documentId)
        {
            var note = await repository.GetNoteAsync(noteId);
            if (note == null)
            {
                return TypedResults.NotFound();
            }

            var attachment = note.Attachments?.FirstOrDefault(a => a.Id == documentId);
            if (attachment == null)
            {
                return TypedResults.NotFound();
            }

            var stream = await blobService.DownloadFileAsync(attachment.BlobName);
            
            return TypedResults.File(stream, attachment.ContentType, attachment.FileName);
        }

        public static async Task<IResult> DeleteDocument(
            NotesRepository repository,
            BlobStorageService blobService,
            string noteId,
            string documentId)
        {
            var note = await repository.GetNoteAsync(noteId);
            if (note == null)
            {
                return TypedResults.NotFound();
            }

            var attachment = note.Attachments?.FirstOrDefault(a => a.Id == documentId);
            if (attachment == null)
            {
                return TypedResults.NotFound();
            }

            await blobService.DeleteFileAsync(attachment.BlobName);
            note.Attachments?.Remove(attachment);
            note.UpdatedDate = DateTimeOffset.UtcNow;

            await repository.UpdateNote(note);

            return TypedResults.NoContent();
        }
    }

    public record CreateUpdateNote(
        string title, 
        string? content = null, 
        Dictionary<string, string>? tags = null);
}


