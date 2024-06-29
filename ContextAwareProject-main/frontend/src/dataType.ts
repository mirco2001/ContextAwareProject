import { z } from "zod"

// imposto i vincoli sul ti po di dato che può essere fornito come risposta alle domande
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

export default formSchema;