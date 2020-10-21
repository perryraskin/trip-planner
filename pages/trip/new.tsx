import React, { useState, useEffect, useContext } from "react"
import { NextPage } from "next"
import TripForm from "../../components/Forms/TripForm"

interface Props {}

const NewTrip: NextPage<Props> = ({}) => {
  return <TripForm />
}

export default NewTrip
