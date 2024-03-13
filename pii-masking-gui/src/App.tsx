import Anonymity from "./components/Anonymity";
import Home from "./components/Home";
import NEROutput from "./components/NEROutput";
import Signup from "./components/Signup";
import SignIn from "./components/SignIn";
import MaskingHistory from "./components/MaskingHistory";
import NavBar from "./components/NavBar";

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

// TODO: add guarded routes so that when a user signs out 
//          on a page that requires authentication, they will be
//          redirected to the home page
//      EX:
        // <Route path="/dashboard">
        //   {isAuthenticated ? <DashboardPage /> : <Redirect to="/login" />}
        // </Route>

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
                    <Route path="/masking-history" element = {<MaskingHistory/>}/>
                </Routes>
            </Router>
        </>

    );
}

export default App;