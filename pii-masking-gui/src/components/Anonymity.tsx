import { Link, useNavigate} from "react-router-dom";
import Button from "./Button";
import { useState } from "react";

function Anonymity(){

    const [checked]= useState(0)
    const handleClick = useNavigate()
    const handleOption= () => {

    }

    return (
        <>
            <h1>Level of Anonymity</h1>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault"></input>
                <label className="form-check-label">Default</label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault"></input>
                <label className="form-check-label">Custom</label>
            </div>
            <Link to="/TextInput">
                <div><Button onClick= {() => handleClick("/")}>Submit</Button></div>
            </Link>
        </>
    );
}

export default Anonymity;