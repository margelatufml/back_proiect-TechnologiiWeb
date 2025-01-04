const express = require("express");
const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Node.js!");
});

app.post("/data", (req, res) => {
  const receivedData = req.body;
  res.json({
    message: "Data received successfully!",
    data: receivedData.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
