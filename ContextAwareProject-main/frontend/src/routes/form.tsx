"use client"

// import componenti shadecn
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

// import icone e stili
import { Heart, HeartCrack } from "lucide-react"

// import componenti react
import { useNavigate } from "react-router-dom";

// zod validazione e tipizzazione form
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import formSchema from "../dataType"
import { useEffect, useState } from "react"

// definisco le possibili key che le domande possono avere
type FormKeys =
    // Parametri inerenti a servizi RICREATIVI/EDUCATIVI del form
    'vicinanza_scuole' | 'vicinanza_dopoScuola' | 'vicinanza_areePicnic' | 'vicinanza_parchi' | 'vicinanza_parchiGiochi' | 'vicinanza_areeSport' |
    // Parametri inerenti a servizi TRASPORTO/ACCESSIBILITà del form
    'vicinanza_fermateBus' | 'vicinanza_fermateTreno' | 'vicinanza_parcheggi' | 'vicinanza_parcheggiColonnine' |
    // Parametri inerenti a servizi SANITARI/QUOTIDIANI del form
    'vicinanza_farmacie' | 'vicinanza_ospedali' | 'vicinanza_supermercati' | 'vicinanza_banche' |
    // Parametri inerenti a servizi CULTURALI/INTRATTENIMENTO del form
    'vicinanza_palestre' | 'vicinanza_ristoranti' | 'vicinanza_intrattenimentoNotturno' | 'vicinanza_cinema' | 'vicinanza_biblioteche' | 'vicinanza_museiGallerieArte';

// definisco struttura di una domanda
interface Question {
    id: FormKeys;
    value: string;
}

// creo la lista delle domande
// - per servizi Educativi & Ricreativi
export const ServiziEducativiRicreativi: Question[] = [{
    id: "vicinanza_scuole",
    value: "È importante ci siano scuole nel vicinato",
}, {
    id: "vicinanza_dopoScuola",
    value: "È importante ci siano servizi doposcuola nel raggio di 300 metri",
}, {
    id: "vicinanza_areePicnic",
    value: "È importante ci siano aree picnic o aree ricreative nel raggio di 400 metri",
}, {
    id: "vicinanza_parchi",
    value: "È importante la presenza di parchi nel vicinato?",
}, {
    id: "vicinanza_parchiGiochi",
    value: "È importante la disponibilità di parchi giochi per bambini nelle vicinanze",
}, {
    id: "vicinanza_areeSport",
    value: "È importante ci siano delle aree per lo sport (almeno un campo sportivo) nel raggio di 500 metri",
},
];
// - per servizi Trasporto & Accessibilita
export const ServiziTrasportoAccessibilita: Question[] = [{
    id: "vicinanza_fermateBus",
    value: "È importante la presenza di fermate dell’autobus nelle vicinanze",
}, {
    id: "vicinanza_fermateTreno",
    value: "È importante la presenza di fermate del treno nelle vicinanze",
}, {
    id: "vicinanza_parcheggi",
    value: "È importante la presenza di parcheggi nel raggio di 100 metri",
}, {
    id: "vicinanza_parcheggiColonnine",
    value: "È importante la disponibilità di parcheggi dotati di colonnine elettriche",
}
];
// - per servizi Sanitari & Quotidiani
export const ServiziSanitariQuotidiani: Question[] = [{
    id: "vicinanza_farmacie",
    value: "È importante la presenza di farmacie nelle vicinanze",
}, {
    id: "vicinanza_ospedali",
    value: "È importante la presenza di ospedali nelle vicinanze",
}, {
    id: "vicinanza_supermercati",
    value: "È importante avere un supermercato nelle vicinanze",
}, {
    id: "vicinanza_banche",
    value: "È importante avere una banca nelle vicinanze",
}
];
// - per servizi Culturali & Intrattenimento
export const ServiziCulturaliIntrattenimento: Question[] = [{
    id: "vicinanza_palestre",
    value: "È importante la disponibilità di palestre nel quartiere",
}, {
    id: "vicinanza_ristoranti",
    value: "È importante avere un ristorante nelle vicinanze",
}, {
    id: "vicinanza_intrattenimentoNotturno",
    value: "È importante la presenza di luoghi di intrattenimento notturno nelle vicinanze",
}, {
    id: "vicinanza_cinema",
    value: "È importante la disponibilità di cinema nel quartiere",
}, {
    id: "vicinanza_biblioteche",
    value: "È importante la presenza di biblioteche nel vicinato",
}, {
    id: "vicinanza_museiGallerieArte",
    value: "È importante la presenza di musei o gallerie d'arte nelle vicinanze",
}
];

