import Anonymity from "./components/Anonymity";
import Home from "./components/Home";
import Signup from "./components/Signup";
import SignIn from "./components/SignIn";
import MaskingHistory from "./components/MaskingHistory";
import NavBar from "./components/NavBar";
import { Container } from "@mui/material";
import React from "react";

import {BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { isTokenExpired } from "./services/authService";

function App(){
    return( 
        <>
            <Router>
                <NavBar></NavBar>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/masking-text" element={<Anonymity/>}/>
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