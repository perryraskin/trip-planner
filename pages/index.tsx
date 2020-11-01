import React, { useState, useEffect, useContext } from "react"
import { NextPage } from "next"
import { AuthenticationForm, useCurrentUser } from "feather-client-react"

import Home from "../components/Home/Home"

interface Props {}

const HomePage: NextPage<Props> = ({}) => {
  // const { loading, currentUser } = useCurrentUser()
  // if (loading) return <div />
  // if (!currentUser) return <AuthenticationForm />
  // return <div className="App">Current user: {JSON.stringify(currentUser)}</div>
  return <Home />
}

export default HomePage
