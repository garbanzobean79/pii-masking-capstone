import Button from "./Button";
import {Link, useNavigate} from 'react-router-dom';

function NEROutput (){

    const handleClick= useNavigate()

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
            <br/>
            <input type="checkbox"/>
            <label>Is the level of anonymity satisfactory?</label>
            <div><Button onClick={() => handleClick("/")}>Submit</Button></div>
        </>
    );
}

export default NEROutput;