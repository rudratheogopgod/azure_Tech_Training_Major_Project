import { Reducer } from "react";
import { NoteActions } from "../actions/common";
import { notesReducer } from "./notesReducer";
import { selectedNoteReducer } from "./selectedNoteReducer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const combineReducers = (slices: {[key: string]: Reducer<any, NoteActions>}) => (prevState: any, action: NoteActions) =>
    Object.keys(slices).reduce(
        (nextState, nextProp) => ({
            ...nextState,
            [nextProp]: slices[nextProp](prevState[nextProp], action)
        }),
        prevState
    );

export default combineReducers({
    notes: notesReducer,
    selectedNote: selectedNoteReducer,
});
