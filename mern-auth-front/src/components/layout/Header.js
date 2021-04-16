import React, {useContext} from "react";
import {Link} from "react-router-dom"; //the a tag doesnt interact with react-router, so we use this
import AuthOptions from "../auth/AuthOptions";
import UserContext from "../../context/UserContext";


export default function Header() {
    const {userData, setUserData} = useContext(UserContext);

    if(!userData.user){
        return (
            <header id="header">
                <Link to="/login" style={{textDecoration:'none'}}><h1 className="title">Ψηφιακή Βιβλιοθήκη Μαθησιακών Αντικειμένων</h1></Link>
                <AuthOptions/>
            </header>
        )
    }else{
        if(userData.user.isAdmin){
            return (
        
                <header id="header">
                    <Link to="/" style={{textDecoration:'none'}}><h1 className="title">Ψηφιακή Βιβλιοθήκη Μαθησιακών Αντικειμένων</h1></Link>
                    <AuthOptions/>
                </header>
            )
        }else{
            return (
        
                <header id="header">
                    <Link to="/user-dash" style={{textDecoration:'none'}}><h1 className="title">Ψηφιακή Βιβλιοθήκη Μαθησιακών Αντικειμένων</h1></Link>
                    <AuthOptions/>
                </header>
            )
        }
    }
    
}