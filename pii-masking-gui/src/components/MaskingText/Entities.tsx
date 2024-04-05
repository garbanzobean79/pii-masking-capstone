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
    setET: (value: string[][]) => void;
}

function Entities({masked_entities, isVisible, Title, setET}: Props){

    const removeAddEntities= (index: number) => {
        if(Title === "Entities to Mask"){
            const newEntities= [...masked_entities];
            newEntities.splice(index, 1);
            setET(newEntities);
        }
    }

    return(
        <Container sx={{ border: '1px solid black'}}>
            <Typography variant= "h6" fontStyle= "italic" sx={{margin: '10px'}}>{Title}</Typography>
            <Container sx={{marginBottom: '20px'}}>
                { masked_entities.map((value, rowIndex) => (
                    <Container sx= {{display: "flex", flexDirection: "row", alignItems: "center", gap: "5%"}} key={`row-${rowIndex}`}>
                        <Box>
                            <IconButton aria-label="close" size= "small" onClick={() => removeAddEntities(rowIndex)}
                            sx={{display: isVisible ? 'flex' : 'none', border: '1px solid red'}}>
                                <CloseIcon sx={{ fontSize: '10px', color: 'red'}}/>
                            </IconButton>
                        </Box>
                        <Typography key={`row-${rowIndex}`} >
                                {value[0]} -&gt; {value[1]}{" "}
                        </Typography>
                    </Container>
                ))}
            </Container>
        </Container>
    );
}

export default Entities;