import { NextPage } from "next"
import Container from "./Container"

interface Props {
  children: any
  extend?: string
}

const Section: NextPage<Props> = ({ children, extend }) => {
  return (
    <section className={`mb-20 w-full py-12 px-4 ${extend}`}>
      <Container>{children}</Container>
    </section>
  )
}

export default Section
