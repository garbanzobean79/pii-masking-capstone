import Anonymity from "./components/Anonymity";
import Home from "./components/Home";
import NEROutput from "./components/NEROutput";
import Signup from "./components/Signup";
import SignIn from "./components/SignIn";
import MaskingHistory from "./components/MaskingHistory";
import NavBar from "./components/NavBar";

import {BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { isTokenExpired } from "./services/authService";

function App(){
    return( 
        <>
            <Router>
                <NavBar></NavBar>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/EntitySelect" element={<Anonymity/>}/>
                    <Route path="/NEROutput" element = {<NEROutput/>}/>
                    <Route path="/Signup" element = {<Signup/>}/>
                    <Route path="/sign-in" element = {<SignIn/>}/>
                    <Route
                        path="/masking-history"
                        element={
                            isTokenExpired(sessionStorage.getItem("jwtToken")) ? (
                                console.log("here"),
                                <Navigate to="/sign-in" state={{redirectTo:"/masking-history"}} /> 
                            ) : (
                                <MaskingHistory />
                            )
                        }
                    />
                </Routes>
            </Router>
        </>

    );
}

export default App;