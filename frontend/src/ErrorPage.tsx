import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";

import styles from "./ErrorPage.css"


function ErrorPage() {
  const error = useRouteError() as { statusText?: string; message?: string };
  console.error(error);


  // esempio styling FIXARE capire come delegare in un'altro file

  return (
    <div id="error-page" >
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