import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import Axios from "axios";
import ErrorNotice from "../misc/ErrorNotice";
import FileUpload from "../misc/FileUpload";


export default function OntRegister() {

    
    //set the state
    const [id, setId] = useState();
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [identifier, setIdentifier] = useState();
    const [keyword, setKeyword] = useState([]);
    const [error, setError] = useState(); //error handling 

    const history = useHistory();

    const submit = async (e) => { //when submitting register form
        e.preventDefault();
        
        
        try {
            
        const newOntology = {id, title, description, identifier, keyword};
        await Axios.post("http://localhost:5000/ont/ontologySubmit", newOntology); //axios fills the fields with the values and writes entry to mongoDB
        history.push("/"); //after we submit the new ontology, redirect back to ontology pagination page 
    }
    catch(err) { //if there's an error we catch it
        err.response.data.msg && setError(err.response.data.msg); //if both are true, error state is updated with the error message that shows up

    }
    };





    return(
        <div className="ontRpage">
            <FileUpload/>
            <h2>Register Object</h2>
            {error && <ErrorNotice message={error} clearError={() => setError(undefined)}/>}
            <form className="form" onSubmit={submit}>
                <label htmlFor="register-email">ID</label>
                <input id="register-email" type="text" onChange={(e) => setId(e.target.value)} />

                <label htmlFor="register-password">Title</label>
                <input id="register-password" type="text" onChange={(e) => setTitle(e.target.value)} />

                <label htmlFor="register-display-name">Description</label>
                <input id="register-display-name" type="text" onChange={(e) => setDescription(e.target.value)} />

                <label htmlFor="register-display-name">Identifier</label>
                <input id="register-display-name" type="text" onChange={(e) => setIdentifier(e.target.value)} />

                <label htmlFor="register-display-name">Keywords</label>
                <input type="text" placeholder="For more than 1 keyword, seperate with comma" onChange={(e) => setKeyword(e.target.value.split(","))}/>
                <input  type="submit" value="Register" />
            </form>
        </div>
    )
}