// ***** API functions *******************************************************
// These functions call the api running on a Heroku server
// which carries out the desired interaction with a mongodb Atlas database.

import axios from "axios";

export async function dbGetAllData(setRowDataArray) {
  await axios
    .get("https://inventory-api-v2.herokuapp.com/items")
    .then((response) => {
      setRowDataArray(response.data);
    });
}

export async function dbAddNewRow(buy, fav, qty, itemName) {
  const uri = "https://inventory-api-v2.herokuapp.com/items";
  const payload = { buy: buy, fav: fav, qty: qty, name: itemName };
  let result = await axios.post(uri, payload);
  console.log(`db add new row res.data=${result.data}`);
  return result.data;
}

export async function dbUpdateRow(row) {
  const uri = "https://inventory-api-v2.herokuapp.com/items/" + row._id;
  const payload = { buy: row.buy, fav: row.fav, qty: row.qty, name: row.name };
  let result = await axios.put(uri, payload);
  return result.data;
}

export async function dbRemoveRow(myId) {
  const uri = "https://inventory-api-v2.herokuapp.com/items/" + myId;
  let result = await axios.delete(uri);
  console.log(`db remove=${result.data.deletedCount}`); // make sure it is 1
  return result.data.deletedCount;
}
// ***** End API functions ***************************************************
