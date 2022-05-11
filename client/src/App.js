import './App.css';
import ChatPage from "./pages/ChatPage";
import { Route, Routes } from "react-router";

function App() {

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<ChatPage/>}/>
                <Route path="*" element={<ChatPage/>}/>
            </Routes>
        </div>
    );
}

export default App;
