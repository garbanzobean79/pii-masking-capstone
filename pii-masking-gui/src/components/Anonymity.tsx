import { Link, useNavigate} from "react-router-dom";
import Button from "./Button";
import { useState, ChangeEvent, useContext} from "react";

import {UserContext} from "../context/UserContext";

function Anonymity(){

    const [Checked, setChecked]= useState(false); //Default, Custom
    const [Name, setName] = useState(false)
    const [Organization, setOrganization]= useState(false)
    const [Dates, setDates] = useState(false)
    const [Location, setLocation]= useState(false)
    const [Event, setEvent] = useState(false)
    const [Medical, setMedical]= useState(false)
    const [Error, setError]= useState("");
    const[Logout, setLogout]= useState(false);
    const [, setToken]= useContext(UserContext);
    const [Text, setText] = useState("");
    const [Masked, setMasked]= useState("");
    const [Navigate, setNavigate]= useState(false);

    const handleLogout = () => {
        setToken(null);
        setLogout(false);
        handleClick("/");
    }

    const checkLogout = () => {
        setLogout(true);
    }

    const submitText= async() => {
        const requestOptions = {
            method: "POST",
                headers: {"Content-Type": "application/json"},
            body: JSON.stringify({text: Text})

        };
        const response= await fetch("http://127.0.0.1:8000/mask-text", requestOptions);
        const data= await response.json();

        if(!response.ok){
            setError(data.detail);
            setNavigate(false);
        }
        else{
            //setMasked(data)
            setNavigate(true);
        }
    };

    const submitCategories = async() => {

    };

    const handleClick = useNavigate()

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(Checked);   
        console.log(Text);
        console.log(Name);
        console.log(Organization);
        console.log(Dates);
        console.log(Location);
        console.log(Event);
        console.log(Medical);
        submitText();
    };

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
            <h2>Level of Anonymity</h2>
                <form method="post" onSubmit={handleSubmit}>
                <div id="anon">
                    <div className="form-check" id="custom">
                        <label className="form-check-label">
                            <input className="form-check-input" type="radio" name="Level" defaultChecked= {true} onClick={() => setChecked(false)}/>
                        Default</label>
                        <label className="form-check-label">
                            <input className="form-check-input" type="radio" name="Level" onClick={() =>  setChecked(true)}/>
                        Custom</label>
                    </div>
                    { Checked && 
                        <div id="checks">
                            <div id="icon">
                                <div id="cont">
                                    <label className="form-check-label">
                                        <input className="form-check-input" type="checkbox" name= "Name" onChange={(e) => {setName(e.target.checked)}}/>
                                    Name</label>
                                </div>
                                <div id="cont">
                                    <label className="form-check-label">
                                        <input className="form-check-input" type="checkbox" name= "Organization" onChange={(e) => {setOrganization(e.target.checked)}}/>
                                    Organization</label>
                                </div>
                                <div id="cont">
                                    <label className="form-check-label">
                                        <input className="form-check-input" type="checkbox" name= "Dates" onChange={(e) => {setDates(e.target.checked)}}/>
                                    Dates</label>
                                </div>
                                <div id="cont">
                                    <label className="form-check-label">
                                        <input className="form-check-input" type="checkbox" name= "Location" onChange={(e) => {setLocation(e.target.checked)}}/>
                                    Location</label>
                                </div>
                                <div id="cont">
                                    <label className="form-check-label">
                                        <input className="form-check-input" type="checkbox" name= "Event" onChange={(e) => {setEvent(e.target.checked)}}/>
                                    Event</label>
                                </div>
                                <div id="cont">
                                    <label className="form-check-label">
                                        <input className="form-check-input" type="checkbox" name= "Med" onChange={(e) => {setMedical(e.target.checked)}}/>
                                    Medical Information</label>
                                </div>
                            </div>
                            <div id= "icons">
                                <div id="info">
                                <span>&#8505;</span>
                                <p>NER model masks all names</p>
                                </div>
                                <div id="info">
                                <span>&#8505;</span>
                                <p>NER model masks all organizations</p>
                                </div>
                                <div id="info">
                                <span>&#8505;</span>
                                <p>NER model masks all dates</p>
                                </div>
                                <div id="info">
                                <span>&#8505;</span>
                                <p>NER model masks all locations</p>
                                </div>
                                <div id="info">
                                <span>&#8505;</span>
                                <p>NER model masks all events</p>
                                </div>
                                <div id="info">
                                <span>&#8505;</span>
                                <p>NER model masks all personal medical information</p>
                                </div>
                            </div>
                        </div>
                    }
                    </div>
                    <div className= "form-group" id="textbox">
                        <textarea rows={10} cols={75} name="Input" placeholder=" Enter text here" onChange={(e) => {setText(e.target.value)}}></textarea>
                    </div>
                    <div id="buttons">
                        <button type="submit">Submit</button>
                        { Navigate &&
                        <Link to="/NEROutput">
                            <div><Button onClick={() => {handleClick("/")}}>Next</Button></div>
                        </Link>
                        }
                    </div>
                </form>

        </>
    );
}
export default Anonymity;

