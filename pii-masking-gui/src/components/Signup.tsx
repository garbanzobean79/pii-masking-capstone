import {useState, ChangeEvent} from "react";
import  {Link, useNavigate} from 'react-router-dom';

function Signup(){

    const [Username, setUsername] = useState("")
    const [Password, setPassword]= useState("")

    const handleClick = useNavigate()

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(Username)
        console.log(Password)
    }

    return(
        <>
            <div>
                <h2>Registration</h2>
                <form method="post" onSubmit={handleSubmit}>
                    <div id="aut">
                        <div>
                        <label>Enter Username: </label>
                        <input type="text" name="username" value={Username} placeholder= "Enter username" onChange={(e) => {setUsername(e.target.value)}}/></div>
                        <div>
                        <label>Enter Password: </label>
                        <input type="password" name="password" value={Password} placeholder= "Enter password" onChange={(e) => {setPassword(e.target.value)}}/></div>
                    </div>
                    <div>
                         <Link to="/">
                            <button type="submit" onClick={() => handleClick("/")}>Signup</button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Signup;