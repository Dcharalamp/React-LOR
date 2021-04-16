import React from "react";

export default function ErrorNotice(props) { //it will returns something(props), which is the error msg
    return (
        <div className="error-notice">
            <span className="error-msg">{props.message}</span>
            <button onClick={props.clearError}>X</button> {/*the button will close the error msg */}

        </div>
    )



}