import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";

import styles from "./ErrorPage.css"

function ErrorPage() {
  const error = useRouteError();
  console.error(error);


  // esempio styling FIXARE capire come delegare in un'altro file
  const myStyle = {
    display: "flex",
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  }

  return (
    <div id="error-page" style={myStyle}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p><Link to={"/"}>Torna alla home</Link></p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

export default ErrorPage;