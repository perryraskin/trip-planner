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

import {
  Trip,
  TripNote,
  TripNoteType,
  TripNoteItem
} from "../../models/interfaces"

interface Props {
  tripNote: TripNote
  setTripNoteItems: (tripNoteItems: Array<TripNoteItem>) => void
  activeItem: number
  setActiveItem: (activeItem: number) => void
  setIsAddingItem: (isAddingItem: boolean) => void
}

const TripNoteItemForm: NextPage<Props> = ({
  tripNote,
  setTripNoteItems,
  activeItem,
  setActiveItem,
  setIsAddingItem
}) => {
  const router = useRouter()
  const now = dayjs()
  const [title, setTitle] = React.useState("")
  const [subtitle, setSubtitle] = React.useState("")
  const [body, setBody] = React.useState("")
  const [isSubmittingItem, setIsSubmittingItem] = React.useState(false)

  async function fetchTripNoteItemRequest() {
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
      setBody(tripNote.tag)
      return tripNote
    }
  }

  async function fetchTripNoteRequest() {
    const res = await fetch(`/api/tripNote/${tripNote.id}`)
    const resData = await res.json()
    const tripNoteResponse: TripNote = resData.tripNote
    setTripNoteItems(tripNoteResponse.TripNoteItems)
    setTitle("")
    setSubtitle("")
    setActiveItem(activeItem)
    setIsAddingItem(false)
  }

  async function sendTripNoteItemData(e, tripNoteItemData) {
    e.preventDefault()
    setIsSubmittingItem(true)
    let apiUrl = "/api/tripNoteItems/create"
    let fetchMethod = "POST"
    // if (tripNote) {
    //   apiUrl = `/api/tripnote/${tripNote.id}/update`
    //   fetchMethod = "PUT"
    // }
    const res = await fetch(apiUrl, {
      method: fetchMethod,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tripNoteItemData)
    })
    if (res) {
      setIsSubmittingItem(false)
      console.log(res)
      res.json().then(res => {
        const { tripNoteItemResponse } = res
        fetchTripNoteRequest()
      })
    }
  }
  return (
    <div>
      <div className="ml-10 mr-10 mt-10 ">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {false ? "Edit" : "New"} Trip Note Item
              </h3>
              <p className="mt-1 text-sm leading-5 text-gray-600">
                Here you can provide details of a Trip Note Item. A good example
                would be a title and/or subtitle of the item. You'll be able to
                add further details and/or photos after the item is created.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form action="#" method="POST">
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 border-2 border-gray-100 sm:p-6">
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
                        placeholder="Photos"
                        onChange={e => setTitle(e.target.value)}
                        value={title}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium leading-5 text-gray-700">
                        Subtitle (optional)
                      </label>
                      <input
                        className="mt-1 form-input block w-full py-2 px-3 
                          border border-gray-300 rounded-md shadow-sm focus:outline-none 
                          focus:shadow-outline-blue focus:border-blue-300 transition 
                          duration-150 ease-in-out sm:text-sm sm:leading-5"
                        placeholder="from my iPhone"
                        onChange={e => setSubtitle(e.target.value)}
                        value={subtitle}
                      />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-center sm:px-6">
                  <button
                    className={`py-2 px-4 border border-transparent text-sm 
                    leading-5 font-medium rounded-md text-white bg-blue-600 
                    shadow-sm hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue 
                    active:bg-blue-600 transition duration-150 ease-in-out w-full sm:w-1/4
                    ${isSubmittingItem ? "spinner" : ""}`}
                    onClick={e =>
                      sendTripNoteItemData(e, {
                        tripNoteItem: {
                          tripNoteId: tripNote.id,
                          title,
                          subtitle
                        }
                      })
                    }
                  >
                    {false ? "Update" : "Next"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripNoteItemForm
