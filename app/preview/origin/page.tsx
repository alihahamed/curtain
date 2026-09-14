import { Demo, light } from './demo'

export default function A() {
  return (
    <Demo tone={light} step="one" href="/preview/origin/b" title="The next page opens out of the thing you clicked.">
      A window the size, shape and colour of the link grows into the page. Nothing is configured: the
      rectangle, the corners and the colour are read from the link at the moment you click it.
    </Demo>
  )
}
