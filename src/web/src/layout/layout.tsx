import { FC, ReactElement, useContext, useEffect, useMemo } from 'react';
import Header from './header';
import { Routes, Route } from 'react-router-dom';
import NotesPage from '../pages/notesPage';
import { Stack } from '@fluentui/react';
import { AppContext } from '../models/applicationState';
import { NoteContext } from '../components/todoContext';
import * as noteActions from '../actions/noteActionCreators';
import { NoteActionCreators } from '../actions/noteActionCreators';
import { headerStackStyles, mainStackStyles, rootStackStyles } from '../ux/styles';
import { bindActionCreators } from '../actions/actionCreators';

const Layout: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(NoteContext);
    const actions = useMemo(() => 
        bindActionCreators(noteActions, appContext.dispatch) as unknown as NoteActionCreators,
        [appContext.dispatch]
    );

    // Load initial notes
    useEffect(() => {
        if (!appContext.state.notes) {
            actions.list();
        }
    }, [actions, appContext.state.notes]);

    return (
        <Stack styles={rootStackStyles}>
            <Stack.Item styles={headerStackStyles}>
                <Header></Header>
            </Stack.Item>
            <Stack.Item grow={1} styles={mainStackStyles}>
                <Routes>
                    <Route path="/notes/:noteId" element={<NotesPage />} />
                    <Route path="/notes" element={<NotesPage />} />
                    <Route path="/" element={<NotesPage />} />
                </Routes>
            </Stack.Item>
        </Stack>
    );
}

export default Layout;
