import './App.scss';
import AppHeaderComponent from "./components/AppHeaderComponent/AppHeaderComponent";
import Teams from "./components/Teams/Teams";
import MessageList from "./components/MessageList/MessageList";

function App() {

    return (
        <div className="App">
            <AppHeaderComponent/>
            <div className="main">
                <Teams />
                <MessageList />
            </div>
        </div>
    );
}


export default App;
