import Button from "./Button";
import {Link, useNavigate} from "react-router-dom";
function TextInput(){

    const handleClick= useNavigate()

    return (
        <>
            <Link to="/EntitySelect">
                <div><Button onClick= {() => handleClick("/")}>Home</Button></div>
            </Link>
            <h1>Input Text to be fed into the LLM</h1>
            <form>
                <div className= "form-group">
                    <textarea className= "form-control" rows= {20} cols={80}></textarea>
                </div>
            </form>      
            <Link to="/">
                <div><Button onClick= {() => handleClick("/")}>Submit</Button></div>
            </Link>
        </>
    );
}

export default TextInput;