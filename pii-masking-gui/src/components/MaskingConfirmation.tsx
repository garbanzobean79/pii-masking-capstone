import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import MaskingResults from './MaskingResults';
import MaskedEntities from './MaskedEntities';
import React from "react";

import { Link, useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import { useState, ChangeEvent} from "react";

import { Container } from '@mui/material';

interface Props{
    disabled1: boolean;
    Entity: boolean[];
    setDisabled2: (value: boolean) => void;
    Masked: string;
    Masked_Entities: string[][];
    setOutput: (value: string) => void;
}

function MaskingConfirmation({disabled1, setDisabled2, Entity, Masked, Masked_Entities, setOutput}: Props){
    const [error, setError]= useState("");
    const [NewType, setType]= useState("");
    const [NewEntity, setNew]= useState("");
    const [add, setAdd]= useState(false);

    const Entities: string [] = []

    const runModel= async() => {
        try{
            const response= await fetch('http://127.0.0.1:8000/run-model', {
                method: 'POST',
                headers: {
                    'accept': 'application/json'
                }
            });
        
        if(!response.ok){
            throw new Error('Failed to mask text');

        }
        const data= await response.json();
        console.log(data);
        console.log("fetched data", data.Response_Message);
        setOutput(data.Response_Message);
    }
        catch(error:any){
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error has occured.");
            }
            console.log(error);
        }
    };

    const reMask= async() => {
        const requestOptions = {
            method: "POST",
                headers: {"Content-Type": "application/json"},
            body: JSON.stringify({text: Text})

        };
        const response= await fetch("http://127.0.0.1:8000/mask-text", requestOptions);
        const data= await response.json();

        if(!response.ok){
            setError(data.detail);
        }
        else{
            console.log(data);
        }
    };

    const handleSubmit2 = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        runModel();
        setDisabled2(false);
    };

    const addEntity = () => {
        Entities.push(NewEntity);
        setNew("");
    };

    return(
        <>
            <Accordion disabled={disabled1} sx={{ margin: '50px'}}>
                <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header">
                    <Typography>Confirm Masking</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Container sx={{display: 'flex', flexDirection: 'row', gap: '5%'}}>
                    <MaskingResults Masked= {Masked}/>
                    <MaskedEntities masked_entities={Masked_Entities}/>
                    </Container>
                    <Container  sx={{ marginTop: "20px"}}>
                        <Typography sx= {{marginTop: '10px'}}>Did we miss an entity?</Typography>
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: '2%', margin: '20px'}}>
                        <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                sx={{display:"flex", justifyContent: "center", alignItems: "center"}}
                            >
                                <FormControlLabel value="Add" control={<Radio />} label="Class" onClick={() => setAdd(true)}/>
                        </RadioGroup>
                        <Box sx={{ minWidth: 500 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Entity Type</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={NewType}
                                label="Entity Type"
                                onChange={addEntity}
                                >
                                { Entity[0] &&
                                <MenuItem value={"Name"} onClick={()=> setType("Name")}>Name</MenuItem> }
                                { Entity[1] &&
                                <MenuItem value={"City"} onClick={()=> setType("City")}>City</MenuItem> }
                                {Entity[2] &&
                                <MenuItem value={"Date"} onClick={()=> setType("Date")}>Date</MenuItem>}
                                {Entity[3] &&
                                <MenuItem value={"Email"} onClick={()=> setType("Email")}>Email</MenuItem>}
                                {Entity[4] &&
                                <MenuItem value={"SSN"} onClick={()=> setType("SSN")}>SSN</MenuItem>}
                                {Entity[5] &&
                                <MenuItem value={"Company"} onClick={()=> setType("Company")}>Company</MenuItem>}
                                {Entity[6] &&
                                <MenuItem value={"Currency"} onClick={()=> setType("Currency")}>Currency</MenuItem>}
                                </Select>
                            </FormControl>
                        </Box>
                        <TextField id="entity" label="Enter text entity" variant="outlined" sx={{ minWidth: 300 }} onChange={(e) => {setNew(e.target.value)}}/>
                        </Box>
                        <Button variant="contained" sx={{ margin: '20px'}} >Add entity</Button>
                        <Button variant="contained" sx={{ margin: '20px'}} >Re Mask</Button>
                    </Container>
                    <Button variant="outlined" onClick={handleSubmit2} sx={{ margin: '50px' }}>Confirm</Button>
                </AccordionDetails>
            </Accordion>            
        </>
    );
}

export default MaskingConfirmation;