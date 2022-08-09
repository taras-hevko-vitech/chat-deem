import './App.scss';
import AppHeaderComponent from "./components/AppHeaderComponent/AppHeaderComponent";
import Teams from "./components/Teams/Teams";
import MessageList from "./components/MessageList/MessageList";
import ProfileInformation from "./components/ProfileInformation/ProfileInformation";
import ChatComponent from "./components/ChatComponent/ChatComponent";

function App() {

    return (
        <div className="App">
            <AppHeaderComponent/>
            <div className="main">
                <Teams />
                <MessageList />
                <ProfileInformation />
                <ChatComponent />
            </div>
        </div>
    );
}


export default App;
