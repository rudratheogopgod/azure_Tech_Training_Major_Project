import { NoteActions, NoteActionTypes } from '../actions/common';
import { Note } from '../models';

export const selectedNoteReducer = (state: Note | undefined, action: NoteActions): Note | undefined => {
    switch (action.type) {
        case NoteActionTypes.SELECT_NOTE:
            return action.payload;
        case NoteActionTypes.LOAD_NOTE:
        case NoteActionTypes.SAVE_NOTE:
            return action.payload;
        case NoteActionTypes.DELETE_NOTE:
            return state?.id === action.payload ? undefined : state;
        default:
            return state;
    }
};


