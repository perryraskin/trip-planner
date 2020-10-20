import React, { useState, useEffect, useContext } from "react"
import { NextPage } from "next"
import NewTripForm from "../../components/Forms/NewTripForm"

interface Props {}

const NewTrip: NextPage<Props> = ({}) => {
  return <NewTripForm />
}

export default NewTrip
