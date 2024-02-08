import Button from "./Button";
import  {Link, useNavigate} from 'react-router-dom';
import {ChangeEvent, useState} from "react";

function Start(){

    const [Username, setUsername]= useState("")
    const [Password, setPassword]= useState("")

    const handleClick= useNavigate()
    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(Username)
        console.log(Password)

    }

    return (
    <>
        <div id="startup">
        <h1>Application Name</h1>
        <form method="post" onSubmit={handleSubmit} id="login">
            <div id="auth">
                    <div>
                    <label id="user">Username:</label>
                    <input type= "text" name="username" value={Username} onChange={(e) => {setUsername(e.target.value)}}/>
                    </div>
                    <div>
                    <label id="user"> Password:</label>
                    <input type="password" name="password" value={Password} onChange= {(e) => {setPassword(e.target.value)}}/>
                    </div>
            </div>
            <div id="buttons">
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