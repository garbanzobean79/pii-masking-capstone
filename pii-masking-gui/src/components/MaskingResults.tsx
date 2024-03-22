import Typography from '@mui/material/Typography';
import React from "react";

import { Container } from '@mui/material';

interface Props{
    Masked: string;
}

function MaskingResults({Masked}: Props){

    return(
        <Container sx={{ border: '1px solid black'}}>
            <Typography>Masking Results</Typography>
            <Typography>{Masked}</Typography>
        </Container>
    );
}

export default MaskingResults;