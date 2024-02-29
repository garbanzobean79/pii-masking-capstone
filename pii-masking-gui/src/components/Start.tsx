import Button from "./Button";
import  {Link, useNavigate} from 'react-router-dom';
import {ChangeEvent, useEffect, useState, useContext} from "react";

import {UserContext} from "../context/UserContext"

function Start(){

    const [Username, setUsername]= useState("")
    const [Password, setPassword]= useState("")
    const[Loading, setLoading]= useState(false)
    const [, setToken]= useContext(UserContext);
    const [data, setData]= useState(null);

    const submitCredentials = () => {
        setLoading(true)

        useEffect(() => {
            const fetchData = async () =>{
                try{
                    const response= await fetch("/token");
                    const json= await response.json();
                    setData(json);
                    setLoading(false);
                }
                catch(error){
                    console.log("Error: ", error);
                    setLoading(false);
                }
            }
            fetchData();
        }, []);
    }

    const handleClick= useNavigate()
    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(Username)
        console.log(Password)
        submitCredentials();
        console.log(data);

    }

    return (
        <>
            <div id="startup">
                <h1>Application Name</h1>
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
                        <Link to= "/EntitySelect">
                            <div><Button onClick= {() => handleClick("/")}>Next</Button></div>
                        </Link>
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
