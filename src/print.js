import React, { useState, useEffect } from "react";
import { dbGetAllData } from "./dbapi";
import Footer from "./footer";

export default function Print() {
  let [dataArray, setDataArray] = useState([]);

  useEffect(() => {
    dbGetAllData(setDataArray);
  }, []); // ignore warning - empty dependency array [] so only executed once

  useEffect(() => {
    console.log("second useEffect runs whenever the dataArray changes");
    console.log(dataArray);
  }, [dataArray]);

  const buyData = dataArray.filter((row) => row.buy === true);
  console.log("bd=", buyData);

  return (
    <>
      <section>
        <h3>Buy List</h3>
        <table>
          <thead>
            <tr>
              <th>Qty</th>
              <th>Item</th>
            </tr>
          </thead>
          <tbody>
            {buyData.map((oneRow) => {
              return (
                <>
                  <tr key={oneRow._id}>
                    <td>{oneRow.qty}</td>
                    <td>{oneRow.name}</td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
        <Footer />
      </section>
    </>
  );
}
