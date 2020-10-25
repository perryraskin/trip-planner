import React, { useState, useEffect, useContext } from "react"
import { NextPage, GetServerSideProps } from "next"
import absoluteUrl from "next-absolute-url"

import TripDetail from "../../../../components/Trip/TripDetail"

import { Trip, TripNote } from "../../../../models/interfaces"

interface Props {
  trip?: Trip
  errors?: any
}

const TripNoteDetailPage: NextPage<Props> = ({ trip, errors }) => {
  // return <TripDetail trip={trip} />
  return (
    <div>
      <h1>Trip Note Detail</h1>
    </div>
  )
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
  const { trip } = resData
  //console.log("res:", trip)

  if (trip) {
    return {
      props: {
        trip
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
