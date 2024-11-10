import './App.css';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from './pages/home';
import Auth from './pages/auth';
import { Fragment } from 'react';
import PrivateRoute from './components/privateRoute';
import { Provider as UserProvider } from './contexts/user';

function App() {
    return (
        <UserProvider>
            <Router>
                <Fragment>
                    <Routes>
                        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>}/>
                        <Route path="/auth/" element={ <Auth />}/>
                    </Routes>
                </Fragment>
            </Router>
        </UserProvider>
    );
}

export default App;
