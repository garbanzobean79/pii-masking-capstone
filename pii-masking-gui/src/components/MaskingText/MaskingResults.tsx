import Typography from '@mui/material/Typography';
import React from "react";

import { Container } from '@mui/material';

interface Props{
    Masked: string;
}

function MaskingResults({Masked}: Props){

    return(
        <Container sx={{ border: '1px solid black'}}>
            <Typography variant= "h6" fontStyle= "italic" sx={{margin: '10px'}}>Masking Results</Typography>
            <Typography sx={{marginBottom: '10px'}}>{Masked}</Typography>
        </Container>
    );
}

export default MaskingResults;