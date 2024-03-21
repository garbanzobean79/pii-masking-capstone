import EntityMasking from './EntityMasking';
import MaskingConfirmation from './MaskingConfirmation';
import LLMOutput from './LLMOutput';
import {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import React from "react";
import { isTokenExpired } from '../services/authService';

function Anonymity(){

    const [Checked, setChecked]= useState(false); //Default, Custom
    const [Name, setName] = useState(false)
    const [City, setCity]= useState(false)
    const [Date, setDate] = useState(false)
    const [Email, setEmail]= useState(false)
    const [SSN, setSSN] = useState(false)
    const [Company, setCompany]= useState(false)
    const [Currency, setCurrency]= useState(false)
    const [Masked, setMasked]= useState("");
    const [disabled1, setDisabled1]= useState(true);
    const [disabled2, setDisabled2]= useState(true);
    const token= sessionStorage.getItem("jwtToken");

    const navigate = useNavigate();

    let masked_entities: string[][] = []

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

    }, [token]);


    // // TODO: replace with guarded route
    // useEffect(() => {
    //     // Function to run when the component is loaded
    //     console.log('Component loaded');
    
    //     // Check if the user is signed in'
    //     console.log(`jwt: ${sessionStorage.getItem("jwtToken")}`)
    //     if (sessionStorage.getItem("jwtToken") == null) {
    //         navigate('/sign-in');
    //     } else {
    //         console.log("token in local storage: " + sessionStorage.getItem("jwtToken"));
    //     }

    // }, []);

    let Entity: boolean[] = [Name, City, Date, Email, SSN, Company, Currency];

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
                setMasked={setMasked}
                masked_entities={masked_entities}
                />
            <MaskingConfirmation 
            disabled1= {disabled1} 
            setDisabled2={setDisabled2}
            Entity={Entity}
            Masked= {Masked}
            masked_entity={masked_entities}
            />
            <LLMOutput disabled2= {disabled2} />
        </>
    );
}
export default Anonymity;

