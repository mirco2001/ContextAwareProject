import formSchema from "./dataType"
import { z } from "zod"

var UserProfile = (function() {
    var userServicesPreference : z.infer<typeof formSchema> = {
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
    };

    // var full_name = "";
  
    // var getName = function() {
    //   return full_name;    // Or pull this from cookie/localStorage
    // };
  
    // var setName = function(name) {
    //   full_name = name;     
    //   // Also set this in cookie/localStorage
    // };

    var getServicesPreference = function(){
        return userServicesPreference;
    }

    var setServicesPreference = function(servicesPreference: z.infer<typeof formSchema>){
        userServicesPreference = servicesPreference;
    }
  
    return {
        getServicesPreference:getServicesPreference,
        setServicesPreference:setServicesPreference,
    //   getName: getName,
    //   setName: setName
    }
  
  })();
  
  export default UserProfile;