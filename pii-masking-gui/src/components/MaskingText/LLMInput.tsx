import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import React from "react";

interface Props {
    Masked: string;
}

function LLMInput({Masked}: Props){

    return (
        <Container sx={{margin: '20px', padding: '10px'}}>
            <Typography variant="h6" fontStyle="italic">Text Sent to LLM</Typography>
            <Typography paragraph>{Masked}</Typography>
        </Container>      
    );
}

export default LLMInput;