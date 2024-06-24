// pagina iniziale del sito da qui si viene indirizzati verso le varie funzioni


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
import "./HomePage.css"
import { Map, MapPin, Pencil, Heart } from "lucide-react";

// import componenti react
import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div className="h-[100%] bg-[url('@/assets/piantinabologna.jpg')] bg-cover">
            <div className="test bg-white/30 h-[100%] w-[100%] content-center">

                <Card className="h-[60%] w-[70%] lg:h-[50%] lg:w-[50%] mx-auto flex flex-col justify-around">
                    <CardHeader>
                        <CardTitle>Inizia La Ricerca</CardTitle>
                        <CardDescription>Come vorresti cercare la tua casa?</CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-col justify-between py-0 px-3 lg:flex-row">

                        <Link className="flex-1 m-2 lg:h-20" to={'/search'} state={{ searchType: "zone" }}>
                            <Button className="h-full w-full">
                                <Map className="mr-2 h-6 w-6" /> Ricerca per Zona
                            </Button>
                        </Link>

                        <Link className="flex-1 m-2 lg:h-20" to={'/search'} state={{ searchType: "draw" }}>
                            <Button className="h-full w-full">
                                <Pencil className="mr-2 h-6 w-6" /> Disegna l'Area
                            </Button>
                        </Link>

                        <Link className="flex-1 m-2 lg:h-20" to={'/search'} state={{ searchType: "address" }}>
                            <Button className="h-full w-full">
                                <MapPin className="mr-2 h-6 w-6" /> Ricerca l'Indirizzo
                            </Button>
                        </Link>

                    </CardContent>

                    <CardFooter>
                        <Link className="flex items-center space-x-2 mx-auto" to={'/form'}>
                            <Button variant="link" className="text-wrap">
                                <Heart className="mx-1 lg:mr-2 lg:h-4 lg:w-4"/> Per una ricerca accurata Specifica le tue Preferenze
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>

            </div>
        </div>
    );
}

export default HomePage;