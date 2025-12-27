import { NoteActions, NoteActionTypes } from '../actions/common';
import { Note } from '../models';

export const notesReducer = (state: Note[] | undefined, action: NoteActions): Note[] | undefined => {
    switch (action.type) {
        case NoteActionTypes.LOAD_NOTES:
        case NoteActionTypes.SEARCH_NOTES:
            return action.payload;
        case NoteActionTypes.SAVE_NOTE:
            if (!state) return [action.payload];
            const existingIndex = state.findIndex(n => n.id === action.payload.id);
            if (existingIndex >= 0) {
                return state.map((note, index) => index === existingIndex ? action.payload : note);
            }
            return [...state, action.payload];
        case NoteActionTypes.DELETE_NOTE:
            return state?.filter(note => note.id !== action.payload);
        default:
            return state;
    }
};


