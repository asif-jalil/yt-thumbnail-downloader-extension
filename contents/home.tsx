import cssText from "data-text:~contents/style.css"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchorList,
  PlasmoRender
} from "plasmo"
import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import wcmatch from "wildcard-match"

import { DownloadButton } from "~components/downloadButton"

export const config: PlasmoCSConfig = {
  matches: ["https://*.youtube.com/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () =>
  document.querySelectorAll("a#thumbnail.ytd-thumbnail")

const HomePage = ({ anchor }) => {
  const [videoId, setVideoId] = useState("")
  const [videoTitle, setVideoTitle] = useState("")

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(new URL(anchor.element.href).search)
      const title =
        anchor.element.parentNode.parentNode.parentNode.querySelector(
          "#video-title-link"
        ).title

      const videoId = urlParams.get("v")
      setVideoId(videoId)
      setVideoTitle(title)
    } catch {
      console.log("video is not supported")
    }
  }, [anchor.element.href])

  return (
    <div className="home-button-position">
      <DownloadButton videoId={videoId} videoTitle={videoTitle} />
    </div>
  )
}

export const render: PlasmoRender<any> = async ({
  anchor,
  createRootContainer
}) => {
  const rootContainer = await createRootContainer({
    type: "inline",
    element: anchor.element
  })

  const config = { attributes: true, childList: true, subtree: true }

  let root

  const callback = async (mutationList, observer) => {
    const targetNode = document.querySelector(
      "#contents.ytd-rich-grid-renderer"
    )

    if (!root) {
      root = createRoot(rootContainer)
    }

    const isMatch = wcmatch("https://www.youtube.com/", {
      separator: "."
    })
    const isMatchingUrl = isMatch(window.location.href)

    if (isMatchingUrl && targetNode?.children.length) {
      root.render(<HomePage anchor={anchor} />)
    } else {
      if (root) {
        root.unmount()
        root = null
      }
    }
  }

  const observer = new MutationObserver(callback)

  observer.observe(document.querySelector("body"), config)
}

export default HomePage
