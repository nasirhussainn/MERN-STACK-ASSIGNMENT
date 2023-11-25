console.log("CRICKE MATCH UPDATE");

import express from "express";
import axios from "axios";

const app = express();

app.set("views", "./views");
app.set("view engine", "pug");


const apiKey = "9fa5b482-32ab-4823-a18b-4ad540deefdb";

const fetchApiData = async () => {
  try {
    const response = await axios.get(
      `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}&offset=0`
    );
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; 
  }
};

app.get('/', async (req, res) => {
  try {
    const responseData = await fetchApiData();
    res.render("homePage", { response: responseData.data });
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get('/homePage', async (req, res) => {
  try {
    const responseData = await fetchApiData();
    res.render("homePage", { response: responseData });
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get('/scoreBoardRouter', async (req, res) => {
  const match_id_data = req.query.match_id;
  try {
    const response = await axios.get(
      `https://api.cricapi.com/v1/match_info?apikey=${apiKey}&id=${match_id_data}`
    );
  res.render("scoreBoard",{
    response : response.data,
  })
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; 
  }
})

app.get('/seriesListRouter', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.cricapi.com/v1/series?apikey=${apiKey}&offset=0`
    );
  res.render("seriesList",{
    response : response.data,
   
  })
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; 
  }
})

app.get('/seriesInfoRouter', async (req, res) => {
  const series_api_key = req.query.series_id
  try {
    const response = await axios.get(
      `https://api.cricapi.com/v1/series_info?apikey=${apiKey}&id=${series_api_key}`
    );
  res.render("seriesInfo",{
    response : response.data,
   
  })
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; 
  }
})


app.get('/teamRouter', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.cricapi.com/v1/players?apikey=${apiKey}&offset=0`
    );
    
    const response2 = await axios.get(
      `https://api.cricapi.com/v1/series_info?apikey=${apiKey}&id=a494636e-9537-4ed9-9e8d-43708b202f81`
    );

    res.render("Teams", {
      response: response.data,
      response2: response2.data,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; 
  }
});


app.get('/playerInfoRouter', async (req, res) => {
  const player_id = req.query.id
  try {
    const response = await axios.get(
      `https://api.cricapi.com/v1/players_info?apikey=${apiKey}&id=${player_id}`
    );
  res.render("playerInfo",{
    response : response.data,
   
  })
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; 
  }
})

app.get('/searchPlayerHome', async (req, res) => {
  res.render("searchPlayer")
})

app.get('/searchPlayerRouter', async(req, res) => {
  const search_name = req.query.search
  try {
    const response = await axios.get(
      `https://api.cricapi.com/v1/players?apikey=${apiKey}&offset=0&search=${search_name}`
    );
  res.render("searchPlayerResult",{
    response : response.data,
   
  })
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; 
  }
  
})

app.listen(9000, () => {
  console.log(`Server is running on http://localhost:9000`);
});
