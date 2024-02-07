import Button from "./Button";
import  {Link, useNavigate} from 'react-router-dom';
import {ChangeEvent} from "react";
function Start(){

    const handleClick= useNavigate()
    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form= e.target;
        const formData= new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);  //For the custom entries
    }

    return (
    <>
        <h1>Application Name</h1>
        <form method="post" onSubmit={handleSubmit} id="login">
            <div className="aut">
                <label id="user">Username:</label>
                <input type= "text" name="username"/>
            </div>
            <div>
            <label id="user"> Password:</label>
            <input type="text" name="password"/>
            </div>
            <div id="buttons">
                <button type="submit">Login</button>
                <button type="submit">Signup</button>
                <Link to= "/EntitySelect">
                    <div><Button onClick= {() => handleClick("/")}>Next</Button></div>
                </Link>
            </div>
        </form>
    </>
    );
}

export default Start;