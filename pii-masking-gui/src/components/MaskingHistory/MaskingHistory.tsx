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

    // Function to calculate color based on score
    const getColorFromScore = (score: number) => {
        // Ensure score is within the range of 0 to 1
        score = Math.max(0, Math.min(1, score));
        // Calculate the color based on the score
        const r = Math.floor(255 * (1 - score));
        const g = Math.floor(255 * score);
        const b = 0;
        // Return the color as a CSS string
        return `rgba(${r}, ${g}, ${b}, 0.7)`;
    };

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

    // TODO: find manual masking entities & avoid collisions with ner entities
    const renderInputTextWithEntities = (maskingInst: MaskingInstance) => {
        // for each entity, store indexes of all instances of the entity in input string
        const entity_loc:{[key:number]: Entity} = {}
        maskingInst.entities.forEach(entity => {
            let start_index = 0;
            let index: number;
            while ((index = maskingInst.input.indexOf(entity.word, start_index)) !== -1) {
                entity_loc[index] = entity;
                start_index = index + entity.word.length;
            }
        })

        // Iterate through the input string
        let renderedText: JSX.Element[] = [];
        let startSeg = 0;
        for (let i = 0; i < maskingInst.input.length; i++) {
            if (entity_loc.hasOwnProperty(i)){
                // Push the previous segment (non entity) as rendered text
                renderedText.push(
                    <span>{maskingInst.input.substring(startSeg, i-1)}</span>
                )

                // Push the current segment (entity) as button
                const buttonColor = getColorFromScore(entity_loc[i].score);
                console.log(buttonColor);

                renderedText.push(
                    <Button variant="outlined" sx={{ mx:1 }} style={{ color: 'black', backgroundColor: buttonColor, textShadow: '0 0 2px white' }}>
                        {entity_loc[i].word}: {entity_loc[i].entity_group}
                    </Button>
                )

                // Increment index counter by the entity length
                startSeg = i + entity_loc[i].word.length;
                i = startSeg;
            }
        }

        // Push the last segment (non entity) as rendered text
        renderedText.push(
            <span>{maskingInst.input.substring(startSeg, maskingInst.input.length)}</span>
        )

        return renderedText;
    }

    // TODO: find manual masking entities & avoid collisions with ner entities
    const renderOutputTextWithEntities = (maskingInst: MaskingInstance) => {
        // for each entity, store indexes of all instances of the entity in input string
        const entity_loc:{[key:number]: Entity} = {}
        maskingInst.entities.forEach(entity => {
            let start_index = 0;
            let index: number;
            while ((index = maskingInst.output.indexOf(entity.masked_to, start_index)) !== -1) {
                entity_loc[index] = entity;
                start_index = index + entity.masked_to.length;
            }
        })

        // Iterate through the input string
        let renderedText: JSX.Element[] = [];
        let startSeg = 0;
        for (let i = 0; i < maskingInst.output.length; i++) {
            if (entity_loc.hasOwnProperty(i)){
                // Push the previous segment (non entity) as rendered text
                renderedText.push(
                    <span>{maskingInst.output.substring(startSeg, i-1)}</span>
                )

                // Push the current segment (entity) as button
                const buttonColor = getColorFromScore(entity_loc[i].score);
                console.log(buttonColor);

                renderedText.push(
                    <Button variant="outlined" sx={{ mx:1 }} style={{ color: 'black', backgroundColor: buttonColor, textShadow: '0 0 2px white' }}>
                        {entity_loc[i].masked_to}: {entity_loc[i].entity_group}
                    </Button>
                )

                // Increment index counter by the entity length
                startSeg = i + entity_loc[i].masked_to.length;
                i = startSeg;
            }
        }

        // Push the last segment (non entity) as rendered text
        renderedText.push(
            <span>{maskingInst.output.substring(startSeg, maskingInst.output.length)}</span>
        )

        return renderedText;
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
                                    {/* {
                                        selectedMaskingInstance?.output
                                    } */}
                                    {selectedMaskingInstance && renderOutputTextWithEntities(selectedMaskingInstance)}
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
