import { Link, useNavigate} from "react-router-dom";
import Button from "./Button";
import { useState, ChangeEvent} from "react";

function Anonymity(){

    const [Checked, setChecked]= useState(false);
    
    const handleClick = useNavigate()

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form= e.target;
        const formData= new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);  //For the custom entries
        console.log(Checked);   //for the default or custom setting 
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
                        <div className="form-check" id="checks">
                            <br/>
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input className="form-check-input" type="checkbox" name= "Name"/>
                                Name</label>
                            </div>
                            <div>
                                <label className="form-check-label">
                                    <input className="form-check-input" type="checkbox" name= "Organization"/>
                                Organization</label>
                            </div>
                            <div>
                                <label className="form-check-label">
                                    <input className="form-check-input" type="checkbox" name= "Dates"/>
                                Dates</label>
                            </div>
                            <div>
                                <label className="form-check-label">
                                    <input className="form-check-input" type="checkbox" name= "Location"/>
                                Location</label>
                            </div>
                            <div>
                                <label className="form-check-label">
                                    <input className="form-check-input" type="checkbox" name= "Event"/>
                                Event</label>
                            </div>
                            <div>
                                <label className="form-check-label">
                                    <input className="form-check-input" type="checkbox" name= "Med"/>
                                Medical Information</label>
                            </div>
                        </div>
                    }
                    </div>
                    <div className= "form-group" id="textbox">
                        <textarea rows={10} cols={75} name="Input"></textarea>
                    </div>
                    <div id="buttons">
                        <button type="submit">Submit</button>
                        <Link to="/NEROutput">
                            <div><Button onClick= {() => handleClick("/")} >Next</Button></div>
                        </Link>
                    </div>
                </form>

        </>
    );
}
export default Anonymity;

