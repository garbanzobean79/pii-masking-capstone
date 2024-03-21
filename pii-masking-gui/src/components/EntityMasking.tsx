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
import Checkbox from '@mui/material/Checkbox';
import { useState, ChangeEvent, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import React from "react";

interface Props{
    Checked: boolean;
    setChecked: (value: boolean) => void;
    Name: boolean;
    setName: (value: boolean) => void;
    City: boolean;
    setCity: (value: boolean) => void;
    Date: boolean;
    setDate: (value: boolean) => void;
    Email: boolean;
    setEmail: (value: boolean) => void;
    SSN: boolean;
    setSSN: (value: boolean) => void;
    Company: boolean;
    setCompany: (value: boolean) => void;
    Currency: boolean;
    setCurrency: (value: boolean) => void;
    setDisabled1: (value: boolean) => void;
    setMasked: (value: string) => void;
    setLoading: (value: boolean) => void;
    setMaskedEntities: (value: string[][]) => void;
}

function EntityMasking({setChecked, Name, setName, City, setCity, Date, setDate, 
    Email, setEmail, SSN, setSSN, Company, setCompany, Currency, setCurrency, setDisabled1, Checked, setMasked, setMaskedEntities, setLoading}: Props){
    const [error, setError] = useState<String>('');
    const [Text, setText] = useState("");
    const masked_entity: string[][]= []

    const navigate = useNavigate();

    async function submitText(Mask_Level: string[]) {
        setLoading(true);
        try{
            const response= await fetch(`http://127.0.0.1:8000/mask-text?text=${encodeURIComponent(Text)}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem("jwtToken")}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Mask_Level)
            });

            if(!response.ok){
                throw new Error('Failed to mask text');

            }
            const data= await response.json();
            console.log(data);
            console.log("fetched data", data.masker.masked_sentence);
            setMasked(data.masker.masked_sentence);
            masked_entity.splice(0);
            let Array_length= (data.entity_mask.original).length;
            console.log(data.entity_mask);
            console.log(Array_length);
            for(let i=0; i< Array_length; i++){
                console.log("Input:", data.entity_mask.original);
                console.log("Output:", data.entity_mask.masked);
                masked_entity.push([
                    data.entity_mask.original,
                    data.entity_mask.masked
                ]);
            }
            console.log(masked_entity);
            setMaskedEntities([...masked_entity]);

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

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        let Entity: boolean[] = [Name, City, Date, Email, SSN, Company, Currency];
        let Mask_Level: string[]= [];
        if (Checked) {
            if (Name) {
                Mask_Level.push("FIRSTNAME");
                Mask_Level.push("LASTNAME");
                Mask_Level.push("MIDDLENAME");
            }
            if (City) {
                Mask_Level.push("CITY");
            }
            if (Date) {
                Mask_Level.push("DATE");
            }
            if (Email) {
                Mask_Level.push("EMAIL");
            }
            if (SSN) {
                Mask_Level.push("SSN");
            }
            if (Company) {
                Mask_Level.push("COMPANY");
            }
            if (Currency) {
                Mask_Level.push("CURRENCY");
            }
        } else {
            // Push all levels to Mask_Level
            Mask_Level.push("FIRSTNAME");
            Mask_Level.push("LASTNAME");
            Mask_Level.push("MIDDLENAME");
            Mask_Level.push("CITY");
            Mask_Level.push("DATE");
            Mask_Level.push("EMAIL");
            Mask_Level.push("SSN");
            Mask_Level.push("COMPANY");
            Mask_Level.push("CURRENCY");
        }
        console.log(Mask_Level);
        submitText(Mask_Level);
        setDisabled1(false);
        setLoading(false);
    };

    return(
        <>
            <Accordion sx={{ margin: '50px'}}>
            <AccordionSummary  
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header">
                <Typography>Select Entities to Mask</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Container maxWidth="md">
                <form method="post" onSubmit={handleSubmit}>
                    <Container>
                    <TextField fullWidth
                        id="standard-multiline-static"
                        multiline
                        rows={10}
                        margin="normal"
                        placeholder="Enter text here"
                        variant="filled"
                        onChange={(e) => {setText(e.target.value)}}
                    />
                    </Container>
                    <Container sx={{ margin: '20px'}}>
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Level of Masking</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    defaultValue= "Default"
                                >
                                    <FormControlLabel value="Default" defaultChecked= {true} control={<Radio />} label="Default" onClick={() => setChecked(false)}/>
                                    <FormControlLabel value="Custom" control={<Radio />} label="Custom" onClick={() =>  setChecked(true)}/>
                                </RadioGroup>
                        </FormControl>
                        { Checked &&
                        <FormGroup row>
                            <FormControlLabel control={<Checkbox onChange={(e) => {setName(e.target.checked)}}/>} label="Name"/>
                            <FormControlLabel control={<Checkbox onChange={(e) => {setCity(e.target.checked)}}/>} label="City"/>
                            <FormControlLabel control={<Checkbox onChange={(e) => {setCompany(e.target.checked)}}/>} label="Company Name"/>
                            <FormControlLabel control={<Checkbox onChange={(e) => {setCurrency(e.target.checked)}}/>} label="Currency"/>
                            <FormControlLabel control={<Checkbox onChange={(e) => {setDate(e.target.checked)}}/>} label="Date" />
                            <FormControlLabel control={<Checkbox onChange={(e) => {setEmail(e.target.checked)}}/>} label="Email"/>
                            <FormControlLabel control={<Checkbox onChange={(e) => {setSSN(e.target.checked)}}/>} label="SSN"/>
                        </FormGroup>
                        }
                    </Container>
                        <Button variant= "outlined" type= "submit" onClick={() => handleSubmit} sx={{ margin: '20px'}}>Submit</Button>
                </form>
                </Container>
            </AccordionDetails>
        </Accordion>
        </>
    );

}

export default EntityMasking;