function RadioGroupForm() {

    const navigate = useNavigate();
    const [userPreference, setUserPreference] = useState<z.infer<typeof formSchema>|undefined>(undefined);

    useEffect(() => {
        fetch('http://backend:4000/getPoI', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(data => {

                const userServicesPreference = {
                    vicinanza_scuole: data.vicinanza_scuole.toString(),
                    vicinanza_dopoScuola: data.vicinanza_dopoScuola.toString(),
                    vicinanza_areePicnic: data.vicinanza_areePicnic.toString(),
                    vicinanza_parchi: data.vicinanza_parchi.toString(),
                    vicinanza_parchiGiochi: data.vicinanza_parchiGiochi.toString(),
                    vicinanza_areeSport: data.vicinanza_areeSport.toString(),

                    vicinanza_fermateBus: data.vicinanza_fermateBus.toString(),
                    vicinanza_fermateTreno: data.vicinanza_fermateTreno.toString(),
                    vicinanza_parcheggi: data.vicinanza_parcheggi.toString(),
                    vicinanza_parcheggiColonnine: data.vicinanza_parcheggiColonnine.toString(),

                    vicinanza_farmacie: data.vicinanza_farmacie.toString(),
                    vicinanza_ospedali: data.vicinanza_ospedali.toString(),
                    vicinanza_supermercati: data.vicinanza_supermercati.toString(),
                    vicinanza_banche: data.vicinanza_banche.toString(),

                    vicinanza_palestre: data.vicinanza_palestre.toString(),
                    vicinanza_ristoranti: data.vicinanza_ristoranti.toString(),
                    vicinanza_intrattenimentoNotturno: data.vicinanza_intrattenimentoNotturno.toString(),
                    vicinanza_cinema: data.vicinanza_cinema.toString(),
                    vicinanza_biblioteche: data.vicinanza_biblioteche.toString(),
                    vicinanza_museiGallerieArte: data.vicinanza_museiGallerieArte.toString(),
                };

                setUserPreference(userServicesPreference);

            })
            .catch(error => {
                console.error('Errore nella fetch:', error);
            });

    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: userPreference,
    });

    useEffect(() => {
        if (userPreference) {
            form.reset(userPreference);
        }
    }, [userPreference]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        fetch('http://backend:4000/datiForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                formData: values,
            }),
        });
        navigate(-1);
    }

    // definisco stili radio button
    const radioBack = "border-blue-gray-400 border-4 transition-colors duration-400";
    const radio_red = radioBack + " text-red-500 hover:bg-red-500";
    const radio_yellow = radioBack + " text-yellow-500 hover:bg-yellow-500";
    const radio_green = radioBack + " text-green-500 hover:bg-green-500";

    // metodo che partendo da una lista di "questions" crea la controparte html
    function listQuestions(questions: Question[]) {
        return questions.map(question =>
            <div key={question.id} className="flex flex-col items-center justify-center h-[100%]">
                <FormField
                    key={question.id}
                    name={question.id}
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="my-6 p-1 items-center justify-center">
                            <FormLabel className="w-[100%]">
                                <p className="lg:text-xl mx-4 text-muted-foreground">
                                    {question.value}
                                </p>
                            </FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    className="flex flex-row w-[100%] p-1 items-center justify-center"
                                >
                                    <HeartCrack />
                                    <RadioGroupItem value="0" checked={field.value === "0"} className={radio_red + ' h-5 w-5 '} />
                                    <RadioGroupItem value="1" checked={field.value === "1"} className={radio_red + ' h-6 w-6 '} />
                                    <RadioGroupItem value="2" checked={field.value === "2"} className={radio_yellow + ' h-7 w-7 '} />
                                    <RadioGroupItem value="3" checked={field.value === "3"} className={radio_yellow + ' h-8 w-8'} />
                                    <RadioGroupItem value="4" checked={field.value === "4"} className={radio_green + ' h-9 w-9 '} />
                                    <RadioGroupItem value="5" checked={field.value === "5"} className={radio_green + ' h-10 w-10 '} />
                                    <Heart />
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Separator className="w-[70%]" />
            </div>
        );
    }
    
    return (
        <Card className="p-8 mx-[5%] my-5">
            <CardHeader>
                <CardTitle>La casa dei tuoi sogni</CardTitle>
                <CardDescription>Quali dei seguenti servizi non possono mancare alla tua futura casa?</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                    <Tabs defaultValue="Educativi_Ricreativi" className="flex lg:flex-row flex-col">
                        <div className="w-full lg:w-[25%] relative">
                            <TabsList className="w-[100%] h-[100%] flex flex-col">
                                <div className="lg:absolute top-0 p-2">
                                    <TabsTrigger value="Educativi_Ricreativi" className="w-[100%] my-2">
                                        <p className="text-sm text-wrap font-semibold lg:text-lg">Educativi e Ricreativi</p>
                                    </TabsTrigger>
                                    <TabsTrigger value="Trasporto_Accessibilità" className="w-[100%] my-2">
                                        <p className="text-sm text-wrap font-semibold lg:text-lg">Trasporto e Accessibilità</p>
                                    </TabsTrigger>
                                    <TabsTrigger value="Sanitari_Quotidiani" className="w-[100%] my-2">
                                        <p className="text-sm text-wrap font-semibold lg:text-lg">Sanitari e Quotidiani</p>
                                    </TabsTrigger>
                                    <TabsTrigger value="Culturali_Intrattenimento" className="w-[100%] my-2">
                                        <p className="text-sm text-wrap font-semibold lg:text-lg">Culturali e di Intrattenimento</p>
                                    </TabsTrigger>
                                </div>
                                <Button type="submit" className="w-[95%] lg:absolute bottom-0 m-2">Salva</Button>
                            </TabsList>
                        </div>
                        <div className="m-2"></div>
                        <ScrollArea className="w-[100%] h-[68vh] lg:w-[75%] rounded-md border">
                            <TabsContent value="Educativi_Ricreativi" className="transition-all items-center justify-center">
                                {listQuestions(ServiziEducativiRicreativi)}
                            </TabsContent>
                            <TabsContent value="Trasporto_Accessibilità" className="transition-all">
                                {listQuestions(ServiziTrasportoAccessibilita)}
                            </TabsContent>
                            <TabsContent value="Sanitari_Quotidiani" className="items-center justify-center">
                                {listQuestions(ServiziSanitariQuotidiani)}
                            </TabsContent>
                            <TabsContent value="Culturali_Intrattenimento" className="items-center justify-center">
                                {listQuestions(ServiziCulturaliIntrattenimento)}
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </form>
            </Form>
        </Card>
    );
}

export default RadioGroupForm;
