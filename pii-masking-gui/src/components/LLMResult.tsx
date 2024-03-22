import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import React from "react";

interface Props {
    Output: string;
}

function LLMResult({Output}: Props){

    return (
        <Container sx={{border: '2px solid #000000', margin: '20px' }}>
        <Typography>Text Received from LLM</Typography>
        <Typography>{Output}</Typography>
    </Container>
    );
}

export default LLMResult;