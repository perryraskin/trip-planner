import React, { useState, useEffect, useContext } from "react"
import { NextPage, GetServerSideProps } from "next"
import absoluteUrl from "next-absolute-url"

import TripDetail from "../../components/TripDetail/TripDetail"

import { Trip, TripNote } from "../../components/Home/Home"

interface Props {
  trip?: Trip
  tripNotes?: Array<TripNote>
  errors?: any
}

const TripDetailPage: NextPage<Props> = ({ trip, tripNotes, errors }) => {
  let tripObject = trip
  tripObject.tripNotes = tripNotes
  return <TripDetail trip={trip} />
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { req, params } = ctx
  const { tripid } = params
  const { origin } = absoluteUrl(req)
  const apiUrl = `${origin}/api/trip/${tripid}`
  // const cookies = parseCookies(ctx)
  // const { sessionId } = cookies
  //console.log('cookies:', cookies);
  //console.log('sessionId:', sessionId);
  const res = await fetch(apiUrl)
  const resData = await res.json()
  const { trip, tripNotes } = resData
  //console.log('res:', trip);

  if (trip) {
    return {
      props: {
        trip,
        tripNotes
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

export default TripDetailPage
