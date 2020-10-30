import React from "react"
import { NextPage } from "next"
import { Router, useRouter } from "next/router"
import { useQuery, useMutation, queryCache } from "react-query"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

import withLayout from "../../hocs/withLayout"
import utilities from "../../utilities"

import Section from "../Layout/Section"
import Button from "../Elements/Button"

import { Trip, TripNote, TripNoteType } from "../../models/interfaces"

interface Props {}

async function fetchTripRequest() {
  const pathname = window.location.pathname
  const tripNoteIndex = pathname.indexOf("tripnote")
  const tripPathname = pathname.substring(0, tripNoteIndex)
  const tripId = tripPathname.replace(/[^\d.]/g, "")
  const res = await fetch(`/api/trip/${tripId}`)
  const data = await res.json()
  const { trip } = data
  return trip
}

const TripNoteForm: NextPage<Props> = ({}) => {
  const router = useRouter()
  const now = dayjs()
  const { data: trip } = useQuery("trip", fetchTripRequest)
  const currentTrip: Trip = trip
  const { data: tripNote } = useQuery("tripnote", fetchTripNoteRequest)
  const currentTripNote: TripNote = tripNote
  const [title, setTitle] = React.useState(
    currentTripNote ? currentTripNote.title : ""
  )
  const [subtitle, setSubtitle] = React.useState(
    currentTripNote ? currentTripNote.subtitle : ""
  )
  const [tag, setTag] = React.useState(
    currentTripNote ? currentTripNote.tag : ""
  )
  const [type, setType] = React.useState(
    currentTripNote ? currentTripNote.tripNoteType : "1"
  )
  const [price, setPrice] = React.useState("0")
  const [currency, setCurrency] = React.useState("")

  async function fetchTripNoteRequest() {
    if (!window.location.pathname.includes("new")) {
      const pathname = window.location.pathname
      const tripNoteIndex = pathname.indexOf("tripnote")
      const tripNotePathname = pathname.substring(tripNoteIndex)
      const tripNoteId = tripNotePathname.replace(/[^\d.]/g, "")
      const res = await fetch(`/api/tripnote/${tripNoteId}`)
      const data = await res.json()
      const { tripNote } = data
      setTitle(tripNote.title)
      setSubtitle(tripNote.subtitle)
      setTag(tripNote.tag)
      setType(tripNote.tripNoteType)
      return tripNote
    }
  }

  async function sendTripNoteData(e, tripNoteData) {
    e.preventDefault()
    let apiUrl = "/api/tripNotes/create"
    let fetchMethod = "POST"
    if (tripNote) {
      apiUrl = `/api/tripnote/${tripNote.id}/update`
      fetchMethod = "PUT"
    }
    const res = await fetch(apiUrl, {
      method: fetchMethod,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tripNoteData)
    })
    if (res) {
      console.log(res)
      res.json().then(res => {
        const { tripNoteResponse } = res
        router.push(
          `/trip/${tripNoteResponse.tripId}/tripnote/${tripNoteResponse.id}`
        )
      })
    }
  }
  return (
    <Section>
      <div className="flex-1 min-w-0">
        <div>
          <h2 className="mt-6 text-3xl leading-9 font-extrabold">
            {currentTrip ? currentTrip.nickname : ""}
          </h2>
        </div>
        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap">
          <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
            {/* Heroicon name: calendar */}
            <svg
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            {trip ? dayjs.utc(currentTrip.dateStart).format("MM/DD/YYYY") : ""}{" "}
            to {trip ? dayjs.utc(currentTrip.dateEnd).format("MM/DD/YYYY") : ""}
          </div>
        </div>
      </div>
      <div>
        <div className="hidden sm:block">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {currentTripNote ? "Edit" : "New"} Trip Note
                </h3>
                <p className="mt-1 text-sm leading-5 text-gray-600">
                  Here you can provide details of a Trip Note. A good example
                  would be a specific type of hotel room (e.g. King Bed Ocean
                  Front).
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form action="#" method="POST">
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium leading-5 text-gray-700">
                          Title
                        </label>
                        <input
                          className="mt-1 form-input block w-full py-2 px-3 
                          border border-gray-300 rounded-md shadow-sm 
                          focus:outline-none focus:shadow-outline-blue focus:border-blue-300 
                          transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          placeholder="King Bed Ocean Front"
                          onChange={e => setTitle(e.target.value)}
                          value={title}
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium leading-5 text-gray-700">
                          Subtitle
                        </label>
                        <input
                          className="mt-1 form-input block w-full py-2 px-3 
                          border border-gray-300 rounded-md shadow-sm focus:outline-none 
                          focus:shadow-outline-blue focus:border-blue-300 transition 
                          duration-150 ease-in-out sm:text-sm sm:leading-5"
                          placeholder="Ground Floor"
                          onChange={e => setSubtitle(e.target.value)}
                          value={subtitle}
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-4">
                        <label className="block text-sm font-medium leading-5 text-gray-700">
                          Tag
                        </label>
                        <input
                          className="mt-1 form-input block w-full py-2 px-3 
                          border border-gray-300 rounded-md shadow-sm 
                          focus:outline-none focus:shadow-outline-blue focus:border-blue-300 
                          transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          placeholder="hotel-room"
                          onChange={e => setTag(e.target.value)}
                          value={tag}
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium leading-5 text-gray-700">
                          Type
                        </label>
                        <select
                          className="mt-1 block form-select w-full py-2 px-3 border 
                          border-gray-300 bg-white rounded-md shadow-sm 
                          focus:outline-none focus:shadow-outline-blue focus:border-blue-300 
                          transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          onChange={e =>
                            setType(parseInt(e.target.value) as TripNoteType)
                          }
                          value={type}
                        >
                          <option value={TripNoteType.Lodging}>Lodging</option>
                          <option value={TripNoteType.Transit}>Transit</option>
                          <option value={TripNoteType.Excursion}>
                            Excursion
                          </option>
                        </select>
                      </div>
                      {/* <div className="col-span-6">
                        <label className="block text-sm font-medium leading-5 text-gray-700">
                          Location
                        </label>
                        <input className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                      </div>
                      <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                        <label className="block text-sm font-medium leading-5 text-gray-700">
                          Price
                        </label>
                        <input
                          className="mt-1 form-input block w-full py-2 px-3 
                          border border-gray-300 rounded-md shadow-sm 
                          focus:outline-none focus:shadow-outline-blue focus:border-blue-300 
                          transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          onChange={e => setPrice(e.target.value)}
                          value={
                            currentTripNote ? currentTripNote.tag : ""
                          }
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label className="block text-sm font-medium leading-5 text-gray-700">
                          Currency
                        </label>
                        <input
                          className="mt-1 form-input block w-full py-2 px-3 
                          border border-gray-300 rounded-md shadow-sm 
                          focus:outline-none focus:shadow-outline-blue focus:border-blue-300 
                          transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        />
                      </div> */}
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-center sm:px-6">
                    <button
                      className="py-2 px-4 border border-transparent text-sm 
                    leading-5 font-medium rounded-md text-white bg-blue-600 
                    shadow-sm hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue 
                    active:bg-blue-600 transition duration-150 ease-in-out w-full sm:w-1/4"
                      onClick={e =>
                        sendTripNoteData(e, {
                          tripNote: {
                            tripId: currentTrip.id,
                            tripNoteType: type,
                            tag,
                            title,
                            subtitle
                          }
                        })
                      }
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default withLayout(TripNoteForm)
