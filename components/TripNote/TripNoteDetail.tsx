import React from "react"
import { NextPage } from "next"
import Link from "next/link"
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

interface Props {
  tripNote: TripNote
}

const TripNoteDetail: NextPage<Props> = ({ tripNote }) => {
  const router = useRouter()
  const now = dayjs()

  async function confirmDelete(tripNoteId: number) {
    const choseToDelete = window.confirm("Delete Trip Note?")
    if (choseToDelete) {
      const res = await fetch(`/api/tripnote/${tripNoteId}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await res.json()
      if (!data.error) {
        console.log(data)
        document.getElementById(tripNoteId.toString()).remove()
      }
    }
  }
  return (
    <Section extend="mb-20 w-full py-12 px-4">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <div>
            <h2 className="mt-6 text-3xl leading-9 font-extrabold">
              {tripNote.title}
              <span
                className="sm:ml-6 ml-2 px-4 py-1 inline-flex text-sm leading-5 
                                font-semibold rounded-full bg-indigo-100 text-indigo-800"
              >
                {tripNote.tripNoteType === TripNoteType.Lodging
                  ? "Lodging"
                  : ""}
              </span>
            </h2>
          </div>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap">
            <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
              <span className="mb-6">
                {tripNote.subtitle} [{tripNote.tag}]
              </span>
            </div>
          </div>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <span className="shadow-sm rounded-md">
            <Link
              href="/trip/[tripid]/tripnote/[tripnoteid]/edit"
              as={`/trip/${tripNote.tripId}/tripnote/${tripNote.id}/edit`}
            >
              <a
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 
              text-sm leading-5 font-medium rounded-md text-gray-700 bg-white 
              hover:text-gray-500 focus:outline-none focus:shadow-outline-blue 
              focus:border-blue-300 active:text-gray-800 active:bg-gray-50 
              transition duration-150 ease-in-out"
              >
                {/* Heroicon name: pencil */}
                <svg
                  className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </a>
            </Link>
          </span>
          <span className="ml-3 shadow-sm rounded-md">
            <Link href={`/trip/${tripNote.Trip.id}/tripnote/new`}>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent 
              text-sm leading-5 font-medium rounded-md text-white 
              bg-blue-600 hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue 
              focus:border-blue-700 active:bg-blue-700 transition duration-150 ease-in-out"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Item
              </button>
            </Link>
          </span>
        </div>
      </div>
    </Section>
  )
}

export default withLayout(TripNoteDetail)
