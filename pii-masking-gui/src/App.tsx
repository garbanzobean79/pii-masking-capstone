import Anonymity from "./components/Anonymity";
import Start from "./components/Start";
import NEROutput from "./components/NEROutput";

import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
function App(){

    return <>
        <Router>
            <Routes>
                <Route path="/" element={<Start/>}/>
                <Route path="/EntitySelect" element={<Anonymity/>}/>
                <Route path="/NEROutput" element = {<NEROutput/>}/>
            </Routes>
        </Router>
    </>
}

export default App;