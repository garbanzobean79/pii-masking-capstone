import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import React from "react";

interface Props {
    unMasked: string;
}

function UnMaskedResponse({unMasked}: Props){

    return (
        <Container sx={{margin: '20px', padding: '10px'}}>
        <Typography variant="h6" fontStyle= "italic">Unmasked Response</Typography>
        <Typography paragraph>{unMasked}</Typography>
    </Container>
    );
}

export default UnMaskedResponse;