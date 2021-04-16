import React, {useState, useContext} from "react";
import {useHistory} from "react-router-dom";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import ErrorNotice from "../misc/ErrorNotice";

export default function Login() {
    const [email, setEmail] = useState(); //undefined by default
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const {setUserData} = useContext(UserContext); //our provider
    const history = useHistory();

    const submit = async (e) => { //when submitting login form
        e.preventDefault();
        try{
        const loginUser = {email, password};
        const loginRes = await Axios.post("http://localhost:5000/users/login", loginUser);
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
        catch(err){
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <div className="page">
            <h2><i>Σύνδεση χρήστη</i></h2>
            {error && <ErrorNotice message={error} clearError={() => setError(undefined)}/>}
            <form className="form" onSubmit={submit}>
                <label htmlFor="login-email">Email:</label>
                <div className="form-items">
                <i class="fa fa-envelope fa-2x"></i>
                <input id="login-email" type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} /> {/*on change event, dld when u get a new email in input form, setEmail on the new value */}
                </div>
                <label htmlFor="login-password">Κωδικός πρόσβασης:</label>
                <div className="form-items">
                <i class="fa fa-key fa-2x"></i>
                <input id="login-password" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <input type="submit" value="Σύνδεση" />
            </form>
        </div>
    )
}