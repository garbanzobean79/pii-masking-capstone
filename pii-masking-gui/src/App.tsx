import Anonymity from "./components/Anonymity";
import Start from "./components/Start";
import TextInput from "./components/TextInput";

import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
function App(){

    return <>
        <Router>
            <Routes>
                <Route path="/" element={<Start/>}/>
                <Route path="/EntitySelect" element={<Anonymity/>}/>
                <Route path= "/TextInput" element = {<TextInput/>}/>
            </Routes>
        </Router>
    </>
}

export default App;