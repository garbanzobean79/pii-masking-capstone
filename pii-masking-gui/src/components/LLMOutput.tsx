import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import EntityMasking from './EntityMasking';
import MaskingConfirmation from './MaskingConfirmation';

import { Link, useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import { useState, ChangeEvent, useContext} from "react";

import {UserContext} from "../context/UserContext";
import { Container } from '@mui/material';

interface Props {
    disabled2: boolean;
}

function LLMOutput({disabled2}: Props){


    const [Error, setError]= useState("");
    const [, setToken]= useContext(UserContext);

    const submitText= async() => {

        const requestOptions = {
            method: "POST",
                headers: {"Content-Type": "application/json"},
            body: JSON.stringify({text: Text})

        };
        const response= await fetch("http://127.0.0.1:8000/mask-text", requestOptions);
        const data= await response.json();

        if(!response.ok){
            setError(data.detail);
        }
        else{
            console.log(data);
        }
    };

    const handleSubmit3 = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitText();
    };

    return (
        <>
            <Accordion sx={{ margin: '50px' }} disabled={disabled2}>
                <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header">
                    <Typography>LLM Results</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Container sx={{border: '2px solid #000000', margin: '20px' }}>
                        <Typography>Text Sent to LLM</Typography>
                    </Container>
                    <Container sx={{border: '2px solid #000000', margin: '20px' }}>
                        <Typography>Text Received from LLM</Typography>
                    </Container>
                    <Button variant= "outlined" onClick={() => handleSubmit3} sx={{ margin: '20px' }}>Submit</Button>
                </AccordionDetails>
            </Accordion>        
        </>
    );
}

export default LLMOutput;