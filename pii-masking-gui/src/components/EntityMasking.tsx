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
import { useState, ChangeEvent, useContext} from "react";
import Button from '@mui/material/Button';
import {UserContext} from "../context/UserContext";
import { Container } from '@mui/material';

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
}

function EntityMasking({setChecked, Name, setName, City, setCity, Date, setDate, 
    Email, setEmail, SSN, setSSN, Company, setCompany, Currency, setCurrency, setDisabled1, Checked}: Props){
    const [Error, setError] = useState("");
    const [, setToken] = useContext(UserContext);
    const [Text, setText] = useState("");

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

    const submitCategories= async() => {
        const requestOptions = {
            method: "POST",
                header: {"Content-Type": ""},
            body: ''
        };
        const response= 1;
        const data= 1;
    };

    const handleSubmit1 = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitText();
        setDisabled1(false);
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
                <form method="post" onSubmit={handleSubmit1}>
                    <Container>
                    <TextField fullWidth
                        id="standard-multiline-static"
                        multiline
                        rows={10}
                        margin="normal"
                        defaultValue="Enter text here"
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
                                >
                                    <FormControlLabel value="female" control={<Radio />} label="Default" onClick={() => setChecked(false)}/>
                                    <FormControlLabel value="male" control={<Radio />} label="Custom" onClick={() =>  setChecked(true)}/>
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
                        <Button variant= "outlined" type= "submit" onClick={() => handleSubmit1} sx={{ margin: '20px'}}>Submit</Button>
                </form>
                </Container>
            </AccordionDetails>
        </Accordion>
        </>
    );

}

export default EntityMasking;
