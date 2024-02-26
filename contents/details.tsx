import type {
  PlasmoCSConfig,
  PlasmoCSUIJSXContainer,
  PlasmoRender
} from "plasmo"
import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"

import { DownloadButton } from "~components/downloadButton"

import "./style.css"

import wcmatch from "wildcard-match"

export const config: PlasmoCSConfig = {
  matches: ["https://*.youtube.com/*"]
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
  }, [anchor.element, window.location.href])

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

  const config = { attributes: true, childList: true, subtree: true }

  let oldUrl: string
  let root

  const callback = (mutationList, observer) => {
    if (oldUrl !== window.location.href) {
      oldUrl = window.location.href

      const targetNode = document.querySelector(".ytp-chrome-top")

      if (!root) {
        root = createRoot(rootContainer)
      }

      const isMatch = wcmatch("https://www.youtube.com/watch*", {
        separator: "."
      })
      const isMatchingUrl = isMatch(window.location.href)

      if (isMatchingUrl && targetNode.children.length) {
        root.render(<DetailsPage anchor={anchor} />)
      } else {
        if (root) {
          root.unmount()
          root = null
        }
      }
    }
  }

  const observer = new MutationObserver(callback)

  observer.observe(document.querySelector("body"), config)
}

export default DetailsPage
