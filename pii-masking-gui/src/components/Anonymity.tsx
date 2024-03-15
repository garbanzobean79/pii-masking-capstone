import EntityMasking from './EntityMasking';
import MaskingConfirmation from './MaskingConfirmation';
import LLMOutput from './LLMOutput';
import Button from '@mui/material/Button';
import { useState, ChangeEvent, useContext} from "react";
import {UserContext} from "../context/UserContext";

function Anonymity(){

    const [Checked, setChecked]= useState(false); //Default, Custom
    const [Name, setName] = useState(false)
    const [City, setCity]= useState(false)
    const [Date, setDate] = useState(false)
    const [Email, setEmail]= useState(false)
    const [SSN, setSSN] = useState(false)
    const [Company, setCompany]= useState(false)
    const [Currency, setCurrency]= useState(false)
    const [Error, setError]= useState("");
    const [Logout, setLogout]= useState(false);
    const [, setToken]= useContext(UserContext);
    const [Text, setText] = useState("");
    const [Masked, setMasked]= useState("");
    const [disabled1, setDisabled1]= useState(true);
    const [disabled2, setDisabled2]= useState(true);

    return (
        <>
            <EntityMasking 
                Checked= {Checked}
                setDisabled1={setDisabled1} 
                setChecked={setChecked} 
                setName={setName}
                setCity={setCity}
                setDate={setDate}
                setEmail={setEmail}
                setSSN={setSSN}
                setCompany={setCompany}
                setCurrency={setCurrency}
                />
            <MaskingConfirmation disabled1= {disabled1} setDisabled2={setDisabled2}/>
            <LLMOutput disabled2= {disabled2} />
        </>
    );
}
export default Anonymity;

