import Button from "./Button";
import  {Link, useNavigate} from 'react-router-dom';
import {ChangeEvent, useState, useContext} from "react";

import {UserContext} from "../context/UserContext"

function Start(){

    const [Username, setUsername]= useState("");
    const [Password, setPassword]= useState("");
    const [Error, setError]= useState("");
    const [Message, setMessage]= useState(false);
    const [Navigate, setNavigate]= useState(false);
    const [, setToken]= useContext(UserContext);

    const submitCredentials = async() => {
        const requestOptions = {
            method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `grant_type=&username=${Username}&password=${Password}&scope=&client_id=&client_secret=`

        };
        const response= await fetch("http://127.0.0.1:8000/token", requestOptions);
        const data= await response.json();

        if(!response.ok){
            setError(data.detail);
            setMessage(true);
            setNavigate(false);
        }
        else{
            setToken(data.access_token);
            setMessage(false);
            setNavigate(true);
        }
    };

    const handleClick= useNavigate();

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitCredentials();
        if(Navigate){
            handleClick("/EntitySelect");
        }
    }

    return (
        <>
            <div id="startup">
                <h1>Application Name</h1>
                { Message &&
                    <div>
                        <p>Invalid Username or Password, please try again</p>
                    </div>
                }
                <form method="post" onSubmit={handleSubmit} id="login">
                    <div id="aut">
                            <div>
                            <label id="user">Username:</label>
                            <input type= "text" name="username" value={Username} placeholder= "Enter username" onChange={(e) => {setUsername(e.target.value)}}/>
                            </div>
                            <div>
                            <label id="user"> Password:</label>
                            <input type="password" name="password" value={Password} placeholder= "Enter password" onChange= {(e) => {setPassword(e.target.value)}}/>
                            </div>
                    </div>
                    <div id="buttons1">
                        <button type="submit">Login</button>
                    </div>
                </form>
                <Link to= "/Signup">
                    <div>
                        <label>Register as a new user: </label>
                        <Button onClick={() => handleClick("/")}>Signup</Button>
                    </div>
                </Link>
            </div>
        </>
    );
}

export default Start;
