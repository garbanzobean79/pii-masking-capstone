import Anonymity from "./components/Anonymity";
import Home from "./components/Home";
import NEROutput from "./components/NEROutput";
import Signup from "./components/Signup";
import SignIn from "./components/SignIn";

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App(){
    return( 
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/EntitySelect" element={<Anonymity/>}/>
                    <Route path="/NEROutput" element = {<NEROutput/>}/>
                    <Route path="/Signup" element = {<Signup/>}/>
                    <Route path="/sign-in" element = {<SignIn/>}/>
                </Routes>
            </Router>
        </>

    );
}

export default App;