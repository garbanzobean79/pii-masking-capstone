import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import React from "react";

interface Props {
    Masked: string;
}

function LLMInput({Masked}: Props){

    return (
        <Container sx={{border: '2px solid #000000', margin: '20px' }}>
            <Typography>Text Sent to LLM</Typography>
            <Typography>{Masked}</Typography>
        </Container>      
    );
}

export default LLMInput;