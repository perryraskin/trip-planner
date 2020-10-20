import React from "react"
import { NextPage } from "next"
import { Router, useRouter } from "next/router"
import { useQuery, useMutation, queryCache } from "react-query"

import withLayout from "../../hocs/withLayout"
import utilities from "../../utilities"

import Section from "../Layout/Section"
import Button from "../Elements/Button"

import dayjs from "dayjs"

interface Props {}

const NewTripForm: NextPage<Props> = ({}) => {
  const router = useRouter()
  const now = dayjs()
  const [nickname, setNickname] = React.useState("")
  const [dateStart, setDateStart] = React.useState(now.format("YYYY-MM-DD"))
  const [dateEnd, setDateEnd] = React.useState(
    now.add(1, "day").format("YYYY-MM-DD")
  )

  async function sendTripData(e, tripData) {
    e.preventDefault()
    const res = await fetch("/api/trips/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tripData)
    })
    res.json().then(res => {
      console.log(res)
      router.push("/")
    })
  }
  return (
    <Section extend="mb-20 w-full py-12 px-4">
      <div>
        <h2 className="mt-6 text-3xl leading-9 font-extrabold">New Trip</h2>
      </div>
      <form className="mt-8">
        <input type="hidden" name="remember" value="true" />
        <div>
          <div>
            <label className="mt-6 leading-9 font-semibold">Nickname</label>
            <input
              aria-label="Nickname"
              name="nickname"
              type="text"
              required
              className="appearance-none rounded relative block w-full px-3 py-2 
              border border-gray-300 placeholder-gray-500 mb-4
              focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 
              sm:text-sm sm:leading-5"
              placeholder="Our Hawaii Honeymoon"
              onChange={e => setNickname(e.target.value)}
            />
          </div>
          <div className="-mt-px">
            <label className="mt-6 leading-9 font-semibold">Date Start</label>
            <input
              aria-label="Date start"
              name="date_start"
              type="date"
              required
              className="appearance-none rounded relative block w-full px-3 py-2 
              border border-gray-300 placeholder-gray-500 mb-4 focus:outline-none 
              focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
              defaultValue={now.format("YYYY-MM-DD")}
              onChange={e => setDateStart(e.target.value)}
            />
          </div>
          <div className="-mt-px">
            <label className="mt-6 leading-9 font-semibold">Date End</label>
            <input
              aria-label="Date end"
              name="date_end"
              type="date"
              required
              className="appearance-none rounded relative block w-full px-3 py-2 
              border border-gray-300 placeholder-gray-500 focus:outline-none focus:shadow-outline-blue 
              focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
              defaultValue={now.add(1, "day").format("YYYY-MM-DD")}
              onChange={e => setDateEnd(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-10">
          <button
            className="group relative w-full flex justify-center py-2 px-4 
            border border-transparent text-sm leading-5 font-medium 
            rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none 
            focus:border-blue-700 focus:shadow-outline-indigo active:bg-indigo-700 
            transition duration-150 ease-in-out text-lg md:text-base"
            onClick={e =>
              sendTripData(e, {
                trip: {
                  nickname,
                  dateStart,
                  dateEnd
                }
              })
            }
          >
            Tripnotize me cap'n!
          </button>
        </div>
      </form>
    </Section>
  )
}

export default withLayout(NewTripForm)
