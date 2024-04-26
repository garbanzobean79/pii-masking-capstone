import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React from "react";
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useState} from "react";
import { Container } from '@mui/material';

interface Props{
    masked_entities: string[][];
    isVisible: boolean;
    Title: string;
    setET: (value: string[][]) => void;
    setMaskedEntities: (value: string[][]) => void;
    id: string;
    MaskedTypes: string[];
    setMasked: (value: string) => void;
    setMaskedTypes: (value: string[]) => void;
}

function Entities({masked_entities, isVisible, Title, setET, setMaskedEntities, id, MaskedTypes, setMasked, setMaskedTypes}: Props){
    const masked_entity: string[][]= [];
    const masked_type: string[]= [];
    const [error, setError]= useState("");

    async function removeEntity (entity: string[], type: string) {
        try{
            console.log("Entities to remove: " + entity + " Type: " + type);
            const word= [entity[1]];
            const type_of_entity= [type];
            const req_body = JSON.stringify({
                masking_instance_id: id,
                word: word, 
                entity: type_of_entity
            })
            console.log(req_body);
            const response= await fetch('http://127.0.0.1:8000/manual-unmask', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem("jwtToken")}`
                },
                body: req_body
            });
        
            if(!response.ok){
                throw new Error('Failed to unmask');

            }
            const data= await response.json();
            console.log(data);
            setMasked(data[1]);
            masked_entity.splice(0);
            let Array_length= (data[2].original).length;
            for(let i=0; i< Array_length; i++){
                masked_type.push(data[2].type[i]);
                masked_entity.push([
                    data[2].original[i],
                    data[2].masked[i]
                ]);
            }
            setMaskedTypes([...masked_type]);
            setMaskedEntities([...masked_entity]);
        }
        catch(error: any){
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error has occured.");
            }
            console.log(error);
        }
    };

    const removeAddEntities= (index: number) => {
        if(Title === "Entities to Mask"){
            const newEntities= [...masked_entities];
            newEntities.splice(index, 1);
            setET(newEntities);
        }
        else{
            const unmask= [...masked_entities][index];
            console.log("Entity: " + "Index: " + index + " " + unmask)
            console.log(MaskedTypes);
            const type= [...MaskedTypes][index-1];
            console.log("Type: "+ type);
            removeEntity(unmask, type);
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