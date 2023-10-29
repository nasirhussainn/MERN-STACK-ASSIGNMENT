import axios from "axios";
import express from "express";
import router from "./route/router.js";
import fs from "fs";
// import M3o from 'm3o';

const app = express();

app.listen(9000, () => {
  console.log("Server is listening at http://localhost:9000");
});

app.set("views", "./views");
app.set("view engine", "ejs");

app.use("/", router);
app.use("/home", router);

async function send_mails(mail, weather_message) {
  const options = {
    method: "POST",
    url: "https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "2ce510afecmsh849a0fd3da8daf5p1dd32ajsn36a074608d92",
      "X-RapidAPI-Host": "rapidprod-sendgrid-v1.p.rapidapi.com",
      useQueryString: true
    },
    data: {
      personalizations: [
        {
          to: [
            {
              email: mail,
            },
          ],
          subject: "Daily Weather Update !",
        },
      ],
      from: {
        email: "nasirhussaintormik@gmail.com",
      },
      content: [
        {
          type: "text/plain",
          value: weather_message,
        },
      ],
    },
  };

  try {
    const response = await axios.request(options);
    return true;
  } catch (error) {
    console.error(error);
  }
}

async function send_smss(phone, weather_message) {
  const options = {
    method: "GET",
    url: "https://sms136.p.rapidapi.com/send-sms",
    params: {
      provider: "TelekomSlovenije",
      username: "nasir2008",
      password: "Nasir2008@rapid",
      from: "03478287390",
      phone_number: phone,
      sms: weather_message,
    },
    headers: {
      "X-RapidAPI-Key": "d3f9275dd6msh5ead7d105d7ded2p1d2843jsn5ca9c1c512a4",
      "X-RapidAPI-Host": "sms136.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data)
    return true;
  } catch (error) {
    console.error(error);
  }
}

async function get_weather(city) {
  const myAPIKEY = "1ac059ef77460f4de18a7ae81b76d918";
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myAPIKEY}`
  );
  const weatherData = response.data;
  return weatherData;
}

router.get("/weather", async (req, res) => {
  const cityName = req.query.city;
  const mailAddress = req.query.mail;
  const phoneNo = req.query.phone;

  const weatherData = await get_weather(cityName);
  const temperature = weatherData.main.temp;
  const max_temperature = weatherData.main.temp_max;
  const min_temperature = weatherData.main.temp_min;
  const feels_like = weatherData.main.feels_like;
  const humidity = weatherData.main.humidity;
  const weather_message =
    "Weather Update of " +
    `${cityName}` +
    `
  Temperature: ${temperature}°C
  Max Temperature: ${max_temperature}°C
  Min Temperature: ${min_temperature}°C
  Feels like: ${feels_like}°C
  Humidity: ${humidity}%
  `;

  let send_mail = send_mails(mailAddress, weather_message);
  let send_sms = send_smss(phoneNo, weather_message);

  try {
    if (send_mail && send_sms) {
      console.log(weather_message);
      res.render("home.ejs", {
        title: "Weather APP NODE",
        weather: true,
        cityName: cityName,
        temperature: weatherData.main.temp,
        max_temperature: weatherData.main.temp_max,
        min_temperature: weatherData.main.temp_min,
        feels_like: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        subscribe: "SUBSCRIBED SUCCESSFULLY !"
      });
      if (mailAddress && phoneNo && weather_message) {
        const MessageAppend = `Receiver Mail: ${mailAddress} Receiver Phone: ${phoneNo}\nMessage Body: ${weather_message}\n`;
        fs.appendFileSync("log.txt", MessageAppend);
        console.log(MessageAppend);
      } else {
        console.log("Cannot append to the file.");
      }
    }
  } catch (err) {
    if (mailAddress && phoneNo && weather_message) {
      const MessageAppend = `Receiver Mail: ${mailAddress} Receiver Phone: ${phoneNo}\nMessage Body: ${weather_message}\n`;
      fs.appendFileSync("log.txt", MessageAppend);
      console.log(MessageAppend);
    } else {
      console.log("Cannot append to the file.");
    }
  }
});
