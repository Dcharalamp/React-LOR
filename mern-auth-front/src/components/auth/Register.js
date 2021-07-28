import React, {useState, useContext} from "react";
import {useHistory} from "react-router-dom";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import ErrorNotice from "../misc/ErrorNotice";
export default function Register() {
    //set the state
    const [email, setEmail] = useState(); //undefined by default
    const [password, setPassword] = useState();
    const [passwordCheck, setPasswordCheck] = useState();
    const [displayName, setDisplayName] = useState();
    const [isAdmin, setIsAdmin] = useState(false); //checkbox,also works for axios field
    const [error, setError] = useState(); //state for error handling

    const {setUserData} = useContext(UserContext); //our provider
    const history = useHistory();


    const submit = async (e) => { //when submitting register form
        e.preventDefault();
        try {
        const newUser = {email, password, passwordCheck, displayName, isAdmin};
        await Axios.post("http://localhost:5000/users/register", newUser); //axios fills the fields with the values and writes entry to mongoDB
        const loginRes = await Axios.post("http://localhost:5000/users/login", {email, password}); //after registration, user is automatically logged in with the given fields
        setUserData({ //user is logged in now, so we update the fields(for logout button purposes)
            token: loginRes.data.token,
            user: loginRes.data.user,
        });
        localStorage.setItem("auth-token", loginRes.data.token); //update local storage
        if(loginRes.data.user.isAdmin){
        history.push("/"); //after we login we return to home page 
        }else{
            history.push("/user-dash");
        }
    }
    catch(err) { //if there's an error we catch it
        err.response.data.msg && setError(err.response.data.msg); //if both are true, error state is update with the error message that shows up

    }
    };


    return (
        <div className="page">
            <h2>Registration</h2>
            {/*if there's an error show the error and make error state undefined */}
            {error && <ErrorNotice message={error} clearError={() => setError(undefined)}/>}
            <form className="form" onSubmit={submit}>
                <label htmlFor="register-email">Email:</label>
                <div className="form-items">
                <i class="fa fa-envelope fa-2x"></i>
                <input id="register-email" type="email" onChange={(e) => setEmail(e.target.value)} /> {/*on change event, dld when u get a new email in input form, setEmail on the new value */}
                </div>
                <label htmlFor="register-password">Password:</label>
                <div className="form-items">
                <i class="fa fa-key fa-2x"></i>
                <input id="register-password" type="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <input type="password" placeholder="Verify Password" onChange={(e) => setPasswordCheck(e.target.value)}/>
                <label htmlFor="register-display-name">Username:</label>
                <div className="form-items">
                <i class="fa fa-user fa-2x"></i>
                <input id="register-display-name" type="text" onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div className="checkbox-container"> {/*TODO styling for inline content */}
                <input
                    className="checkbox-style"
                    name="example_1"
                    value={true}
                    type="checkbox"
                    onChange={e => {
                        setIsAdmin(e.target.checked); console.log(isAdmin);
                      }}/><label className="label">I want admin rights</label></div>
                <input type="submit" value="Register" />
            </form>
        </div>
    )
}