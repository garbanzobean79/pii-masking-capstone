import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React from "react";
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { Container } from '@mui/material';

interface Props{
    masked_entities: string[][];
    isVisible: boolean;
    Title: string;
}

function Entities({masked_entities, isVisible, Title}: Props){

    return(
        <Container sx={{ border: '1px solid black'}}>
            <Typography>{Title}</Typography>
            <Container>
                { masked_entities.map((value, rowIndex) => (
                    <Container sx= {{display: "flex", flexDirection: "row", alignItems: "center", gap: "5%"}} key={`row-${rowIndex}`}>
                        <Typography key={`row-${rowIndex}`} >
                                | {value[0]} -&gt; {value[1]}{" "}
                        </Typography>
                        <Box>
                        <IconButton aria-label="close" size= "small"
                        sx={{display: isVisible ? 'flex' : 'none', border: '1px solid red'}}>
                            <CloseIcon sx={{ fontSize: '10px', color: 'red'}}/>
                        </IconButton>
                        </Box>
                    </Container>
                ))}
            </Container>
        </Container>
    );
}

export default Entities;