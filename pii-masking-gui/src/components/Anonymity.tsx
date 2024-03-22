import EntityMasking from './EntityMasking';
import MaskingConfirmation from './MaskingConfirmation';
import LLMOutput from './LLMOutput';
import {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import React from "react";
import { isTokenExpired } from '../services/authService';
import { Output } from '@mui/icons-material';

function Anonymity(){

    const [Checked, setChecked]= useState<boolean>(false); //Default, Custom
    const [Name, setName] = useState<boolean>(false)
    const [City, setCity]= useState<boolean>(false)
    const [Date, setDate] = useState<boolean>(false)
    const [Email, setEmail]= useState<boolean>(false)
    const [SSN, setSSN] = useState<boolean>(false)
    const [Company, setCompany]= useState<boolean>(false)
    const [Currency, setCurrency]= useState<boolean>(false)
    const [Masked, setMasked]= useState("");
    const [disabled1, setDisabled1]= useState(true);
    const [disabled2, setDisabled2]= useState(true);
    const [Loading, setLoading]= useState(false);
    const [output, setOutput]= useState("");
    const token= sessionStorage.getItem("jwtToken");

    const navigate = useNavigate();

    const [maskedEntities, setMaskedEntities] = useState<string[][]>([]);

    useEffect(() => {
        if (sessionStorage.getItem("jwtToken") == null) {
            navigate('/sign-in');
        } else {
            console.log("token in local storage: " + sessionStorage.getItem("jwtToken"));
        }

    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            const requestOptions = {
                method: "GET" ,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };

            const response= await fetch("http://127.0.0.1:8000/users/me", requestOptions);
        
            if(!response.ok){
                console.log("Error");
            }
        };
        fetchUser();
        console.log(disabled2);
    }, [token]);


    // TODO: replace with guarded route
    useEffect(() => {
        // Function to run when the component is loaded
        console.log('Component loaded');
    
        // Check if the user is signed in'
        console.log(`jwt: ${sessionStorage.getItem("jwtToken")}`)
        if (sessionStorage.getItem("jwtToken") == null) {
            setMaskedEntities([]);
            navigate('/sign-in');
        } else {
            console.log("token in local storage: " + sessionStorage.getItem("jwtToken"));
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
                setDate={setDate} Date={Date}
                setEmail={setEmail} Email={Email}
                setSSN={setSSN} SSN={SSN}
                setCompany={setCompany} Company={Company}
                setCurrency={setCurrency} Currency={Currency}
                setMasked={setMasked}
                setMaskedEntities= {setMaskedEntities}
                setLoading={setLoading}
                />
            <MaskingConfirmation 
            disabled1= {disabled1} 
            setDisabled2={setDisabled2}
            Masked= {Masked}
            Masked_Entities={maskedEntities}
            setOutput= {setOutput}
            setMasked= {setMasked}
            setMaskedEntities= {setMaskedEntities}
            />
            <LLMOutput disabled2= {disabled2} Masked={Masked} Output= {output}/>
        </>
    );
}
export default Anonymity;

