import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { useState} from "react";
import LLMInput from './LLMInput';
import LLMResult from './LLMResult';
import { Container } from '@mui/material';
import React from "react";

interface Props {
    disabled2: boolean;
    Masked: string;
    Output: string;
}

function LLMOutput({disabled2, Masked, Output}: Props){

    const [error, setError]= useState<String>("");

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
                    <LLMInput Masked={Masked}/>
                    <LLMResult Output= {Output}/>
                </AccordionDetails>
            </Accordion>        
        </>
    );
}

export default LLMOutput;