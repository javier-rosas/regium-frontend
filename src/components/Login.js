import React from "react"
import { useCallback } from "react";
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode  from 'jwt-decode';
import UserDataService from "../services/users"

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

function Login({ setUser }) {


  const getUser = useCallback( async (googleId, loginData) => {
    try {
      const user = await UserDataService.getUser(googleId)
      return user.data
    } catch(e) {
      //return {...loginData, balance : 10}
      return e
    }
  }, [])

  

  // on succesful login 
  const onSuccess = (res) => {
    var tokenData = jwt_decode(res.credential)
    var loginData = {
      googleId: tokenData.sub,
      ...tokenData
    }

    getUser(loginData.googleId).then((res) => {
      if (Array.isArray(res) && res.length === 0) {
        console.log("jere")
        loginData.balance = 10 
        UserDataService.updateUser(loginData)
        .catch((e) => {
          console.log(e)
        })
      }
    })

    console.log("loginData", loginData)
    setUser(loginData)
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

