import type { PlasmoMessaging } from "@plasmohq/messaging"

import { sanitizeFilename } from "~utils/sanitizeFilename"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const imageUrl = `https://img.youtube.com/vi/${req.body.videoId}/${req.body.videoType}.jpg`
  const title = sanitizeFilename(req.body.videoTitle)

  chrome.downloads.download(
    {
      url: imageUrl,
      filename: `${title}_${req.body.videoType}.jpg`
    },
    (downloadId) => {
      // Handle download success or failure
      if (downloadId !== undefined) {
        console.log("Download started successfully")
      } else {
        console.error("Download failed")
      }
    }
  )
}

export default handler
