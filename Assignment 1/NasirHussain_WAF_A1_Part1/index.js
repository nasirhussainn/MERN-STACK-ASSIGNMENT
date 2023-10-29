import axios from "axios";
import express from "express";
import router from "./route/router.js";
import fs from "fs";

const app = express();

app.listen(9000, () => {
  console.log(`Server is running on port http://localhost:9000`);
});

app.use(express.static("html"));
app.set("views", "./views");
app.set("view engine", "ejs");

app.use("/", router);
app.use("/home", router);
app.use("/see_country_universities", router);
app.use("/search_university", router);

app.get("/country_uni", async (req, res) => {
  try {
    const countryName = req.query.country;
    const response = await axios.get(
      `http://universities.hipolabs.com/search?country=${countryName}`
    );
    const universities = response.data;
    const result_universities = universities
      .map((university) => JSON.stringify(university))
      .join("");

    res.render("see_country", {
      universities: universities,
      count: universities.length,
      country_name: countryName,
    });

    if (universities.length > 0) {
      fs.appendFileSync(
        "log.txt",
        "Search Country - " + countryName + "\n" + result_universities + "\n"
      );
      console.log("Search Country " + countryName + "\n" + result_universities);
    } else {
      fs.appendFileSync(
        "log.txt",
        "Search Country - " + countryName + "\t" + " : Error Fetching Data" + "\n"
      );
      console.log("Search Country " + countryName + "\t" + " : Error Fetching Data");
    }
  } catch (error) {
    res.status(500).send("Error fetching data from the API");
  }
});

app.get("/searching_uni", async (req, res) => {
  try {
    const uniName = req.query.name;
    const response = await axios.get(
      `http://universities.hipolabs.com/search?name=${uniName}`
    );
    const universities = response.data;

    const web_pages = universities.map((university) => university.web_pages);
    const university_names = universities.map((university) => university.name);

    const resultweb_pages = web_pages.join("\n");
    const resultuniversity_names = university_names.join("\n");

    if (universities.length > 0) {
      fs.appendFileSync(
        "log.txt",
        `Search  University- ${uniName}\n${resultuniversity_names}\n${resultweb_pages}\n`
      );
      console.log(
        `Search University- ${uniName}\n${resultuniversity_names}\n${resultweb_pages}`
      );
      res.render("search_uni", { universities });
    } else {
      fs.appendFileSync("log.txt", `Search University- ${uniName}\t No Result Found\n`);
      console.error(`Search University - ${uniName}\nNo Result Found`);
      res.render("search_uni", { universities });
    }
  } catch (error) {
    res.status(500).send("Error fetching data from the API");
  }
});
