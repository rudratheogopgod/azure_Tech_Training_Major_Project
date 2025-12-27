using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;

namespace NotesAzureApp.Api;

public class NotesRepository
{
    private readonly Container _notesCollection;

    public NotesRepository(CosmosClient client, IConfiguration configuration)
    {
        var database = client.GetDatabase(configuration["AZURE_COSMOS_DATABASE_NAME"]);
        _notesCollection = database.GetContainer("Note");
    }

    public async Task<IEnumerable<Note>> GetNotesAsync(int? skip, int? batchSize)
    {
        return await ToListAsync(
            _notesCollection.GetItemLinqQueryable<Note>(),
            skip,
            batchSize);
    }

    public async Task<Note?> GetNoteAsync(string noteId)
    {
        var response = await _notesCollection.ReadItemAsync<Note>(noteId, new PartitionKey(noteId));
        return response?.Resource;
    }

    public async Task DeleteNoteAsync(string noteId)
    {
        await _notesCollection.DeleteItemAsync<Note>(noteId, new PartitionKey(noteId));
    }

    public async Task AddNoteAsync(Note note)
    {
        note.Id = Guid.NewGuid().ToString("N");
        await _notesCollection.UpsertItemAsync(note, new PartitionKey(note.Id));
    }

    public async Task UpdateNote(Note existingNote)
    {
        existingNote.UpdatedDate = DateTimeOffset.UtcNow;
        await _notesCollection.ReplaceItemAsync(existingNote, existingNote.Id, new PartitionKey(existingNote.Id));
    }

    public async Task<IEnumerable<Note>> SearchNotesAsync(string searchTerm, int? skip, int? batchSize)
    {
        var queryable = _notesCollection.GetItemLinqQueryable<Note>()
            .Where(n => n.Title.Contains(searchTerm) || (n.Content != null && n.Content.Contains(searchTerm)));
        
        return await ToListAsync(queryable, skip, batchSize);
    }

    private async Task<List<T>> ToListAsync<T>(IQueryable<T> queryable, int? skip, int? batchSize)
    {
        if (skip != null)
        {
            queryable = queryable.Skip(skip.Value);
        }

        if (batchSize != null)
        {
            queryable = queryable.Take(batchSize.Value);
        }

        using FeedIterator<T> iterator = queryable.ToFeedIterator();
        var items = new List<T>();

        while (iterator.HasMoreResults)
        {
            foreach (var item in await iterator.ReadNextAsync())
            {
                items.Add(item);
            }
        }

        return items;
    }
}


