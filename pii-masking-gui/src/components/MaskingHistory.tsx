// import Button from "./Button";
import { Button, Container, Typography } from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';
import {ChangeEvent, useEffect, useState} from "react";

function MaskingHistory(){

    const navigate = useNavigate();

    const [signedIn, setSignedIn] = useState(false);

    useEffect(() => {
        // Function to run when the component is loaded
        console.log('Component loaded');
    
        // Check if the user is signed in
        if (localStorage.getItem("jwtToken") == null) {
            navigate('/sign-in');
        } else {
            console.log("signed in with token:" + localStorage.getItem("jwtToken"));
        }


      }, []); // Empty dependency array ensures this runs only once on component mount
    
    return (
        <>
            <Container maxWidth="md">
                <Typography variant="h5">Masking History</Typography>
                <Button variant="contained">Next</Button>
            </Container>
        </>
    );
}

export default MaskingHistory;
