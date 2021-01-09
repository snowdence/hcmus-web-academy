const axios = require("axios");

//demo
const sendGetRequest = async () => {
  try {
    const resp = await axios.get("https://jsonplaceholder.typicode.com/posts");
    console.log(resp.data);
  } catch (err) {
    console.error(err);
  }
};

sendGetRequest();
