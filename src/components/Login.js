import React from "react"
import { useCallback } from "react";
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode  from 'jwt-decode';
import UserDataService from "../services/users"

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

function Login({ setUser }) {

  //Insert or update user in database by calling UserDataService api
  const updateUser = useCallback((userData) => {
    UserDataService.updateUser(userData)
    .catch((e) => {
      console.log(e)
    })
  }, [])

  // on succesful login 
  const onSuccess = (res) => {
    var tokenData = jwt_decode(res.credential)
    var loginData = {
      googleId: tokenData.sub,
      ...tokenData
    }
    setUser(loginData)
    updateUser(loginData)
    localStorage.setItem("login", JSON.stringify(loginData))  
    console.log("Logged in succesfully.")
    
  }

  // on failure, just log the result
  const onFailure = (res) => {
    console.log(`Login failed. Response: ${res}`)
  }

  // JSX
  return (
    <div> 
      <GoogleLogin 
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        style={{ marginTop : "100px"}}
        isSigned={true}
        auto_select={true}
      />
    </div>
  )
}

export default Login

