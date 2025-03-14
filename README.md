# Video Streaming App using Node.js, Express, and EJS

This is a simple video streaming application built using **Node.js**, **Express.js**, and **EJS**. It streams video files efficiently using **chunk-based streaming**.

---

## 🚀 Features

- 📺 **Stream video files** directly in the browser.
- 🛠 **Uses Node.js Streams** for efficient memory usage.
- 🎯 **Supports video seeking** (jumping to different parts of the video).
- 🔥 **Lightweight and Fast** - Doesn't load the entire video into memory.

---

## 📂 Project Structure

```
video-streaming-app/
│-- public/                # Static files
│   ├── video.mp4          # Sample video file
│-- views/                 # EJS templates
│   ├── index.ejs          # Video player page
│-- index.js              # Main Express server
│-- package.json           # Dependencies
│-- README.md              # Documentation
```

---

## 🛠 Installation and Setup

### 1️⃣ Clone the Repository

```sh
git clone git+https://github.com/Nithil-coffeebeans/stream-nodejs-video.git
cd stream-nodejs-video
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Run the Server

```sh
npm start
```

### 4️⃣ Open in Browser

Go to:

```
http://localhost:3000
```

🎥 Your video will start streaming!

---

## 📜 How It Works

### 1️⃣ **Frontend (`index.ejs`)**

- Contains a **video player** that requests `http://localhost:3000/video`.
- The browser automatically makes **range requests** to stream the video.

### 2️⃣ **Backend (`index.js`)**

- Reads the **video file** in chunks using `fs.createReadStream()`.
- Responds with only the **requested part** (instead of loading the whole file into memory).
- Sets the correct **HTTP headers** to support **seeking and chunked streaming**.

---

## 📝 API Endpoints

### **1️⃣ GET `/`**

- Renders the **EJS page** with the video player.

### **2️⃣ GET `/video`**

- **Streams the video file** in chunks.
- Uses **range headers** to allow seeking.

---

## 🛠 Code Explanation

### 📌 **Streaming Route (`index.js`)**

```javascript
app.get("/video", (req, res) => {
  const videoPath = path.join(__dirname, "public", "video.mp4");
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;

  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
    return;
  }

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  const chunkSize = end - start + 1;

  const fileStream = fs.createReadStream(videoPath, { start, end });

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": "video/mp4",
  });

  fileStream.pipe(res);
});
```

- Reads video **chunks** based on the requested **range**.
- Uses **`fs.createReadStream()`** for efficient memory usage.
- Supports **video seeking**.

---

## 🛠 Possible Improvements

🔹 **Multiple Video Support** – Allow users to select different videos.  
🔹 **File Upload Feature** – Let users upload their own videos.  
🔹 **Adaptive Bitrate Streaming** – Stream different video qualities.

---

## 🏆 Credits

Made with ❤️ using **Node.js**, **Express.js**, and **EJS**.

---

## 📜 License

This project is open-source and available under the **MIT License**.
