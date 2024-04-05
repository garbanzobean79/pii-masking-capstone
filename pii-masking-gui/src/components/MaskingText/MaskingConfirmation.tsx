import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import MaskingResults from './MaskingResults';
import Entities from './Entities';
import React from "react";
import Button from '@mui/material/Button';
import {useState} from "react";

import { Container } from '@mui/material';

interface Props{
    disabled1: boolean;
    setDisabled2: (value: boolean) => void;
    Masked: string;
    setMasked: (value: string) => void;
    Masked_Entities: string[][];
    setMaskedEntities: (value: string[][]) => void;
    setOutput: (value: string) => void;
    maskingInstanceId: string;
    expanded: string | false;
    setExpanded: (value: string | false) => void;
}

function MaskingConfirmation({disabled1, setDisabled2, Masked, Masked_Entities, 
    setMaskedEntities, setOutput, setMasked, maskingInstanceId, expanded, setExpanded}: Props){
    const [error, setError]= useState("");
    const [NewType, setType]= useState("");
    const [NewEntity, setNew]= useState("");
    const isVisible: boolean= true;
    const [Entity_Type, setET] = useState<string[][]>([]);
    const masked_entity: string[][]= []

    // Counts the number of times the manual mask endpoint 
    // was called (used in storing masking history)
    const [manualMaskCount, setManualMaskCount] = useState(0);

    async function runModel(){
        try{
            const response= await fetch('http://127.0.0.1:8000/run-model', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem("jwtToken")}`
                }
            });
        
            if(!response.ok){
                throw new Error('Failed to mask text');

            }
            const data= await response.json();
            console.log(data);
            console.log("fetched data", data.Response_Message);
            setExpanded('panel3');
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

    async function reMask(Entity_Type: string[][]) {
        console.log(Entity_Type);
        try{
            const Type= Entity_Type.map(row => row[0]);
            console.log(Type);
            const Word= Entity_Type.map(row => row[1]);
            console.log(Word);

            // Update the manual mask counter 
            setManualMaskCount(manualMaskCount + 1);
            const req_body = JSON.stringify({
                word: Word, 
                entity: Type, 
                manual_mask_count: manualMaskCount,
                masking_instance_id: maskingInstanceId
            })
            console.log("sending the following body to /manual-mask: ", req_body)

            const response= await fetch("http://127.0.0.1:8000/manual-mask", {
                method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem("jwtToken")}`
                    },
                body: req_body
            });

            if(!response.ok){
                throw new Error('Failed to mask text');
            }

            const data= await response.json();
            console.log(data);
            setMasked(data[1]);
            console.log(`number of times manual masking was called: ${manualMaskCount}`)
            masked_entity.splice(0);
            let Array_length= (data[2].masked).length;
            for(let i=0; i< Array_length; i++){
                console.log("Input:", data[2].original[i]);
                console.log("Output:", data[2].masked[i]);
                masked_entity.push([
                    data[2].original[i],
                    data[2].masked[i]
                ]);
            }
            console.log(masked_entity);
            setMasked(data[1]);
            setMaskedEntities(masked_entity);
            setET([]);
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

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        runModel();
        setDisabled2(false);
    };

    const addEntity = () => {
        if((NewType) === "First Name"){
            setET([...Entity_Type, ["FIRSTNAME", NewEntity]])
        }
        else if((NewType) === "Last Name"){
            setET([...Entity_Type, ["LASTNAME", NewEntity]])
        }
       else if((NewType) === "Middle Name"){
            setET([...Entity_Type, ["MIDDLENAME", NewEntity]])
        }
        else if((NewType)=== "Company"){
            setET([...Entity_Type, ["COMPANYNAME", NewEntity]])
        }
        else if((NewType) === "SSN/Account Number"){
            setET([...Entity_Type, ["SSN", NewEntity]])
            setET([...Entity_Type, ["ACCOUNTNUMBER", NewEntity]])
        }
        else{
            setET([...Entity_Type, [NewType.toUpperCase(), NewEntity]])
        }
        console.log(NewEntity);
        console.log(NewType);
        console.log(Entity_Type);
        setNew("");
        setType("Select an Entity Type");
    };

    const expandPanel= (panel: string) => (event: React.SyntheticEvent, isExpanded:boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return(
        <>
            <Accordion disabled={disabled1} sx={{ margin: '50px'}} expanded= {expanded === 'panel2'} onChange={expandPanel('panel2')} >
                <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header">
                    <Typography>Confirm Masking</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Container sx={{display: 'flex', flexDirection: 'row', gap: '5%'}}>
                    <MaskingResults Masked= {Masked}/>
                    <Entities masked_entities={Masked_Entities} isVisible={isVisible} Title={"Masked Entities"}/>
                    <Entities masked_entities={Entity_Type} isVisible={isVisible} Title={"Entities to Mask"}/>
                    </Container>
                    <Container  sx={{ marginTop: "20px"}}>
                        <Typography sx= {{marginTop: '10px'}}>Did we miss an entity?</Typography>
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: '2%', margin: '20px'}}>
                        <Box sx={{ minWidth: 500 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Entity Type</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                defaultValue="Select an Entity Type"
                                value={NewType}
                                label="Entity Type"
                                >
                                <MenuItem value={"Select an Entity Type"}>Select an Entity Type</MenuItem> 
                                <MenuItem value={"First Name"} onClick={()=> setType("First Name")}>First Name</MenuItem> 
                                <MenuItem value={"Middle Name"} onClick={()=> setType("Last Name")}>Middle Name</MenuItem> 
                                <MenuItem value={"Last Name"} onClick={()=> setType("Middle Name")}>Last Name</MenuItem> 
                                <MenuItem value={"City"} onClick={()=> setType("City")}>City</MenuItem> 
                                <MenuItem value={"State"} onClick={()=> setType("State")}>State</MenuItem> 
                                <MenuItem value={"Date"} onClick={()=> setType("Date")}>Date</MenuItem>
                                <MenuItem value={"Email"} onClick={()=> setType("Email")}>Email</MenuItem>
                                <MenuItem value={"SSN/Account Number"} onClick={()=> setType("SSN/Account Number")}>SSN/Account Number</MenuItem>
                                <MenuItem value={"Company"} onClick={()=> setType("Company")}>Company</MenuItem>
                                <MenuItem value={"Currency"} onClick={()=> setType("Currency")}>Currency</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <TextField id="entity" value={NewEntity} label="Text Entity" placeholder="Enter text entity" variant="outlined" sx={{ minWidth: 300 }} onChange={(e) => {setNew(e.target.value)}}/>
                        </Box>
                        <Button variant="contained" onClick= {addEntity} sx={{ margin: '20px'}} >Add entity</Button>
                        <Button variant="contained" onClick= {() => reMask(Entity_Type)} sx={{ margin: '20px'}} >Re Mask</Button>
                    </Container>
                    <Button variant="outlined" onClick={handleSubmit} sx={{ margin: '50px' }}>Confirm</Button>
                </AccordionDetails>
            </Accordion>            
        </>
    );
}

export default MaskingConfirmation;