import '../index.css'
import React from "react"

function Logindiv(p) {

    function clicklogin() {
        window.location.replace("https://discord.com/api/oauth2/authorize?client_id=919636857459986523&redirect_uri=https%3A%2F%2Fwardennavy.com%2Fdata%2Fauth&response_type=code&scope=identify%20guilds.members.read");
    }

    return (
        <>
            <div className="login_div">
                <div className="login_wrapper" >
                    <p className="login_p">Please login to check if you are a real Navyman</p>
                    <button className="login_button" onClick={clicklogin}> Discord Login </button>
                </div>
            </div>

        </>
    )
}

export default Logindiv;
