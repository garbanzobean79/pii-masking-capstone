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
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import React from "react";
import LinearProgressWithLabel from './LinearProgressWithLabel';
import { useNavigate } from 'react-router-dom';

interface Props{
    Checked: boolean;
    setChecked: (value: boolean) => void;
    Name: boolean;
    setName: (value: boolean) => void;
    City: boolean;
    setCity: (value: boolean) => void;
    Dates: boolean;
    setDate: (value: boolean) => void;
    Email: boolean;
    setEmail: (value: boolean) => void;
    SSN: boolean;
    setSSN: (value: boolean) => void;
    Company: boolean;
    setCompany: (value: boolean) => void;
    Currency: boolean;
    setCurrency: (value: boolean) => void;
    State: boolean;
    setState: (value: boolean) => void;
    setDisabled1: (value: boolean) => void;
    setMasked: (value: string) => void;
    setMaskedEntities: (value: string[][]) => void;
    setMaskingInstanceId: (value: string) => void;
    expanded: string | false;
    setExpanded: (value: string | false) => void;
}

function EntityMasking({setChecked, Name, setName, City, setCity, Dates, setDate, 
    Email, setEmail, SSN, setSSN, Company, setCompany, Currency, setCurrency, State, setState,
    setDisabled1, Checked, setMasked, setMaskedEntities, setMaskingInstanceId, expanded, setExpanded}: Props){
    const [error, setError] = useState<String>('');
    const [Text, setText] = useState("");
    const [maskingInstanceName, setMaskingInstanceName] = useState<string>('');
    const masked_entity: string[][]= []
    const [Loading, setLoading]= useState(false);
    const [progress, setProgress]= useState<number>(0);
    const [estimated_time, setTime]= useState<number>(0);
    const [MaskLevel, setLevel]= useState<string[]>([]);

    const navigate= useNavigate();

    useEffect(()=> {
        if(Loading){
            console.log("Loading: " + Loading)
            const startTime= Date.now();
            console.log("start time: " + startTime)
            const interval= setInterval(() => {
                const elapsedTime= Date.now()- startTime;
                const newProgress= (elapsedTime / (estimated_time*1000)) * 100;
                setProgress(newProgress >= 100 ? 100: newProgress);
                console.log("Progress: " + progress);
            }, 100);
            setTimeout(() => 
            {
                clearInterval(interval);
                submitText(MaskLevel);
                setLoading(false);
            }, estimated_time * 1000);
            return () => clearInterval(interval);
        }
    }, [Loading]);

    async function submitText(Mask_Level: string[]) {
        let req_body;
        if (maskingInstanceName == '') {
            req_body = JSON.stringify({ text: Text, mask_level: Mask_Level });
        } else {
            req_body = JSON.stringify({ text: Text, mask_level: Mask_Level, masking_instance_name: maskingInstanceName });
        }

        console.log("body of fetch to /mask-text: ", req_body)
        try{
            const response= await fetch(`http://127.0.0.1:8000/mask-text`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem("jwtToken")}`,
                    'Content-Type': 'application/json'
                },
                body: req_body
            });

            if(!response.ok){
                const data= await response.json();
                console.log("Response: " + data.detail);
                console.log("Error message: " + data.detail.message);
                console.log("Time: " + data.detail.estimated_time);
                setTime(data.detail.estimated_time);
                if(data.detail !== "Could not validate credentials")
                    setLoading(true);
                else{
                    navigate('/sign-in');
                }

            } else{
                const data= await response.json();
                console.log(data.entity_mask);
                setMasked(data.masker.masked_sentence);
                setMaskingInstanceId(data.masking_instance_id);
                masked_entity.splice(0);
                let Array_length= (data.entity_mask.original).length;
                for(let i=0; i< Array_length; i++){
                    masked_entity.push([
                        data.entity_mask.original[i],
                        data.entity_mask.masked[i]
                    ]);
                }
                setLoading(false);
                setDisabled1(false);
                setMaskedEntities([...masked_entity]);
                setExpanded('panel2');
            }
        }

        catch(error:any){
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error has occured.");
            }
            console.log(error);
            console.log("Loading1: " + Loading);
        }
    };

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
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
            if (Dates) {
                Mask_Level.push("DATE");
            }
            if (Email) {
                Mask_Level.push("EMAIL");
            }
            if (SSN) {
                Mask_Level.push("SSN");
                Mask_Level.push("ACCOUNTNUMBER");
            }
            if (Company) {
                Mask_Level.push("COMPANYNAME");
            }
            if (Currency) {
                Mask_Level.push("CURRENCY");
            }
            if(State) {
                Mask_Level.push("STATE");
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
            Mask_Level.push("ACCOUNTNUMBER");
            Mask_Level.push("COMPANYNAME");
            Mask_Level.push("CURRENCY");
            Mask_Level.push("STATE");
        }
        setLevel(Mask_Level);
        submitText(Mask_Level);
    };

    const expandPanel= (panel: string) => (event: React.SyntheticEvent, isExpanded:boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return(
        <>
            <Accordion expanded= {expanded === 'panel1'} onChange={expandPanel('panel1')}  sx={{ margin: '50px'}}>
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
                    <Container sx={{ mt: '20px'}}>
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
                            <FormControlLabel control={<Checkbox onChange={(e) => {setState(e.target.checked)}}/>} label="State"/>
                            <FormControlLabel control={<Checkbox onChange={(e) => {setCompany(e.target.checked)}}/>} label="Company Name"/>
                            <FormControlLabel control={<Checkbox onChange={(e) => {setCurrency(e.target.checked)}}/>} label="Currency"/>
                            <FormControlLabel control={<Checkbox onChange={(e) => {setDate(e.target.checked)}}/>} label="Date" />
                            <FormControlLabel control={<Checkbox onChange={(e) => {setEmail(e.target.checked)}}/>} label="Email"/>
                            <FormControlLabel control={<Checkbox onChange={(e) => {setSSN(e.target.checked)}}/>} label="SSN/Account Number"/>
                        </FormGroup>
                        }
                    </Container>
                    <Container>
                        <TextField
                            margin="normal"
                            id="maskingInstanceName"
                            label="Name of Masking Instance"
                            name="maskingInstanceName"
                            value={maskingInstanceName}
                            onChange={(e) => {setMaskingInstanceName(e.target.value)}}
                        />
                    </Container>
                    <Button variant= "outlined" type= "submit" onClick={() => handleSubmit} sx={{ margin: '20px'}}>Submit</Button>
                </form>
                </Container>
                { Loading &&
                <LinearProgressWithLabel value={progress}/>
                }
            </AccordionDetails>
        </Accordion>
        </>
    );

}

export default EntityMasking;
