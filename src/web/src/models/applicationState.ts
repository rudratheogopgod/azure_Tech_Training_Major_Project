import { Dispatch } from "react";
import { NoteActions } from "../actions/common";
import { Note } from "./note";

export interface AppContext {
    state: ApplicationState
    dispatch: Dispatch<NoteActions>
}

export interface ApplicationState {
    notes?: Note[]
    selectedNote?: Note
}

export const getDefaultState = (): ApplicationState => {
    return {
        notes: undefined,
        selectedNote: undefined
    }
}

