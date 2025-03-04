const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const csvParser = require("csv-parser");

dotenv.config();

const app = express();
app.use(express.json());

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

async function extractContent(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const title = $("title").text();
    const content = $("p").text();
    return { title, content, url, date: new Date().toISOString() };
  } catch (error) {
    console.error(`Error extracting content from ${url}:`, error);
    return null;
  }
}

async function ingestNews() {
  const csvFilePath = process.env.CSV_FILE_PATH;

  const urls = [];

  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on("data", (row) => {
      if (row.url) {
        urls.push(row.url);
      }
    })
    .on("end", async () => {
      for (const url of urls) {
        const article = await extractContent(url);
        if (article) {
          console.log("Ingested:", article);
        }
      }
    });
}

ingestNews().catch(console.error);

app.post("/agent", async (req, res) => {
  try {
    const { query } = req.body;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/gpt2",
      { inputs: query },
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        },
      }
    );

    const answer =
      response.data[0]?.generated_text ||
      "Sorry, I couldn't generate an answer.";
    res.json({ answer, sources: [] });
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
