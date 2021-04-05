import Footer from "./footer";
export default function Help() {
  return (
    <>
      <section>
        <h3>Directions</h3>
        <p>
          To add a new item click on the first row's "Type here" item name
          field. Then either press enter or click the plus icon to save. The new
          item will appear at the bottom of the list.
        </p>
        <p>
          To edit, click on any quantity or item name value that you want to
          change. Make your change and then press enter. Or you can click the
          cloud icon to save any given row.
        </p>
        <p>To delete a row click on the trash icon.</p>
      </section>
      <Footer />
    </>
  );
}
