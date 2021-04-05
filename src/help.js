import Footer from "./footer";
export default function Help() {
  return (
    <>
      <section>
        <h3>Directions</h3>
        <p>
          To add a new item click on the first row's "Type here" item name
          field. Then either press enter or click the cloud icon to save. The
          new item will appear at the bottom of the list.
        </p>
        <p>
          To edit, click on any quantity or item name value that you want to
          change. Make your change and then press enter before leaving that
          field. If you are changing both the quantity and the item name then
          click the cloud icon to save. Clicking on any checkbox automatically
          saves the new setting.
        </p>
        <p>To delete a row click on the trash icon.</p>
      </section>
      <Footer />
    </>
  );
}
