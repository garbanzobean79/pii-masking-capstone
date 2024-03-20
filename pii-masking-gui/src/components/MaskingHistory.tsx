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
import { SettingsBackupRestoreRounded, SettingsSystemDaydreamTwoTone } from '@mui/icons-material';

import { isTokenExpired } from '../services/authService';

function MaskingHistory(){
    interface MaskingInstance {
        created_at: Date;
        input: string;
        entities: Entity[];
        output: string;
        id: string;
    }
    
    interface Entity {
        end: number;
        entity_group: string;
        start: number;
        score: number;
        word: string;
    }

    const navigate = useNavigate();

    const [signedIn, setSignedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<String>('');
    const [maskingHistory, setMaskingHistory] = useState<Array<MaskingInstance> | null>(null);
    const [selectedMaskingInstance, setSelectedMaskingInstance] = useState<MaskingInstance | null>(null);

    const drawerWidth = 240;

    // TODO: replace with guarded route
    useEffect(() => {
        // Function to run when the component is loaded
        console.log('Component loaded');
    
        // Check if the user is signed in'
        console.log(`jwt: ${sessionStorage.getItem("jwtToken")}`)
        if (sessionStorage.getItem("jwtToken") == null) {
            navigate('/sign-in');
        } else {
            console.log("token in local storage: " + sessionStorage.getItem("jwtToken"));
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
        console.log("maskingHistory", maskingHistory);
    }, []); // Empty dependency array ensures this runs only once on component mount
    
    // select the intial masking instance
    useEffect(() => {
        if (maskingHistory !== null && maskingHistory.length > 0) {
            console.log(`selecting ${maskingHistory[0]} as default masking instance`);
            setSelectedMaskingInstance(maskingHistory[0]);
        }
    }, [maskingHistory])

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
            <List>
            {maskingHistory === null ? (
                <Typography>No masking history available.</Typography>
                ) : (
                    maskingHistory.map((item, index) => (
                    <ListItem key={item.id} disablePadding>
                        <ListItemButton>
                        {/* <ListItemIcon>
                            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                        </ListItemIcon> */}
                        <ListItemText primary={item.id} />
                        </ListItemButton>
                    </ListItem>
                    ))
                )}
            </List>
            <Divider />
        </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography component='h1' variant='h4'>
            Masking History
        </Typography>
        <Typography component='p'>
            Input:
            {
                selectedMaskingInstance?.input
            }
        </Typography>
        <Typography paragraph>
            Output:
            {
                selectedMaskingInstance?.output
            }
        </Typography>
        </Box>
    </Box>
    );
}

export default MaskingHistory;
