import cssText from "data-text:~contents/style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo"
import { useEffect, useState } from "react"

import { DownloadButton } from "~components/downloadButton"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/"]
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

export default HomePage
