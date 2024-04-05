import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import React from "react";

interface Props {
    Output: string;
}

function LLMResult({Output}: Props){

    return (
        <Container sx={{margin: '20px', padding: '10px'}}>
        <Typography variant="h6" fontStyle= "italic">Text Received from LLM</Typography>
        <Typography paragraph>{Output}</Typography>
    </Container>
    );
}

export default LLMResult;