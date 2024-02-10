import { Link, useNavigate} from "react-router-dom";
import Button from "./Button";
import { useState, ChangeEvent} from "react";

function Anonymity(){

    const [Checked, setChecked]= useState(false); //Default, Custom
    const [Name, setName] = useState(false)
    const [Organization, setOrganization]= useState(false)
    const [Dates, setDates] = useState(false)
    const [Location, setLocation]= useState(false)
    const [Event, setEvent] = useState(false)
    const [Medical, setMedical]= useState(false)

    const [Text, setText] = useState("")
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
    }

    return (
        <>
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
                                <span>&#8505;</span>
                                <span>&#8505;</span>
                                <span>&#8505;</span>
                                <span>&#8505;</span>
                                <span>&#8505;</span>
                                <span>&#8505;</span>
                            </div>
                        </div>
                    }
                    </div>
                    <div className= "form-group" id="textbox">
                        <textarea rows={10} cols={75} name="Input" placeholder=" Enter text here" onChange={(e) => {setText(e.target.value)}}></textarea>
                    </div>
                    <div id="buttons">
                        <button type="submit">Submit</button>
                        <Link to="/NEROutput">
                            <div><Button onClick={() => {handleClick("/")}}>Next</Button></div>
                        </Link>
                    </div>
                </form>

        </>
    );
}
export default Anonymity;

