import { Note } from '../models';

export enum NoteActionTypes {
    LOAD_NOTES = "LOAD_NOTES",
    LOAD_NOTE = "LOAD_NOTE",
    SELECT_NOTE = "SELECT_NOTE",
    SAVE_NOTE = "SAVE_NOTE",
    DELETE_NOTE = "DELETE_NOTE",
    SEARCH_NOTES = "SEARCH_NOTES"
}

export interface LoadNotesAction {
    type: NoteActionTypes.LOAD_NOTES;
    payload: Note[];
}

export interface LoadNoteAction {
    type: NoteActionTypes.LOAD_NOTE;
    payload: Note;
}

export interface SelectNoteAction {
    type: NoteActionTypes.SELECT_NOTE;
    payload: Note | undefined;
}

export interface SaveNoteAction {
    type: NoteActionTypes.SAVE_NOTE;
    payload: Note;
}

export interface DeleteNoteAction {
    type: NoteActionTypes.DELETE_NOTE;
    payload: string;
}

export interface SearchNotesAction {
    type: NoteActionTypes.SEARCH_NOTES;
    payload: Note[];
}

export type NoteActions =
    LoadNotesAction |
    LoadNoteAction |
    SelectNoteAction |
    SaveNoteAction |
    DeleteNoteAction |
    SearchNotesAction;


