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
import { HomeIcon } from "lucide-react"


type FormKeys =
    // Parametri inerenti alla CASA del form
    'vicinanza_scuole' | 'vicinanza_palestre' | 'vicinanza_luoghi_culto' | 'vicinanza_ospedali' | 'vicinanza_farmacie' | 'vicinanza_mezzi_publici' | 'vicinanza_parcheggi' |
    // Parametri inerenti alla AREE VERDI del form
    'vicinanza_verde_ricreative' | 'vicinanza_parchi' | 'vicinanza_verde_bimbi' | 'vicinanza_verde_sport';
// Parametri inerenti alla ACQUISTI del form

// Parametri inerenti all'INTRATTENIMENTO del form

interface Question {
    id: FormKeys;
    value: string;
}

export const questionsCasa: Question[] = [{
    id: "vicinanza_scuole",
    value: "Quanto è importante la disponibilità di scuole nel vicinato?",
}, {
    id: "vicinanza_palestre",
    value: "Quanto è importante la disponibilità di palestre nel quartiere?",
}, {
    id: "vicinanza_luoghi_culto",
    value: "Quanto è importante la disponibilità di luoghi di culto nel quartiere?",
}, {
    id: "vicinanza_ospedali",
    value: "Quanto è importante la presenza di ospedali nelle vicinanze?",
}, {
    id: "vicinanza_farmacie",
    value: "Quanto è importante la presenza di farmacie nelle vicinanze?",
}, {
    id: "vicinanza_mezzi_publici",
    value: "Quanto è importante la presenza di stazioni dei mezzi pubblici nelle vicinanze?",
}, {
    id: "vicinanza_parcheggi",
    value: "Quanto è importante la densità di parcheggi, con almeno uno ogni 100 metri nel quartiere?",
}
];

export const questionsAreeVerdi: Question[] = [{
    id: "vicinanza_verde_ricreative",
    value: "Quanto è importante la densità di aree per picnic o aree ricreative, con almeno una ogni 400 metri nel quartiere?",
}, {
    id: "vicinanza_parchi",
    value: "Quanto è importante la presenza di parchi nel vicinato?",
}, {
    id: "vicinanza_verde_bimbi",
    value: "Quanto è importante la disponibilità di parchi giochi per bambini nel quartiere?",
}, {
    id: "vicinanza_verde_sport",
    value: "Quanto è importante la densità di aree per lo sport, con almeno un campo sportivo ogni 500 metri nel quartiere?",
}
];

const formSchema = z.object({
    vicinanza_scuole: z.string(),
    vicinanza_palestre: z.string(),
    vicinanza_luoghi_culto: z.string(),
    vicinanza_ospedali: z.string(),
    vicinanza_farmacie: z.string(),
    vicinanza_mezzi_publici: z.string(),
    vicinanza_parcheggi: z.string(),

    vicinanza_verde_ricreative: z.string(),
    vicinanza_parchi: z.string(),
    vicinanza_verde_bimbi: z.string(),
    vicinanza_verde_sport: z.string(),
})

function RadioGroupForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            vicinanza_scuole: "3",
            vicinanza_palestre: "3",
            vicinanza_luoghi_culto: "3",
            vicinanza_ospedali: "3",
            vicinanza_farmacie: "3",
            vicinanza_mezzi_publici: "3",
            vicinanza_parcheggi: "3",

            vicinanza_verde_ricreative: "3",
            vicinanza_parchi: "3",
            vicinanza_verde_bimbi: "3",
            vicinanza_verde_sport: "3",
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
    const radioBack = "border-blue-gray-400 transition-colors duration-400";
    const radio_red = radioBack + " text-red-500 hover:bg-red-500";
    const radio_yellow = radioBack + " text-yellow-500 hover:bg-yellow-500";
    const radio_green = radioBack + " text-green-500 hover:bg-green-500";



    function listQuestions(questions: Question[]) {

        return questions.map(question =>
            <div key={question.id} className="flex flex-col items-center justify-center">
                <FormField
                    key={question.id}
                    name={question.id}
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="my-6 p-1 items-center justify-center">
                            <FormLabel className="w-[100%]">

                                <p className="text-xl text-muted-foreground">
                                    {question.value}
                                </p>

                            </FormLabel>
                            <FormControl>


                                <RadioGroup
                                    onValueChange={field.onChange}
                                    className="flex flex-row w-[100%] p-1 items-center justify-center"
                                >
                                    <RadioGroupItem value="1" checked={field.value === "1"} className={radio_red + ' h-9 w-9 '} />
                                    <RadioGroupItem value="2" checked={field.value === "2"} className={radio_red + ' h-6 w-6 '} />
                                    <RadioGroupItem value="3" checked={field.value === "3"} className={radio_yellow + ' h-5 w-5'} />
                                    <RadioGroupItem value="4" checked={field.value === "4"} className={radio_green + ' h-6 w-6 '} />
                                    <RadioGroupItem value="5" checked={field.value === "5"} className={radio_green + ' h-9 w-9 '} />

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

        <Card className="p-8 mx-[10%] my-[5%]">

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">

                    <Tabs defaultValue="casa" className="flex">

                        <div className="w-[20%] relative">
                            <TabsList className="w-[100%] h-[100%] flex flex-col">

                                <div className="absolute top-0 p-2">
                                    <TabsTrigger value="casa" className="w-[100%] text-lg font-semibold"> <HomeIcon className="mx-3"/> <p className="font-semibold">Casa</p> </TabsTrigger>
                                    <TabsTrigger value="aree_verdi" className="w-[100%]">Aree verdi</TabsTrigger>
                                    <TabsTrigger value="acquisti" className="w-[100%]">Acquisti</TabsTrigger>
                                    <TabsTrigger value="intrattenimento" className="w-[100%]">Intrattenimento</TabsTrigger>
                                </div>

                                <Button type="submit" className="w-[95%] absolute bottom-0 m-2">Submit</Button>
                            </TabsList>
                        </div>



                        <div className="w-[80%] h-[600px] p-4 overflow-y-scroll">
                            <TabsContent value="casa" className="transition-all items-center justify-center">
                                {listQuestions(questionsCasa)}
                            </TabsContent>


                            <TabsContent value="aree_verdi" className="transition-all">
                                {listQuestions(questionsAreeVerdi)}
                            </TabsContent>

                            <TabsContent value="acquisti" className="items-center justify-center">Change your password here.</TabsContent>
                            <TabsContent value="intrattenimento" className="items-center justify-center">Change your password here.</TabsContent>
                        </div>

                    </Tabs>

                </form>
            </Form>
        </Card>
    )
}


export default RadioGroupForm;