import './App.css';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from './pages/home';
import Auth from './pages/auth';
import { Fragment } from 'react';
import PrivateRoute from './components/privateRoute';
import { Provider as UserProvider } from './contexts/user';
import Apps from './pages/apps';
import NotFound from './pages/notFound';

function App() {
    return (
        <UserProvider>
            <Router>
                <Fragment>
                    <Routes>
                        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>}/>
                        <Route path="/auth/" element={ <Auth />}/>
                        <Route path="/apps/" element={ <Apps />}/>
                        <Route path="*" element={ <NotFound />}/>
                    </Routes>
                </Fragment>
            </Router>
        </UserProvider>
    );
}

export default App;
