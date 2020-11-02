import React, { useState, useEffect, useContext } from "react"
import { NextPage, GetServerSideProps } from "next"
//import absoluteUrl from "next-absolute-url"

import TripNoteForm from "../../../../../components/Forms/TripNoteForm"

interface Props {}

const EditTripNote: NextPage<Props> = ({}) => {
  return <TripNoteForm />
}

export default EditTripNote
