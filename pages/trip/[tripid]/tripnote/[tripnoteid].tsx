import React, { useState, useEffect, useContext } from "react"
import { NextPage, GetServerSideProps } from "next"
import absoluteUrl from "next-absolute-url"

import TripNoteDetail from "../../../../components/TripNote/TripNoteDetail"

import { Trip, TripNote } from "../../../../models/interfaces"

interface Props {
  tripNote?: TripNote
  errors?: any
}

const TripNoteDetailPage: NextPage<Props> = ({ tripNote, errors }) => {
  return <TripNoteDetail tripNote={tripNote} />
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { req, params } = ctx
  const { tripid, tripnoteid } = params
  const { origin } = absoluteUrl(req)
  const apiUrl = `${origin}/api/tripnote/${tripnoteid}`
  // const cookies = parseCookies(ctx)
  // const { sessionId } = cookies
  //console.log('cookies:', cookies);
  //console.log('sessionId:', sessionId);
  const res = await fetch(apiUrl)
  const resData = await res.json()
  const { tripNote } = resData
  //console.log("res:", tripNote)

  if (tripNote) {
    return {
      props: {
        tripNote
      }
    }
  } else {
    return {
      props: {
        errors: "Not logged in!"
      }
    }
  }
}

export default TripNoteDetailPage
