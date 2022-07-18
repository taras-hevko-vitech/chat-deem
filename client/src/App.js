import './App.scss';
import AppHeaderComponent from "./components/AppHeaderComponent/AppHeaderComponent";
import Teams from "./components/Teams/Teams";
import MessageList from "./components/MessageList/MessageList";
import ProfileInformation from "./components/ProfileInformation/ProfileInformation";

function App() {

    return (
        <div className="App">
            <AppHeaderComponent/>
            <div className="main">
                <Teams />
                <MessageList />
                <ProfileInformation />
            </div>
        </div>
    );
}


export default App;
