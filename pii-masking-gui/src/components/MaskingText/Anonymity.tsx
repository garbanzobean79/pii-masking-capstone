import EntityMasking from './EntityMasking';
import MaskingConfirmation from './MaskingConfirmation';
import LLMOutput from './LLMOutput';
import {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import React from "react";
import { isTokenExpired } from '../../services/authService';

function Anonymity(){

    const [Checked, setChecked]= useState<boolean>(false); //Default, Custom
    const [Name, setName] = useState<boolean>(false);
    const [City, setCity]= useState<boolean>(false);
    const [Date, setDate] = useState<boolean>(false);
    const [Email, setEmail]= useState<boolean>(false);
    const [SSN, setSSN] = useState<boolean>(false);
    const [Company, setCompany]= useState<boolean>(false);
    const [Currency, setCurrency]= useState<boolean>(false);
    const [State, setState]= useState<boolean>(false);
    const [Masked, setMasked]= useState("");
    const [disabled1, setDisabled1]= useState(true);
    const [disabled2, setDisabled2]= useState(true);
    const [output, setOutput]= useState("");
    const [maskingInstanceId, setMaskingInstanceId] = useState('');
    const [expanded, setExpanded]= useState<string | false>(false) ;

    const [maskedEntities, setMaskedEntities] = useState<string[][]>([]);

    const navigate= useNavigate();
    
    useEffect(() => {
        if(isTokenExpired(sessionStorage.getItem("jwtToken"))){
            navigate('/sign-in');
        }
        else{
            navigate('/masking-text');
        }
    }, []);

    return (
        <>
            <EntityMasking 
                Checked= {Checked}
                setDisabled1={setDisabled1} 
                setChecked={setChecked} 
                setName={setName} Name={Name}
                setCity={setCity} City={City}
                setDate={setDate} Dates={Date}
                setEmail={setEmail} Email={Email}
                setSSN={setSSN} SSN={SSN}
                setCompany={setCompany} Company={Company}
                setCurrency={setCurrency} Currency={Currency}
                setMasked={setMasked}
                setMaskedEntities= {setMaskedEntities}
                setMaskingInstanceId={setMaskingInstanceId}
                expanded= {expanded}
                setExpanded= {setExpanded}
                State= {State}
                setState= {setState}
            />
            <MaskingConfirmation 
                disabled1= {disabled1} 
                setDisabled2={setDisabled2}
                Masked= {Masked}
                Masked_Entities={maskedEntities}
                setOutput= {setOutput}
                setMasked= {setMasked}
                setMaskedEntities= {setMaskedEntities}
                maskingInstanceId= {maskingInstanceId}
                expanded= {expanded}
                setExpanded= {setExpanded}
            />
            <LLMOutput 
                disabled2= {disabled2} 
                Masked={Masked} 
                Output= {output}
                expanded={expanded}
                setExpanded= {setExpanded}
            />
        </>
    );
}
export default Anonymity;

