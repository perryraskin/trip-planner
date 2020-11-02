import React from "react"
import { NextPage } from "next"
import { Router, useRouter } from "next/router"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

import withLayout from "../../hocs/withLayout"

interface Props {}

const VerifyEmail: NextPage<Props> = ({}) => {
  return (
    <div>
      <p className="mt-6 text-xl leading-9 font-extrabold">
        Please click here to verify your email.
      </p>
    </div>
  )
}

export default withLayout(VerifyEmail)
