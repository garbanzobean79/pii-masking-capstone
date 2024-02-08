import Button from "./Button";
import {Link, useNavigate} from 'react-router-dom';
import { useState, ChangeEvent} from "react";

function NEROutput (){

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
            <div id="buttons">
                <Link to="/">
                    <div><Button onClick={() => handleClick("/")}>Home</Button></div>
                </Link>
                <Link to ="/EntitySelect">
                    <div><Button onClick={() => handleClick("/")}>Back</Button></div>
                </Link>
            </div>
            <h2>Text Input with Anonymized Entries</h2>
            <div id= "neroutput">
                <h3>NER Output goes here...</h3>
            </div>
            <div>
                <form method="post" onSubmit={handleSubmit}>
                    <input type="checkbox" name="correct" defaultChecked= {false}/>
                    <label>Is the level of anonymity satisfactory?</label>
                    <div id="buttons">
                        <button type="submit">Submit</button>
                        <div><Button onClick={() => handleClick("/")}>Next</Button></div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default NEROutput;