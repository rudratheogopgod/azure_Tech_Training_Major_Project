import { Dispatch } from "react";
import { Note } from "../models";
import { NoteService } from "../services/noteService";
import { NoteActionTypes, NoteActions } from "./common";
import config from "../config"
import { trackEvent } from "../services/telemetryService";
import { ActionMethod, createPayloadAction, PayloadAction } from "./actionCreators";

const noteService = new NoteService(config.api.baseUrl);

export interface NoteActionCreators {
    list(options?: { skip?: number; batchSize?: number }): Promise<Note[]>
    load(id: string): Promise<Note>
    select(note: Note | undefined): Promise<Note | undefined>
    save(note: Note): Promise<Note>
    remove(id: string): Promise<void>
    search(query: string): Promise<Note[]>
    uploadDocument(noteId: string, file: File): Promise<Note>
    downloadDocument(noteId: string, documentId: string): Promise<void>
    deleteDocument(noteId: string, documentId: string): Promise<void>
}

export const list = (options?: { skip?: number; batchSize?: number }): ActionMethod<Note[]> => async (dispatch: Dispatch<NoteActions>) => {
    const notes = await noteService.getList(options);

    dispatch(loadNotesAction(notes));

    return notes;
}

export const select = (note: Note | undefined): ActionMethod<Note | undefined> => (dispatch: Dispatch<NoteActions>) => {
    dispatch(selectNoteAction(note));

    return Promise.resolve(note);
}

export const load = (id: string): ActionMethod<Note> => async (dispatch: Dispatch<NoteActions>) => {
    const note = await noteService.get(id);

    dispatch(loadNoteAction(note));

    return note;
}

export const save = (note: Note): ActionMethod<Note> => async (dispatch: Dispatch<NoteActions>) => {
    const newNote = await noteService.save(note);

    dispatch(saveNoteAction(newNote));

    trackEvent(NoteActionTypes.SAVE_NOTE.toString());

    return newNote;
}

export const remove = (id: string): ActionMethod<void> => async (dispatch: Dispatch<NoteActions>) => {
    await noteService.delete(id);

    dispatch(deleteNoteAction(id));
}

export const search = (query: string): ActionMethod<Note[]> => async (dispatch: Dispatch<NoteActions>) => {
    const notes = await noteService.searchNotes(query);

    dispatch(searchNotesAction(notes));

    return notes;
}

export const uploadDocument = (noteId: string, file: File): ActionMethod<Note> => async (dispatch: Dispatch<NoteActions>) => {
    const updatedNote = await noteService.uploadDocument(noteId, file);

    dispatch(saveNoteAction(updatedNote));

    trackEvent('UPLOAD_DOCUMENT');

    return updatedNote;
}

export const downloadDocument = (noteId: string, documentId: string): ActionMethod<void> => async () => {
    const blob = await noteService.downloadDocument(noteId, documentId);
    const note = await noteService.get(noteId);
    const attachment = note.attachments?.find(a => a.id === documentId);
    
    if (attachment) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = attachment.fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    trackEvent('DOWNLOAD_DOCUMENT');
}

export const deleteDocument = (noteId: string, documentId: string): ActionMethod<void> => async (dispatch: Dispatch<NoteActions>) => {
    await noteService.deleteDocument(noteId, documentId);
    const updatedNote = await noteService.get(noteId);
    dispatch(saveNoteAction(updatedNote));

    trackEvent('DELETE_DOCUMENT');
}

const loadNotesAction = createPayloadAction<LoadNotesAction>(NoteActionTypes.LOAD_NOTES);
const loadNoteAction = createPayloadAction<LoadNoteAction>(NoteActionTypes.LOAD_NOTE);
const selectNoteAction = createPayloadAction<SelectNoteAction>(NoteActionTypes.SELECT_NOTE);
const saveNoteAction = createPayloadAction<SaveNoteAction>(NoteActionTypes.SAVE_NOTE);
const deleteNoteAction = createPayloadAction<DeleteNoteAction>(NoteActionTypes.DELETE_NOTE);
const searchNotesAction = createPayloadAction<SearchNotesAction>(NoteActionTypes.SEARCH_NOTES);

interface LoadNotesAction extends PayloadAction<NoteActionTypes.LOAD_NOTES, Note[]> {}
interface LoadNoteAction extends PayloadAction<NoteActionTypes.LOAD_NOTE, Note> {}
interface SelectNoteAction extends PayloadAction<NoteActionTypes.SELECT_NOTE, Note | undefined> {}
interface SaveNoteAction extends PayloadAction<NoteActionTypes.SAVE_NOTE, Note> {}
interface DeleteNoteAction extends PayloadAction<NoteActionTypes.DELETE_NOTE, string> {}
interface SearchNotesAction extends PayloadAction<NoteActionTypes.SEARCH_NOTES, Note[]> {}

