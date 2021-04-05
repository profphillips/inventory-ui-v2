import Footer from "./footer";
export default function About() {
  return (
    <>
      <section>
        <h3 id="about">About</h3>
        <p>Inventory user interface v2 by John Phillips on April 2, 2021.</p>
        <p>
          Source:{" "}
          <a href="https://github.com/profphillips/inventory-ui-v2">
            https://github.com/profphillips/inventory-ui-v2
          </a>
        </p>
        <p>
          Live page:{" "}
          <a href="https://profphillips.github.io/inventory-ui-v2/">
            https://profphillips.github.io/inventory-ui-v2/
          </a>
        </p>
        <p>
          This program uses an api hosted at Heroku. The api uses a Mongodb
          Atlas cloud database to store the data.
        </p>
        <p>
          Source:{" "}
          <a href="https://github.com/profphillips/inventory-api-v2">
            https://github.com/profphillips/inventory-api-v2
          </a>
        </p>
      </section>
      <Footer />
    </>
  );
}
