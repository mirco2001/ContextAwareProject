// import componenti shadecn
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// import icone e stili
import './ErrorPage.css'
import { Home } from "lucide-react";

// import componenti react
import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";


function ErrorPage() {

  // raccolgo l'errore riscontrato e lo visualizzo
  const error = useRouteError() as { statusText?: string; message?: string };
  console.error(error);

  return (
    <Card className="my-[10%] mx-[5%] h-[50%] text-center lg:mx-[30%] justify-between">
      <CardHeader>
        <CardTitle><h1>Oops!</h1></CardTitle>
        <CardDescription>
          <p>
            <i>{error.statusText || error.message}</i>
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Sorry, an unexpected error has occurred.</p>
      </CardContent>
      <CardFooter>

        <Link className="flex-1 m-2" to={`/home`}>
          <Button className="w-full">
            <Home className="mr-2 h-6 w-6" /> torna alla Home
          </Button>
        </Link>

      </CardFooter>
    </Card>
  );
}

export default ErrorPage;