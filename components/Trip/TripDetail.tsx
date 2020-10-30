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
  trip: Trip
}

const TripDetail: NextPage<Props> = ({ trip }) => {
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
      <div className="uppercase text-xxs font-semibold">
        <Link href="/">
          <a>Trips</a>
        </Link>{" "}
        / {trip.nickname}
      </div>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <div>
            <h2 className="mt-6 text-3xl leading-9 font-extrabold">
              {trip.nickname}
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
              {dayjs.utc(trip.dateStart).format("MM/DD/YYYY")} to{" "}
              {dayjs.utc(trip.dateEnd).format("MM/DD/YYYY")}
            </div>
          </div>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <span className="shadow-sm rounded-md">
            <Link href="/trip/[tripid]/edit" as={`/trip/${trip.id}/edit`}>
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
            <Link href={`/trip/${trip.id}/tripnote/new`}>
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
                Trip Note
              </button>
            </Link>
          </span>
        </div>
      </div>

      {/* TRIP NOTES */}
      <div>
        <h2 className="mt-6 text-xl leading-9 font-extrabold">Trip Notes</h2>
      </div>
      <div className="flex flex-col mt-8">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th> */}
                    <th className="px-6 py-3 bg-gray-50"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trip.TripNotes
                    ? trip.TripNotes.map((tripNote: TripNote) => {
                        return (
                          <tr
                            key={tripNote.id}
                            id={tripNote.id.toString()}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-no-wrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSUx2RGlMheX8joff0V1fQ-L3wCIDn67HuNSw&usqp=CAU"
                                    alt=""
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm leading-5 font-medium text-gray-900">
                                    <Link
                                      href="/trip/[tripid]/tripnote/[tripnoteid]"
                                      as={`/trip/${tripNote.tripId}/tripnote/${tripNote.id}`}
                                    >
                                      <a>{tripNote.title}</a>
                                    </Link>
                                  </div>
                                  <div className="text-sm leading-5 text-gray-500">
                                    {tripNote.subtitle}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap">
                              <div className="text-sm leading-5 text-gray-900">
                                <span
                                  className="px-2 inline-flex text-xs leading-5 
                                font-semibold rounded-full bg-indigo-600 text-white"
                                >
                                  {tripNote.tripNoteType ===
                                  TripNoteType.Lodging
                                    ? "Lodging"
                                    : ""}
                                </span>
                              </div>
                              {/* <div className="text-sm leading-5 text-gray-500">
                          Optimization
                        </div> */}
                            </td>
                            <td className="text-sm px-6 py-4 whitespace-no-wrap">
                              ${0}
                            </td>
                            {/* <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                        Admin
                      </td> */}
                            <td
                              className="px-6 py-4 whitespace-no-wrap text-right 
                            text-sm leading-5 font-medium"
                            >
                              <Link
                                href="/trip/[tripid]/tripnote/[tripnoteid]/edit"
                                as={`/trip/${tripNote.tripId}/tripnote/${tripNote.id}/edit`}
                              >
                                <a className="text-blue-600 hover:text-blue-900 mr-4">
                                  Edit
                                </a>
                              </Link>
                              <a
                                href="#"
                                className="text-red-600 hover:text-red-900"
                                onClick={() => confirmDelete(tripNote.id)}
                              >
                                Delete
                              </a>
                            </td>
                          </tr>
                        )
                      })
                    : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default withLayout(TripDetail)
