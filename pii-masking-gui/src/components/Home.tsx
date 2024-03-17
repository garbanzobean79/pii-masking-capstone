// import Button from "./Button";
import { Button, Container, Typography } from '@mui/material';
import  {Link, useNavigate} from 'react-router-dom';
import {ChangeEvent, useEffect, useState} from "react";
import NavBar from './NavBar';

function Home(){

    const [signedIn, setSignedIn] = useState(false);

    useEffect(() => {
        // Function to run when the component is loaded
        console.log('Component loaded');
    
        // You can perform any initialization logic or API calls here
      }, []); // Empty dependency array ensures this runs only once on component mount
    
    return (
        <>
            
            <Container maxWidth="md">
                <Typography variant="h5" >PII Masking Capstone</Typography>
                <Typography paragraph>App description</Typography>
            </Container>
        </>
    );
}

export default Home;
