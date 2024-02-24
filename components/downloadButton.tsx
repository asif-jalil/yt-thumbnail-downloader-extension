import downloadIcon from "data-base64:~assets/download.svg"
import { useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

export const DownloadButton = ({ videoId, videoTitle }) => {
  const [isOpen, setIsOpen] = useState(false)

  const download = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    videoType: string
  ) => {
    e.stopPropagation()

    await sendToBackground({
      name: "download",
      body: {
        videoId,
        videoTitle,
        videoType
      }
    })
  }

  const handleOption = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()

    setIsOpen((prev) => !prev)
  }

  window.addEventListener("click", () => {
    setIsOpen(false)
  })

  return (
    <div className="wrapper">
      <button onClick={handleOption} type="button" className="download-btn">
        <img src={downloadIcon} alt="download" width={20} height={20} />
      </button>
      <div className={`size-wrapper ${isOpen ? "open" : ""}`}>
        <button
          className="size-btn"
          onClick={(e) => download(e, "maxresdefault")}>
          FHD
        </button>
        <button className="size-btn" onClick={(e) => download(e, "sddefault")}>
          SD
        </button>
        <button className="size-btn" onClick={(e) => download(e, "hqdefault")}>
          Medium
        </button>
        <button className="size-btn" onClick={(e) => download(e, "mqdefault")}>
          Normal
        </button>
        <button className="size-btn" onClick={(e) => download(e, "default")}>
          Small
        </button>
      </div>
    </div>
  )
}
