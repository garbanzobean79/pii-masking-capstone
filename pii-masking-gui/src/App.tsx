import Anonymity from "./components/Anonymity";
import Start from "./components/Start";
import NEROutput from "./components/NEROutput";
import Signup from "./components/Signup";

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import {UserProvider} from "./context/UserContext";

function App(){

    return( 
        <>
            <Router>
                <UserProvider>
                <Routes>
                    <Route path="/" element={<Start/>}/>
                    <Route path="/EntitySelect" element={<Anonymity/>}/>
                    <Route path="/NEROutput" element = {<NEROutput/>}/>
                    <Route path="/Signup" element = {<Signup/>}/>
                </Routes>
                </UserProvider>
            </Router>
        </>
    );
}

export default App;