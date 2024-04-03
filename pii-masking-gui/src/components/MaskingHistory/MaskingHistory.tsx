// import Button from "./Button";
import { Button, Container, Typography } from '@mui/material';
import {Link, useNavigate } from 'react-router-dom';
import {ChangeEvent, useEffect, useState} from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import { SettingsBackupRestoreRounded, SettingsSystemDaydreamTwoTone } from '@mui/icons-material';

import { isTokenExpired } from '../../services/authService';

function MaskingHistory(){
    interface MaskingInstance {
        created_at: string;
        input: string;
        masking_instance_name: string;
        output: string;
        id: string;
        entities: {
          end: number;
          start: number;
          entity_group: string;
          score: number;
          word: string;
          masked_to: string;
        }[];
        manual_masking_entities: any[]; // You can define a proper interface if needed
    }

    const navigate = useNavigate();

    const [signedIn, setSignedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<String>('');
    const [maskingHistory, setMaskingHistory] = useState<MaskingInstance[]>([]);
    const [selectedMaskingInstance, setSelectedMaskingInstance] = useState<MaskingInstance | null>(null);

    const drawerWidth = 240;

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

                console.log("fetched data", fetchedData);

                setMaskingHistory(fetchedData);

                if (maskingHistory != null)
                    console.log("masking_history: ", maskingHistory)
                    setSelectedMaskingInstance(maskingHistory[0]);

                setLoading(false);
            } catch (error: any) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unknown error has occured.");
                }
                
                setLoading(false);
            }
        };

        fetch_masking_history();
    }, []);
    
    useEffect(() => {
        if (maskingHistory !== null && maskingHistory.length > 0) {
            setSelectedMaskingInstance(maskingHistory[0]);
        }
    }, [maskingHistory])

    useEffect(() => {
        console.log("selected masking instance:", selectedMaskingInstance)
    }, [selectedMaskingInstance])

    const renderSideBarItems = () => {
        if (maskingHistory === null) {
            return <Typography>No masking history available.</Typography>;
        } else {
            return maskingHistory.map((item, index) => {
            if (item.hasOwnProperty('masking_instance_name')){
                return (
                    <ListItem key={item.id} disablePadding>
                    <ListItemButton onClick={() => setSelectedMaskingInstance(item)}>
                        <ListItemText 
                            primary={item.masking_instance_name} 
                            secondary={item.id} 
                        />
                    </ListItemButton>
                    </ListItem>
                );
            } else {
                return (
                    <ListItem key={item.id} disablePadding>
                    <ListItemButton onClick={() => setSelectedMaskingInstance(item)}>
                        <ListItemText primary={item.id} />
                    </ListItemButton>
                    </ListItem>
                );
            }
        });
        }
    };

    const renderEntities = () => {
        return (
            <Grid>
                {/* Render entities */}
                {selectedMaskingInstance?.entities && selectedMaskingInstance.entities.length > 0 &&
                    selectedMaskingInstance.entities.map((entity, index) => (
                        <Typography key={index}>
                            {entity.entity_group}: {entity.word} =&#62; {entity?.masked_to}
                        </Typography>
                    ))
                }
                {/* Render manual masking entities */}
                {/* {data.manual_masking_entities && data.manual_masking_entities.length > 0 &&
                    data.manual_masking_entities.map((entity, index) => (
                        <Typography key={index}>
                            {entity.entity_group}: {entity.word}
                        </Typography>
                    ))
                } */}
            </Grid>
        );
    }

    return (
    <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer
        variant="permanent"
        sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <Typography>History</Typography>
                <List>{renderSideBarItems()}</List>
                <Divider />
            </Box>
        </Drawer>
        <Box 
            component="main" 
            sx={{ flexGrow: 1, mx: 20, mt: 10 }}>
            <Grid 
                container 
                spacing={2}
            >
                <Grid item xs={12}>
                    <Typography variant="h3">
                        {selectedMaskingInstance?.masking_instance_name ?? selectedMaskingInstance?.id}
                    </Typography>
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
                                {
                                    (selectedMaskingInstance != null) && selectedMaskingInstance.input
                                }
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4">
                                Output Text
                            </Typography>
                            <Typography variant="body2">
                            {
                                (selectedMaskingInstance != null) && selectedMaskingInstance.output
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
        </Box>
    </Box>
    );
}

export default MaskingHistory;
