import express from "express";
import fs from "fs";
import path from "path";

const app = express();

const __dirname = path.resolve();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/video", (req, res) => {
  const videoPath = path.join(__dirname, "public", "video.mp4");
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;

  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
    return;
  }

  // Parse range header (e.g., "bytes=0-")
  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  const chunkSize = end - start + 1;

  // Create a readable stream
  const fileStream = fs.createReadStream(videoPath, { start, end });

  // Set response headers
  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": "video/mp4",
  });

  // Stream the video chunk
  fileStream.pipe(res);
});

app.listen(3000, () => {
  console.log("Video straming app listen on port 3000");
});
