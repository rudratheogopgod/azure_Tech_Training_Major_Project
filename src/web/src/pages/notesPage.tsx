import { useEffect, useContext, useMemo, useState } from 'react';
import { IconButton, IContextualMenuProps, IIconProps, Stack, Text, Shimmer, ShimmerElementType, TextField, PrimaryButton, Panel, PanelType, MessageBar, MessageBarType } from '@fluentui/react';
import { Note, DocumentAttachment } from '../models';
import * as noteActions from '../actions/noteActionCreators';
import { NoteContext } from '../components/todoContext';
import { AppContext } from '../models/applicationState';
import { NoteActionCreators } from '../actions/noteActionCreators';
import { stackItemPadding, stackPadding, titleStackStyles } from '../ux/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators } from '../actions/actionCreators';
import WithApplicationInsights from '../components/telemetryWithAppInsights.tsx';

const NotesPage = () => {
    const navigate = useNavigate();
    const appContext = useContext<AppContext>(NoteContext);
    const { noteId } = useParams();
    const actions = useMemo(() => 
        bindActionCreators(noteActions, appContext.dispatch) as unknown as NoteActionCreators,
        [appContext.dispatch]
    );

    const [isReady, setIsReady] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadMessage, setUploadMessage] = useState<{ type: MessageBarType; text: string } | null>(null);

    useEffect(() => {
        actions.list().then(() => setIsReady(true));
    }, [actions]);

    useEffect(() => {
        if (noteId && appContext.state.selectedNote?.id !== noteId) {
            actions.load(noteId);
        }
    }, [actions, appContext.state.selectedNote, noteId]);

    const onNoteCreated = async (title: string, content?: string) => {
        const newNote: Note = { title, content };
        const saved = await actions.save(newNote);
        navigate(`/notes/${saved.id}`);
        setIsPanelOpen(false);
    };

    const onNoteSelected = (note?: Note) => {
        actions.select(note);
        if (note?.id) {
            navigate(`/notes/${note.id}`);
        }
    };

    const onNoteDeleted = (note: Note) => {
        if (note.id) {
            actions.remove(note.id);
            navigate('/notes');
        }
    };

    const onSearch = async () => {
        if (searchQuery.trim()) {
            await actions.search(searchQuery);
        } else {
            await actions.list();
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile || !appContext.state.selectedNote?.id) return;

        try {
            await actions.uploadDocument(appContext.state.selectedNote.id, selectedFile);
            setUploadMessage({ type: MessageBarType.success, text: 'File uploaded successfully!' });
            setSelectedFile(null);
            setTimeout(() => setUploadMessage(null), 3000);
        } catch (error) {
            setUploadMessage({ type: MessageBarType.error, text: 'Failed to upload file.' });
        }
    };

    const handleDownload = async (noteId: string, documentId: string) => {
        await actions.downloadDocument(noteId, documentId);
    };

    const handleDeleteDocument = async (noteId: string, documentId: string) => {
        await actions.deleteDocument(noteId, documentId);
    };

    const iconProps: IIconProps = {
        iconName: 'More',
        styles: {
            root: { fontSize: 14 }
        }
    };

    const menuProps: IContextualMenuProps = {
        items: [
            {
                key: 'delete',
                text: 'Delete Note',
                iconProps: { iconName: 'Delete' },
                onClick: () => appContext.state.selectedNote && onNoteDeleted(appContext.state.selectedNote)
            }
        ]
    };

    return (
        <Stack>
            <Stack.Item>
                <Stack horizontal styles={titleStackStyles} tokens={stackPadding}>
                    <Stack.Item grow={1}>
                        <TextField
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(_, value) => setSearchQuery(value || '')}
                            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                            styles={{ root: { maxWidth: 400 } }}
                        />
                        <PrimaryButton text="Search" onClick={onSearch} styles={{ root: { marginLeft: 10 } }} />
                        <PrimaryButton text="New Note" onClick={() => setIsPanelOpen(true)} styles={{ root: { marginLeft: 10 } }} />
                    </Stack.Item>
                    {appContext.state.selectedNote && (
                        <Stack.Item>
                            <IconButton
                                disabled={!isReady}
                                menuProps={menuProps}
                                iconProps={iconProps}
                                styles={{ root: { fontSize: 16 } }}
                                title="Note Actions"
                                ariaLabel="Note Actions" />
                        </Stack.Item>
                    )}
                </Stack>
            </Stack.Item>
            <Stack.Item tokens={stackItemPadding}>
                <Stack horizontal>
                    <Stack.Item grow={1} styles={{ root: { maxWidth: 300, marginRight: 20 } }}>
                        <Stack>
                            {appContext.state.notes?.map(note => (
                                <Stack.Item key={note.id} styles={{ root: { marginBottom: 10, padding: 10, cursor: 'pointer', backgroundColor: appContext.state.selectedNote?.id === note.id ? '#0078d4' : 'transparent' } }} onClick={() => onNoteSelected(note)}>
                                    <Text variant="medium" styles={{ root: { fontWeight: 'bold' } }}>{note.title}</Text>
                                    <Text variant="small" styles={{ root: { color: '#666' } }}>{note.content?.substring(0, 50)}...</Text>
                                </Stack.Item>
                            ))}
                        </Stack>
                    </Stack.Item>
                    <Stack.Item grow={2}>
                        <Shimmer width={600}
                            isDataLoaded={!!appContext.state.selectedNote}
                            shimmerElements={[{ type: 'line', height: 20 }]}>
                            {appContext.state.selectedNote && (
                                <Stack>
                                    <Text variant="xxLarge">{appContext.state.selectedNote.title}</Text>
                                    <Text variant="medium" styles={{ root: { marginTop: 20, whiteSpace: 'pre-wrap' } }}>
                                        {appContext.state.selectedNote.content}
                                    </Text>
                                    {uploadMessage && (
                                        <MessageBar messageBarType={uploadMessage.type} styles={{ root: { marginTop: 20 } }}>
                                            {uploadMessage.text}
                                        </MessageBar>
                                    )}
                                    <Stack.Item styles={{ root: { marginTop: 20 } }}>
                                        <Text variant="medium" styles={{ root: { fontWeight: 'bold' } }}>Attachments</Text>
                                        <input type="file" onChange={handleFileSelect} style={{ marginTop: 10 }} />
                                        {selectedFile && (
                                            <PrimaryButton text="Upload" onClick={handleFileUpload} styles={{ root: { marginTop: 10 } }} />
                                        )}
                                        {appContext.state.selectedNote.attachments?.map(attachment => (
                                            <Stack key={attachment.id} horizontal styles={{ root: { marginTop: 10, padding: 10, backgroundColor: '#f3f2f1' } }}>
                                                <Stack.Item grow={1}>
                                                    <Text>{attachment.fileName}</Text>
                                                    <Text variant="small" styles={{ root: { color: '#666' } }}>
                                                        {(attachment.fileSize / 1024).toFixed(2)} KB
                                                    </Text>
                                                </Stack.Item>
                                                <Stack.Item>
                                                    <IconButton iconProps={{ iconName: 'Download' }} onClick={() => handleDownload(appContext.state.selectedNote!.id!, attachment.id)} />
                                                    <IconButton iconProps={{ iconName: 'Delete' }} onClick={() => handleDeleteDocument(appContext.state.selectedNote!.id!, attachment.id)} />
                                                </Stack.Item>
                                            </Stack>
                                        ))}
                                    </Stack.Item>
                                </Stack>
                            )}
                        </Shimmer>
                    </Stack.Item>
                </Stack>
            </Stack.Item>
            <Panel
                isOpen={isPanelOpen}
                type={PanelType.medium}
                onDismiss={() => setIsPanelOpen(false)}
                headerText="Create New Note"
                closeButtonAriaLabel="Close">
                <CreateNoteForm onSave={onNoteCreated} />
            </Panel>
        </Stack>
    );
};

const CreateNoteForm = ({ onSave }: { onSave: (title: string, content?: string) => void }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    return (
        <Stack tokens={{ childrenGap: 20 }}>
            <TextField label="Title" value={title} onChange={(_, value) => setTitle(value || '')} required />
            <TextField label="Content" multiline rows={10} value={content} onChange={(_, value) => setContent(value || '')} />
            <PrimaryButton text="Save" onClick={() => onSave(title, content)} disabled={!title.trim()} />
        </Stack>
    );
};

const NotesPageWithTelemetry = WithApplicationInsights(NotesPage, 'NotesPage');

export default NotesPageWithTelemetry;

