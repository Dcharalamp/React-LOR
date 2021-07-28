import React, {useState, useEffect} from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";   //enables routing,anything inside this will have access to the browser routing
//we only have 1 index.html, so to transsition between diferent pages we need react-router-dom
//switch, we look at the URL and make a decision about it
///Route, determines a single route
import Axios from "axios";
import Home from "./components/pages/Home"; //import the components' file
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Header from "./components/layout/Header";
import UserContext from "./context/UserContext";
import OntRegister from "./components/pages/OntRegister";
import AuthDelete from "./components/auth/AuthDelete";
import Testing from "./components/pages/testing";
import GuestDashboard from "./components/pages/GuestDashboard";
import About from "./components/pages/About";

import "./style.css";

export default function App() { //this app react function component(rfc) returns a div App
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined,

    });

    useEffect(() => {
        const checkLoggedIn = async () => {
            let token = localStorage.getItem("auth-token"); //get token from local storage(if any)
            if(token === null){
                localStorage.setItem("auth-token", "");
                token = "";
            }
            
            const tokenRes = await Axios.post( //token auth with backend using axios
                "http://localhost:5000/users/tokenIsValid",
                null,
                {headers: {"x-auth-token": token}}
            );
            if(tokenRes.data) {
                const userRes = await Axios.get("http://localhost:5000/users/",{ //get user data from backend using axios
                    headers:{"x-auth-token": token},
                });
                setUserData({token, user: userRes.data}); //update state with data we found from axios backend get request

            }

        };

        checkLoggedIn();
    }, []);
    return (
    <> 
        <BrowserRouter> 
        <UserContext.Provider value={{userData, setUserData}}> {/*this provides the value given to every component it surrounds */}
        <Header/> {/*this will be stuck in all our "pages" so no routing or switching required */}
           <div className="container">
           <Switch>
               <Route exact path="/" component={Testing} />
               <Route exact path="/user-dash" component={GuestDashboard} /> 
               <Route path="/login" component={Login} />
               <Route path="/register" component={Register} />
               <Route path="/ontregister" component={OntRegister}/>
               <Route path="/about" component={About}/>
               <Route path="/ontdelete" component={AuthDelete}/>
            </Switch>
            </div>
        </UserContext.Provider>
         
        </BrowserRouter>
    
    
    </>
    );
}




