import {useState, ChangeEvent, useContext} from "react";
import  {Link, useNavigate} from 'react-router-dom';

import ErrorMessage from "./ErrorMessage";

function Signup(){

    const [Username, setUsername] = useState("");
    const [Email, setEmail] = useState("");
    const [Name, setName]= useState("");
    const [Password, setPassword]= useState("");
    const [Confirmation, setConfirmation]= useState("");
    const [Error, setError]= useState("");
    const [Message, setMessage]= useState(false);
    const [Navigate, setNavigate]= useState(false);
    const handleClick = useNavigate();

    const submitCredentials = async() => {
        const requestOptions = {
            method: "POST" ,
                headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: Username, email: Email, full_name: Name, password: Password})
        };

        const response= await fetch("http://127.0.0.1:8000/register/", requestOptions);
        const data= await response.json();

        if(!response.ok){
            setError(data.detail);
        }
        else{
            setNavigate(true);
        }
    }

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(Password == Confirmation){
            submitCredentials();
            setMessage(false);
            if(Navigate){
                handleClick("/");
            }
        }
        else{
            setError("Make sure passwords are the same.");
            setMessage(true);
        }
    }

    return(
        <>
            <div>
                <form method="post" onSubmit={handleSubmit}>
                    <div id="auth">
                        <h2>Registration</h2>
                        <div id="authe">
                            <div>
                                <label>Enter Username: </label>
                                <input type="text" name="username" value={Username} placeholder= "Enter username" onChange={(e) => {setUsername(e.target.value)}}/></div>
                            <div>
                                <label>Enter Email: </label>
                                <input type="text" name="username" value={Email} placeholder= "Enter email" onChange={(e) => {setEmail(e.target.value)}}/></div>
                            <div>
                                <label>Enter Full Name: </label>
                                <input type="text" name="username" value={Name} placeholder= "Enter full name" onChange={(e) => {setName(e.target.value)}}/></div>            
                            <div>
                                <label>Enter Password: </label>
                                <input type="password" name="password" value={Password} placeholder= "Enter password" onChange={(e) => {setPassword(e.target.value)}}/></div>
                            { Message &&
                                <p>Make sure passwords are the same length.</p>
                            }
                            <div>
                                <label>Confirm Password: </label>
                                <input type="password" name="Password" value={Confirmation} placeholder= "Confirm password" onChange={(e) => {setConfirmation(e.target.value)}}/></div>
                                <button type="submit" onClick={() => handleSubmit}>Signup</button>
                            <ErrorMessage message={Error}/>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Signup;