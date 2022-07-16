import './App.scss';
import AppHeaderComponent from "./components/AppHeaderComponent/AppHeaderComponent";
import Teams from "./components/Teams/Teams";

function App() {

    return (
        <div className="App">
            <AppHeaderComponent/>
            <div className="main">
                <Teams />
            </div>
        </div>
    );
}


export default App;
