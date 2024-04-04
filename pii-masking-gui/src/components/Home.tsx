// import Button from "./Button";
import { Button, Container, Typography } from '@mui/material';
import  {Link, useNavigate} from 'react-router-dom';
import {ChangeEvent, useEffect, useState} from "react";
import NavBar from './NavBar';
import { isTokenExpired } from '../services/authService';

function Home(){

    const navigate = useNavigate();

    useEffect(() => {
        // Function to run when the component is loaded
        console.log('Component loaded');
    
        // You can perform any initialization logic or API calls here
      }, []); // Empty dependency array ensures this runs only once on component mount
    
      const checkSignIn = () => {
        if(isTokenExpired(sessionStorage.getItem("jwtToken"))){
            navigate('/sign-in');
        }
        else{
            navigate('/masking-text');
        }
      }

    return (
        <>
            
            <Container maxWidth="md" sx={{display: 'flex', flexDirection: 'row', marginTop: '7%', marginBottom: '7%', gap: '10%', justifyContent: 'center', alignItems: 'center'}}>
                <Container>
                    <img src= "src/images/customer-avatar-identification.jpg" width={400}/>
                </Container>
                <Container sx={{padding: '20px'}}>
                    <Typography paragraph>
                        Anonymize inquiries using a natural language processor model
                    </Typography>    
                    <Typography paragraph>
                        Asks ChatGPT the processed inquiry and displays response
                    </Typography>
                    <Typography paragraph>
                        User can customize how anonymous their inquiries can be
                    </Typography>
                    <Typography paragraph>
                        Past inquiries are stored and be viewed in Masking History
                    </Typography>
                </Container>
            </Container>
            <Container sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Button variant= "contained" onClick={checkSignIn}>Try it Out</Button>
            </Container>
        </>
    );
}

export default Home;
