import React from "react"
import { NextPage } from "next"
import { Router, useRouter } from "next/router"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { AuthenticationForm } from "feather-client-react"

import withLayout from "../../hocs/withLayout"

interface Props {}

const AuthForm: NextPage<Props> = ({}) => {
  return <AuthenticationForm />
}

export default withLayout(AuthForm)
