import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { useState} from "react";
import LLMInput from './LLMInput';
import LLMResult from './LLMResult';
import { Container } from '@mui/material';
import UnMaskedResponse from './UnMaskedResponse';
import React from "react";

interface Props {
    disabled2: boolean;
    Masked: string;
    Output: string;
    expanded: string | false;
    setExpanded: (value: string | false) => void;
    unMasked: string;
}

function LLMOutput({disabled2, Masked, Output, expanded, setExpanded, unMasked}: Props){

    const [error, setError]= useState<String>("");

    const expandPanel= (panel: string) => (event: React.SyntheticEvent, isExpanded:boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <>
            <Accordion sx={{ margin: '50px' }} disabled={disabled2} expanded= {expanded === 'panel3'} onChange={expandPanel('panel3')} >
                <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header">
                    <Typography>LLM Results</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <LLMInput Masked={Masked}/>
                    <LLMResult Output= {Output}/>
                    <UnMaskedResponse unMasked= {unMasked}/>
                </AccordionDetails>
            </Accordion>        
        </>
    );
}

export default LLMOutput;