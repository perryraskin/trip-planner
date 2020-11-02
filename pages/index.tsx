import React, { useState, useEffect, useContext } from "react"
import { NextPage } from "next"
import { useCurrentUser } from "feather-client-react"

import Home from "../components/Home/Home"
import AuthForm from "../components/Forms/AuthForm"

interface Props {}

const HomePage: NextPage<Props> = ({}) => {
  const { loading, currentUser } = useCurrentUser()
  if (loading) return <div />
  if (!currentUser) return <AuthForm />
  //return <div className="App">Current user: {JSON.stringify(currentUser)}</div>
  return <Home />
}

export default HomePage
