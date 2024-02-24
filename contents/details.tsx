import type {
  PlasmoCSConfig,
  PlasmoCSUIJSXContainer,
  PlasmoRender
} from "plasmo"
import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"

import { DownloadButton } from "~components/downloadButton"

import "./style.css"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/watch*"]
}

export const getRootContainer = () =>
  new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const rootContainerParent = document.querySelector(`.ytp-chrome-top`)
      if (rootContainerParent) {
        clearInterval(checkInterval)
        const rootContainer = document.createElement("div")
        rootContainer.style.width = "100%"
        rootContainerParent.prepend(rootContainer)
        resolve(rootContainer)
      }
    }, 137)
  })

const DetailsPage = ({ anchor }) => {
  const [videoId, setVideoId] = useState("")
  const [videoTitle, setVideoTitle] = useState("")

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(
        new URL(window.location.href).search
      )
      const title = anchor.element.querySelector(".ytp-title-link").innerText

      const videoId = urlParams.get("v")
      setVideoId(videoId)
      setVideoTitle(title)
    } catch {
      console.log("video is not supported")
    }
  }, [anchor.element])

  return (
    <div className="home-button-position">
      <DownloadButton videoId={videoId} videoTitle={videoTitle} />
    </div>
  )
}

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({
  anchor,
  createRootContainer
}) => {
  const rootContainer = await createRootContainer()
  const root = createRoot(rootContainer)
  root.render(<DetailsPage anchor={anchor} />)
}

export default DetailsPage
