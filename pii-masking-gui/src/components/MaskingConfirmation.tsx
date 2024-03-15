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

import { Link, useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import { useState, ChangeEvent, useContext} from "react";

import {UserContext} from "../context/UserContext";
import { Container } from '@mui/material';

interface Props{
    disabled1: boolean;
    Entity: string;
    setEntity: (value: string) => void;
    setDisabled2: (value: boolean) => void;
}

function MaskingConfirmation({disabled1, setDisabled2, Entity, setEntity}: Props){

    const [Error, setError]= useState("");
    const [, setToken]= useContext(UserContext);

    const submitText= async() => {

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

    const handleSubmit2 = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitText();
        setDisabled2(false);
    };

    const addEntity = () => {

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
                    <Container sx={{ border: '2px solid black'}}>
                        <Typography>Masking Results</Typography>
                    </Container>
                    <Container sx={{ border: '2px solid black'}}>
                        <Typography>Entities</Typography>
                    </Container>
                    <Container  sx={{ border: '2px solid black'}}>
                        <Typography>Did we miss an entity?</Typography>
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={Entity}
                                label="Age"
                                onChange={addEntity}
                                >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Button variant="contained" sx={{ margin: '20px'}} >Add entity</Button>
                    </Container>
                    <Button variant="outlined" onClick={() => handleSubmit2} sx={{ margin: '50px' }}>Confirm</Button>
                </AccordionDetails>
            </Accordion>            
        </>
    );
}

export default MaskingConfirmation;