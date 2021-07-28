//this will be the buttons component
//the buttons shown each time will be determined whether we're logged in or not

import React, {useContext} from "react";
import {useHistory} from "react-router-dom"; //allows to interact with history of what has happened or will happen in URL bar
import UserContext from "../../context/UserContext"; 

export default function AuthOptions() {
    const {userData, setUserData} = useContext(UserContext); //returns the context by the context provider 
    
    const history = useHistory();
    const imageStyle={margin: "10px"};

    const register = () => history.push("/register");
    const login = () => history.push("/login");
    const about = () => history.push("/about");
    const logout = () => { //when we click the logout button, user and token goes back to undefined
        setUserData({
            token: undefined,
            user: undefined
        });
        localStorage.setItem("auth-token", "");
        history.push("/");
    }


    return (
        <nav className="auth-option">
            { //conditional rendering of buttons, if we have a logged in user(if userData exists) then we render only logout button, otherwise the other 2
                userData.user ? (
                <>
                <button onClick={about}>About</button>
                <i class="fa fa-user fa-2x" style={imageStyle}></i>
                <h5>{userData.user.displayName}</h5>
                <button onClick={logout}>Logout</button>
                </> ) : (
            <>
            <button onClick={about}>About</button>
            <button onClick={register}>Sign in</button>
            <button onClick={login}>Login</button>
            
            </>
            )}
        </nav>
    )
}




