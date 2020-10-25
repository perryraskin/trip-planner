import React, { useState, useEffect, useContext } from "react"
import { NextPage, GetServerSideProps } from "next"
import absoluteUrl from "next-absolute-url"

import TripForm from "../../../components/Forms/TripForm"

interface Props {}

const EditTrip: NextPage<Props> = ({}) => {
  return <TripForm />
}

export default EditTrip
