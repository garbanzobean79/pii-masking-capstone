import Button from "./Button";
import {Link, useNavigate} from 'react-router-dom';
import {useState, ChangeEvent, useContext} from "react";

import {UserContext} from "../context/UserContext";

function NEROutput (){

    const [Checked, setChecked]= useState(false)
    const[Logout, setLogout]= useState(false);
    const [, setToken]= useContext(UserContext);

    const handleLogout = () => {
        setToken(null);
        setLogout(false);
        handleClick("/");
    }

    const checkLogout = () => {
        setLogout(true);
    }

    const handleClick= useNavigate()
    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(Checked);
    }

    return (
        <>
            <Button onClick={checkLogout}>Logout</Button>
            { Logout &&
                <div>
                    <p>Are you sure you want to logout?</p>
                    <button onClick={handleLogout}>Yes</button>
                    <button onClick={() => setLogout(false)}>No</button>
                </div>
            }
            <div id="buttons2">
                <Link to="/">
                    <div><Button onClick={() => handleClick("/")}>Home</Button></div>
                </Link>
                <Link to ="/EntitySelect">
                    <div><Button onClick={() => handleClick("/")}>Back</Button></div>
                </Link>
            </div>
            <h2>Text Input with Anonymized Entries</h2>
            <div id="ner">
                <div id= "neroutput">
                    <h3>NER Output goes here...</h3>
                </div>
                <div>
                    <form method="post" onSubmit={handleSubmit}>
                        <input type="checkbox" name="correct" defaultChecked= {false} onChange= {(e) => {setChecked(e.target.checked)}}/>
                        <label>Is the level of anonymity satisfactory?</label>
                        <div id="buttons">
                            <button type="submit">Submit</button>
                            <div><Button onClick={() => handleClick("/")}>Next</Button></div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default NEROutput;