import React, { useState, useEffect, useContext } from "react"
import { NextPage } from "next"
import TripNoteForm from "../../../../components/Forms/TripNoteForm"

interface Props {}

const NewTripNote: NextPage<Props> = ({}) => {
  return <TripNoteForm />
}

export default NewTripNote
