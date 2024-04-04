// import Button from "./Button";
import { 
    Button, Box, CircularProgress, Divider, Typography, CssBaseline, IconButton, 
    List, ListItemText, ListItemButton, ListItemSecondaryAction, Grid 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

import DeleteIcon from '@mui/icons-material/Delete';

import { isTokenExpired } from '../../services/authService';

function MaskingHistory(){
    interface MaskingInstance {
        created_at: string;
        input: string;
        masking_instance_name: string;
        output: string;
        id: string;
        entities: Entity[];
        manual_masking_entities: any[]; // You can define a proper interface if needed
    }

    interface Entity {
        end: number;
        start: number;
        entity_group: string;
        score: number;
        word: string;
        masked_to: string;
    }

    const navigate = useNavigate();

    const [signedIn, setSignedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<String>('');
    const [maskingHistory, setMaskingHistory] = useState<MaskingInstance[]>([]);
    const [selectedMaskingInstance, setSelectedMaskingInstance] = useState<MaskingInstance | null>(null);

    // Check if user is signed in and fetch masking history
    useEffect(() => {
        // Function to run when the component is loaded
        console.log('in MaskingHistory.tsx useEffect');
    
        // Check if the user is signed in'
        console.log(`checking if the user is logged in: jwt: ${sessionStorage.getItem("jwtToken")}`)
        
        if (isTokenExpired(sessionStorage.getItem("jwtToken"))) {
            navigate('/sign-in');
        } else {
            console.log("valid token in local storage: " + sessionStorage.getItem("jwtToken"));
        }

        // Fetch masking history
        const fetch_masking_history = async() => {
            try {
                setLoading(true);
                const response = await fetch('http://127.0.0.1:8000/masking-history', {
                    method: "GET",
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem("jwtToken")}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Failed to get masking history.')
                }

                const fetchedData = await response.json();

                setMaskingHistory(fetchedData);

                if (maskingHistory != null)
                    setSelectedMaskingInstance(maskingHistory[0]);
            } catch (error: any) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unknown error has occured.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetch_masking_history();
    }, []);
    
    useEffect(() => {
        console.log("new selectedMaskingInstance: ", selectedMaskingInstance?.id);
    }, [selectedMaskingInstance])

    useEffect(() => {
        if (maskingHistory !== null && maskingHistory.length > 0) {
            setSelectedMaskingInstance(maskingHistory[0]);
        }
    }, [maskingHistory])

    const deleteMaskingInstance = (delete_item: MaskingInstance) => {
        console.log("Deleting the masking instance", delete_item);
    
        const id = delete_item.id; // Assuming item has an 'id' property
    
        fetch(`http://127.0.0.1:8000/masking-instance/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("jwtToken")}`
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete masking instance');
            }
            return response.json();
        })
        .then(data => {
            console.log('Masking instance deleted successfully:', data);

            setMaskingHistory(maskingHistory.filter(item => item !== delete_item));

            if (selectedMaskingInstance == delete_item) {
                setSelectedMaskingInstance(maskingHistory[0]);
            }
        })
        .catch(error => {
            console.error('Error deleting masking instance:', error);
            // Handle errors here, such as displaying an error message to the user
        });
    }

    const renderMaskingHistoryListItems = () => {
        if (maskingHistory === null) {
            return <Typography>No masking history available.</Typography>;
        } else {
            return maskingHistory.map((item, index) => (
                <ListItemButton key={item.id} onClick={() => setSelectedMaskingInstance(item)}>
                    <ListItemText
                        primary={item.hasOwnProperty('masking_instance_name') ? item.masking_instance_name : null} 
                        secondary={item.hasOwnProperty('masking_instance_name') ? item.id : null}
                    />
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteMaskingInstance(item)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItemButton>
            ));
        }
    };

    const renderEntities = () => {
        // Group ner entities by entity_group
        const ner_entities: {[key: string]: any[]} = {};
        selectedMaskingInstance?.entities.forEach(entity => {
            let entity_class = entity.entity_group.toLowerCase();
            entity_class = entity_class.charAt(0).toUpperCase() + entity_class.slice(1);
            if (!ner_entities[entity_class]) {
                ner_entities[entity_class] = []
            }
            ner_entities[entity_class].push(entity);
        });

        return (
            <Grid>
                {/* Render entities */}
                {ner_entities && Object.keys(ner_entities).length > 0 &&
                    Object.entries(ner_entities).map(([entityClass, entities]) => (
                        <Box key={entityClass} sx={{ 'mt': 2 }}>
                            <Typography variant='h6'>
                                {entityClass}
                            </Typography>
                            {/* Render individual entities for this entity class */}
                            {entities.map((entity, index) => (
                                <div key={index}>
                                    {/* Render individual entity details */}
                                    <Typography>
                                        {entity.word} =&#62; {entity?.masked_to}
                                    </Typography>
                                </div>
                            ))}
                        </Box>
                    ))
                }
                {/* Render manual masking entities */}
                {selectedMaskingInstance?.manual_masking_entities && selectedMaskingInstance.manual_masking_entities.length > 0 &&
                    selectedMaskingInstance.manual_masking_entities.map((entity, index) => (
                        <Typography key={index}>
                            {entity.entity_group}: {entity.word} =&#62; {entity?.masked_to}
                        </Typography>
                    ))
                }
            </Grid>
        );
    }

    const renderInputTextWithEntities = (maskingInst: MaskingInstance) => {
        console.log("rerendering input text...")
        // Create word arrays
        // const inputWords = maskingInst?.input.split(/(\s+)|([\p{P}\p{S}])/);
        const inputWords = maskingInst?.input.split(' ');

        const entityMap: {[key: string]: Entity} = {}
        maskingInst?.entities.forEach(entity=> {
            entityMap[entity.word] = entity;
        });

        console.log(entityMap);

        const renderedText = inputWords.map((word, index) => {
            const entity = entityMap[word];

            console.log(word);

            if (entity && entity.word == word) {
                // console.log("entity", entity);
                return (
                    <>
                        <Button key={word} variant="contained" color="primary">
                            {word}:
                            <Typography>
                                {entity.entity_group}
                            </Typography>
                        </Button>
                        {' '}
                    </>
                );
            } else {
                return (
                    <>
                        <span>{word}</span>
                        {' '}
                    </>
                )
            }
        })

        return <>{renderedText}</>;
    }

    return (
    <Grid 
        container 
        spacing={2}
        wrap="nowrap"
        sx = {{
            px: 2
        }}
    >
        {/* Conditional rendering for loading spinner */}
        {loading ? (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Grid>
        ) : (
            <>
            <CssBaseline />
            <Grid item xs={2} sx={{ overflow:'auto' }}>
                <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div" align="center">
                    Masking History
                </Typography>
                <List>
                    {renderMaskingHistoryListItems()}
                </List>
            </Grid>
            <Grid item>
                <Divider variant="middle" orientation="vertical"/>
            </Grid>
            <Grid 
                item
                xs={10}
                component="main" 
                sx={{ flexGrow: 1, mt: 2 }}>
                <Grid 
                    container 
                    spacing={5}
                    // columnSpacing={10}
                    sx = {{ px: 40, pt: 5 }}
                >
                    <Grid item xs={12}>
                        <Typography variant="h3">
                            {selectedMaskingInstance?.masking_instance_name ?? selectedMaskingInstance?.id}
                        </Typography>
                    </Grid>
                    <Grid xs={12} sx={{ mt: 2 }}>
                        <Divider />
                    </Grid>
                    <Grid item xs={8} spacing={8}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            gap={4}
                        >
                            <Box>
                                <Typography variant="h4">
                                    Input Text
                                </Typography>
                                <Typography variant="body2">
                                    {selectedMaskingInstance && renderInputTextWithEntities(selectedMaskingInstance)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="h4">
                                    Output Text
                                </Typography>
                                <Typography variant="body2">
                                    {
                                        selectedMaskingInstance?.output
                                    }
                            </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box>
                            <Typography variant="h4">
                                Entities
                            </Typography>
                            <Grid>
                                {renderEntities()}
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            </>
        )}
    </Grid>
    );
}

export default MaskingHistory;
