import fetch from "node-fetch";

console.log("Hello, World")

async function universityData() {
    try {
      const response = await fetch(
        "http://universities.hipolabs.com/search?country=pakistan"
      );
      const text = await response.text();
      console.log(text);
    } catch (error) {
      console.error(error);
    }
  }

  universityData()