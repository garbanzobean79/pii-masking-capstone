import Button from "./Button";
import  {Link, useNavigate} from 'react-router-dom';

function Start(){

    const handleClick= useNavigate()

    return (
    <>
        <h1>Application Name</h1>
        <Link to= "/EntitySelect">
            <div><Button onClick= {() => handleClick("/")}>Next</Button></div>
        </Link>
    </>
    );
}

export default Start;