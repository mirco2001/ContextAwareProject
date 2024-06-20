"use client"

// zod validazione e tipizzazione form
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

// elementi form
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

// card
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Separator } from "@/components/ui/separator"
import { Heart, HeartCrack, HomeIcon, Plus } from "lucide-react"


type FormKeys =
    // Parametri inerenti a servizi RICREATIVI/EDUCATIVI del form
    'vicinanza_scuole' | 'vicinanza_dopoScuola' | 'vicinanza_areePicnic' | 'vicinanza_parchi' | 'vicinanza_parchiGiochi' | 'vicinanza_areeSport' |
    // Parametri inerenti a servizi TRASPORTO/ACCESSIBILITà del form
    'vicinanza_fermateBus' | 'vicinanza_fermateTreno' | 'vicinanza_parcheggi' | 'vicinanza_parcheggiColonnine' |
    // Parametri inerenti a servizi SANITARI/QUOTIDIANI del form
    'vicinanza_farmacie' | 'vicinanza_ospedali' | 'vicinanza_supermercati' | 'vicinanza_banche' |
    // Parametri inerenti a servizi CULTURALI/INTRATTENIMENTO del form
    'vicinanza_palestre' | 'vicinanza_ristoranti' | 'vicinanza_intrattenimentoNotturno' | 'vicinanza_cinema' | 'vicinanza_biblioteche' | 'vicinanza_museiGallerieArte';

interface Question {
    id: FormKeys;
    value: string;
}

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

const formSchema = z.object({
    vicinanza_scuole: z.string(),
    vicinanza_dopoScuola: z.string(),
    vicinanza_areePicnic: z.string(),
    vicinanza_parchi: z.string(),
    vicinanza_parchiGiochi: z.string(),
    vicinanza_areeSport: z.string(),

    vicinanza_fermateBus: z.string(),
    vicinanza_fermateTreno: z.string(),
    vicinanza_parcheggi: z.string(),
    vicinanza_parcheggiColonnine: z.string(),

    vicinanza_farmacie: z.string(),
    vicinanza_ospedali: z.string(),
    vicinanza_supermercati: z.string(),
    vicinanza_banche: z.string(),

    vicinanza_palestre: z.string(),
    vicinanza_ristoranti: z.string(),
    vicinanza_intrattenimentoNotturno: z.string(),
    vicinanza_cinema: z.string(),
    vicinanza_biblioteche: z.string(),
    vicinanza_museiGallerieArte: z.string(),
})

function RadioGroupForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            vicinanza_scuole: "3",
            vicinanza_dopoScuola: "3",
            vicinanza_areePicnic: "3",
            vicinanza_parchi: "3",
            vicinanza_parchiGiochi: "3",
            vicinanza_areeSport: "3",

            vicinanza_fermateBus: "3",
            vicinanza_fermateTreno: "3",
            vicinanza_parcheggi: "3",
            vicinanza_parcheggiColonnine: "3",

            vicinanza_farmacie: "3",
            vicinanza_ospedali: "3",
            vicinanza_supermercati: "3",
            vicinanza_banche: "3",

            vicinanza_palestre: "3",
            vicinanza_ristoranti: "3",
            vicinanza_intrattenimentoNotturno: "3",
            vicinanza_cinema: "3",
            vicinanza_biblioteche: "3",
            vicinanza_museiGallerieArte: "3",
        },
    })

    const fetchData = async () => {
        const res = await fetch("http://localhost:4000/get");
        const data = await res.json();
        console.log(data);
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        fetchData();
        console.log(values);
    }

    // stili radio button
    const radioBack = "border-blue-gray-400 border-4 transition-colors duration-400";
    const radio_red = radioBack + " text-red-500 hover:bg-red-500";
    const radio_yellow = radioBack + " text-yellow-500 hover:bg-yellow-500";
    const radio_green = radioBack + " text-green-500 hover:bg-green-500";



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
                                    <RadioGroupItem value="1" checked={field.value === "1"} className={radio_red + ' h-9 w-9 '} />
                                    <RadioGroupItem value="2" checked={field.value === "2"} className={radio_red + ' h-6 w-6 '} />
                                    <RadioGroupItem value="3" checked={field.value === "3"} className={radio_yellow + ' h-5 w-5'} />
                                    <RadioGroupItem value="4" checked={field.value === "4"} className={radio_green + ' h-6 w-6 '} />
                                    <RadioGroupItem value="5" checked={field.value === "5"} className={radio_green + ' h-9 w-9 '} />
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
                                    <TabsTrigger value="Educativi_Ricreativi" className="w-[100%] my-2">           <p className="text-sm text-wrap font-semibold lg:text-lg">Educativi e Ricreativi</p> </TabsTrigger>
                                    <TabsTrigger value="Trasporto_Accessibilità" className="w-[100%] my-2">        <p className="text-sm text-wrap font-semibold lg:text-lg">Trasporto e Accessibilità </p></TabsTrigger>
                                    <TabsTrigger value="Sanitari_Quotidiani" className="w-[100%] my-2">            <p className="text-sm text-wrap font-semibold lg:text-lg">Sanitari e Quotidiani </p></TabsTrigger>
                                    <TabsTrigger value="Culturali_Intrattenimento" className="w-[100%] my-2">      <p className="text-sm text-wrap font-semibold lg:text-lg">Culturali e di Intrattenimento </p></TabsTrigger>
                                </div>

                                <Button type="submit" className="w-[95%] lg:absolute bottom-0 m-2">Submit</Button>
                            </TabsList>
                        </div>

                        <div className="m-2">
                        </div>


                        <Card className="w-[100%] h-[600px] lg:w-[75%] overflow-y-auto">

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
                        </Card>

                    </Tabs>

                </form>
            </Form>
        </Card>
    )
}


export default RadioGroupForm;