// backend/index.js

const express = require('express')
const cors = require('cors')
const pool = require('./db')
const {spawn} = require('child_process')
const fs = require('fs').promises;
const path = require('path');
const os = require('os');


const app = express()

app.use(cors())
app.use(express.json())

let cinema = 0;
let picnic = 0;
let sport = 0;
let coordinatesj = [];
let geomcoordinate = [];
let banche = 0;
let biblio = 0;
let dpscuola = 0;
let bus = 0;
let treno = 0;
let intrattenimento = 0;
let musei = 0;
let ospedali = 0;
let parcheggi = 0;
let colonnine = 0;
let parchi = 0;
let areegiochi = 0;
let ristorante  = 0;
let scuole = 0;
let supermercati = 0;
let farm = 0;
let pal = 0;
let coordinates;

app.get("/Poi", async (req,res) => {
  try{
      const coordinatesS = [];
      const coordinatesB = [];
      const coordinatesC = [];
      const coordinatesBB = [];
      const coordinatesCl = [];
      const coordinatesDP = [];
      const coordinatesF = [];
      const coordinatesGB = [];
      const coordinatesM = [];
      const coordinatesE = [];
      const coordinatesT = [];
      const coordinatesSC = [];
      const coordinatesR = [];
      const coordinatesPC = [];
      const coordinatesP = [];
      const coordinatesPL = [];
      const coordinatesO = [];
      const coordinatesI = [];
      const coordinatesFB = [];
      const coordinatesCS = [];
      const queryS = await pool.query(`SELECT * FROM supermercati`);
      const queryJSONS = JSON.stringify(queryS);
      const jsonObjectS = JSON.parse(queryJSONS);
      const queryB = await pool.query(`SELECT * FROM banche`);
      const queryJSONB = JSON.stringify(queryB);
      const jsonObjectB = JSON.parse(queryJSONB);
      const queryBB = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine FROM biblioteche`);
      const queryJSONBB = JSON.stringify(queryBB);
      const jsonObjectBB = JSON.parse(queryJSONBB);
      const queryC = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine FROM cinema`);
      const queryJSONC = JSON.stringify(queryC);
      const jsonObjectC = JSON.parse(queryJSONC);
      const queryCl = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine FROM colonnine`);
      const queryJSONCl = JSON.stringify(queryCl);
      const jsonObjectCl = JSON.parse(queryJSONCl);
      const queryDP = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine FROM doposcuola`);
      const queryJSONDP = JSON.stringify(queryDP);
      const jsonObjectDP = JSON.parse(queryJSONDP);
      const queryF = await pool.query(`SELECT * FROM farmacie`);
      const queryJSONF = JSON.stringify(queryF);
      const jsonObjectF = JSON.parse(queryJSONF);
      const queryGB = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine FROM giochibimbi`);
      const queryJSONGB = JSON.stringify(queryGB);
      const jsonObjectGB = JSON.parse(queryJSONGB);
      const queryM = await pool.query(`SELECT * FROM musei`);
      const queryJSONM = JSON.stringify(queryM);
      const jsonObjectM = JSON.parse(queryJSONM);
      const queryE = await pool.query(`SELECT  ST_X(wkb_geometry) AS Longitudine, ST_Y(wkb_geometry) AS Latitudine FROM eventi`);
      const queryJSONE = JSON.stringify(queryE);
      const jsonObjectE = JSON.parse(queryJSONE);
      const queryT = await pool.query(`SELECT  ST_X(wkb_geometry) AS Longitudine, ST_Y(wkb_geometry) AS Latitudine FROM stazioniferroviarie`);
      const queryJSONT = JSON.stringify(queryT);
      const jsonObjectT = JSON.parse(queryJSONT);
      const querySC = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine FROM scuole`);
      const queryJSONSC = JSON.stringify(querySC);
      const jsonObjectSC = JSON.parse(queryJSONSC);
      const queryR = await pool.query(`SELECT * FROM ristoranti`);
      const queryJSONR = JSON.stringify(queryR);
      const jsonObjectR = JSON.parse(queryJSONR);
      const queryPC = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine FROM parchi`);
      const queryJSONPC = JSON.stringify(queryPC);
      const jsonObjectPC = JSON.parse(queryJSONPC);
      const queryP = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine FROM parcheggi`);
      const queryJSONP = JSON.stringify(queryP);
      const jsonObjectP = JSON.parse(queryJSONP);
      const queryPL = await pool.query(`SELECT * FROM palestre`);
      const queryJSONPL = JSON.stringify(queryPL);
      const jsonObjectPL = JSON.parse(queryJSONPL);
      const queryO = await pool.query(`SELECT  ST_X(wkb_geometry) AS Longitudine, ST_Y(wkb_geometry) AS Latitudine FROM ospedali`);
      const queryJSONO = JSON.stringify(queryO);
      const jsonObjectO = JSON.parse(queryJSONO);
      const queryI = await pool.query(`SELECT  ST_X(geom) AS Longitudine, ST_Y(geom) AS Latitudine FROM impianti_sportivi`);
      const queryJSONI = JSON.stringify(queryI);
      const jsonObjectI = JSON.parse(queryJSONI);
      const queryFB = await pool.query(`SELECT  ST_X(wkb_geometry) AS Longitudine, ST_Y(wkb_geometry) AS Latitudine FROM fermatebus`);
      const queryJSONFB = JSON.stringify(queryFB);
      const jsonObjectFB = JSON.parse(queryJSONFB);
      

      

      // Iterare attraverso l'array rows nel JSON
      jsonObjectS.rows.forEach(item => {
          const name = "Supermercati"
          const longitude = item.Longitudine;
          const latitude = item.Latitudine;
          
          // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
          coordinatesS.push({name, longitude, latitude });
      });
      jsonObjectB.rows.forEach(item => {
        const  name ="Banche"
        const longitude = item.Longitudine;
        const latitude = item.Latitudine;
        
        // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
        coordinatesB.push({name, longitude, latitude });
    });
    jsonObjectBB.rows.forEach(item => {
      const name = "Biblioteche"
      const longitude = parseFloat(item.longitudine);
      const latitude = parseFloat(item.latitudine);
      
      // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
      coordinatesBB.push({name, longitude, latitude });
  });
  jsonObjectC.rows.forEach(item => {
    const name = "Cinema"
    const longitude = parseFloat(item.longitudine);
    const latitude = parseFloat(item.latitudine);
    
    // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
    coordinatesC.push({name, longitude, latitude });
});
jsonObjectCl.rows.forEach(item => {
  const name = "Colonnine"
  const longitude = parseFloat(item.longitudine);
  const latitude = parseFloat(item.latitudine);
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesCl.push({name,longitude, latitude });
});
jsonObjectDP.rows.forEach(item => {
  const name = "Dopo Scuola"
  const longitude = parseFloat(item.longitudine);
  const latitude = parseFloat(item.latitudine);
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesDP.push({name,longitude, latitude });
});
jsonObjectF.rows.forEach(item => {
  const name = "Farmacie"
  const longitude = parseFloat(item.xcoord);
  const latitude = parseFloat(item.ycoord);
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesF.push({name,longitude, latitude });
});
jsonObjectGB.rows.forEach(item => {
  const name = "Giochi Bimbi"
  const longitude = parseFloat(item.longitudine);
  const latitude = parseFloat(item.latitudine);
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesGB.push({name, longitude, latitude });
});
jsonObjectM.rows.forEach(item => {
  const name = "Musei"
  const longitude = parseFloat(item.longitudine);
  const latitude = parseFloat(item.latitudine);
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesM.push({name, longitude, latitude });
});
jsonObjectE.rows.forEach(item => {
  const name = "Eventi"
  const longitude = item.longitudine;
  const latitude = item.latitudine;
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesE.push({name, longitude, latitude });
});
jsonObjectT.rows.forEach(item => {
  const name = "Stazioni Treno"
  const longitude = item.longitudine;
  const latitude = item.latitudine;
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesT.push({name, longitude, latitude });
});
jsonObjectSC.rows.forEach(item => {
  const name = "Scuole"
  const longitude = parseFloat(item.longitudine);
  const latitude = parseFloat(item.latitudine);
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesSC.push({name,longitude, latitude });
});
jsonObjectR.rows.forEach(item => {
  const name = "Ristoranti"
  const longitude =item.Longitudine;
  const latitude = item.Latitudine;
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesR.push({name,longitude, latitude });
});
jsonObjectPC.rows.forEach(item => {
  const name = "Parchi"
  const longitude = parseFloat(item.longitudine);
  const latitude = parseFloat(item.latitudine);
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesPC.push({name,longitude, latitude });
});
jsonObjectP.rows.forEach(item => {
  const name = "Parcheggi"
  const longitude = parseFloat(item.longitudine);
  const latitude = parseFloat(item.latitudine);
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesP.push({name,longitude, latitude });
});
jsonObjectPL.rows.forEach(item => {
  const name = "Palestre"
  const longitude =item.longitudine;
  const latitude = item.latitudine;
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesPL.push({name,longitude, latitude });
});
jsonObjectO.rows.forEach(item => {
  const name = "Ospedali"
  const longitude = item.longitudine;
  const latitude = item.latitudine;
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesO.push({name, longitude, latitude });
});
jsonObjectI.rows.forEach(item => {
  const name = "Impianti Sportivi"
  const longitude = item.longitudine;
  const latitude = item.latitudine;
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesI.push({name, longitude, latitude });
});
jsonObjectFB.rows.forEach(item => {
  const name = "Fermate Bus"
  const longitude = item.longitudine;
  const latitude = item.latitudine;
  
  // Creare un oggetto con le coordinate estratte e aggiungerlo all'array
  coordinatesFB.push({name, longitude, latitude });
});
  
      const cordinateArray = [coordinatesFB,coordinatesB,coordinatesS,coordinatesBB,coordinatesC,coordinatesCl,coordinatesDP, coordinatesF,  coordinatesGB,  coordinatesM,coordinatesE, coordinatesT, coordinatesSC,coordinatesR,coordinatesPC,coordinatesP,coordinatesPL,coordinatesO,coordinatesI]
    res.json(cordinateArray);
  }catch(err){
      console.error(err.message);
  }
});

app.get("/getZone", async (req, res) => {
  try {
    let areabologna = await pool.query(`SELECT * FROM public.areebologna`);
    res.json(areabologna);
  } catch (error) {
    console.error(error.message);
    res.status(500).send();
  }
});



app.post('/datiForm', (req, res) => {
  coordinatesj = [];
 
  // Ricevi i dati inviati dal client
  const {geom,formData} = req.body;
  picnic = formData.vicinanza_areePicnic;
  sport = formData.vicinanza_areeSport;
  banche = formData.vicinanza_banche;
  biblio = formData.vicinanza_biblioteche;
  cinema = formData.vicinanza_cinema;
  dpscuola = formData.vicinanza_dopoScuola;
  bus = formData.vicinanza_fermateBus;
  treno = formData.vicinanza_fermateTreno;
  intrattenimento = formData.vicinanza_intrattenimentoNotturno;
  musei = formData.vicinanza_museiGallerieArte;
  ospedali = formData.vicinanza_ospedali;
  parcheggi = formData.vicinanza_parcheggi;
  colonnine = formData.vicinanza_parcheggiColonnine;
  parchi = formData.vicinanza_parchi;
  areegiochi = formData.vicinanza_parchiGiochi;
  ristorante = formData.vicinanza_ristoranti;
  scuole = formData.vicinanza_scuole;
  supermercati = formData.vicinanza_supermercati;
  farm = formData.vicinanza_farmacie;
  pal = formData.vicinanza_palestre;
  var a = JSON.parse(geom);
  const features = a.features;
    features.forEach(feature => {
        const geometry = feature.geometry;
        if (geometry.type === 'Polygon') {
            var cg = geometry.coordinates[0];


            // Crea un nuovo array con le coppie di coordinate nel formato corretto (longitudine spazio latitudine)
            let formattedCoordinates = [];
            cg.forEach(coordinate => {
              formattedCoordinates.push(`${coordinate[0]} ${coordinate[1]}`);
            });
  
            // Unisci le coordinate in una stringa separata da virgole
            let formattedString = formattedCoordinates.join(',');

            coordinatesj.push(formattedString);
        }
    });
    console.log(coordinatesj);
});


app.get('/datiForm', async(req,res)=>{
  try {

    geomcoordinate = [];
    querydin = [];
    for (let i = 0; i < coordinatesj.length; i++) {
      const query= `SELECT ST_SetSRID(ST_GeomFromText('POLYGON((${coordinatesj[i]}))'), 4326) AS geom`;
      const result = await pool.query(query);
      geomcoordinate.push(result.rows[0].geom);
    }
    var i;
    for (i=0; i <geomcoordinate.length; i++){
      querydin.push("ST_WITHIN(e.geom_casa,   ST_GeomFromWKB(E'\\\\x"+geomcoordinate[i]+"', 4326))");

    }


        const QueryCase = await pool.query(`
        SELECT
            e.id_casa,
            e.geom_casa,
            (COALESCE(numero_cinema, 0) * ${cinema}) +
            (COALESCE(numero_farmacie, 0)*${farm}) +
            (COALESCE(numero_supermercati, 0) * ${supermercati}) +
            (COALESCE(numero_ristoranti, 0) * ${ristorante}) +
            (COALESCE(numero_scuole, 0) * ${scuole}) +
            (COALESCE(numero_sport, 0) * ${sport}) +
            (COALESCE(numero_picnic, 0) * ${picnic}) +
            (COALESCE(numero_giochi, 0) * ${areegiochi}) +
            (COALESCE(numero_parchi, 0) * ${parchi}) +
            (COALESCE(numero_palestre, 0) * ${pal}) +
            (COALESCE(numero_doposcuola, 0) * ${dpscuola}) +
            (COALESCE(numero_fermatebus, 0) * ${bus}) +
            (COALESCE(numero_stazioniferroviarie, 0) * ${treno}) +
            (COALESCE(numero_parcheggi, 0) * ${parcheggi}) +
            (COALESCE(numero_colonnine, 0) * ${colonnine}) +
            (COALESCE(numero_ospedali, 0) * ${ospedali}) +
            (COALESCE(numero_banche, 0) * ${banche}) +
            (COALESCE(numero_eventi, 0) * ${intrattenimento}) +
            (COALESCE(numero_biblioteche, 0) * ${biblio}) +
            (COALESCE(numero_musei, 0) * ${musei}) AS punteggio
            
        FROM
            edifici_selezionati e
        WHERE ${querydin.join(' OR ')}
        ORDER BY punteggio DESC
        LIMIT 15;`);


        const QueryAree = await pool.query(`
          SELECT
              ar.id_area,
              ar.geom_area,
              (COALESCE(numero_cinema, 0) * ${cinema}) +
              (COALESCE(numero_farmacie, 0)*${farm}) +
              (COALESCE(numero_supermercati, 0) * ${supermercati}) +
              (COALESCE(numero_ristoranti, 0) * ${ristorante}) +
              (COALESCE(numero_scuole, 0) * ${scuole}) +
              (COALESCE(numero_sport, 0) * ${sport}) +
              (COALESCE(numero_picnic, 0) * ${picnic}) +
              (COALESCE(numero_giochi, 0) * ${areegiochi}) +
              (COALESCE(numero_parchi, 0) * ${parchi}) +
              (COALESCE(numero_palestre, 0) * ${pal}) +
              (COALESCE(numero_doposcuola, 0) * ${dpscuola}) +
              (COALESCE(numero_fermatebus, 0) * ${bus}) +
              (COALESCE(numero_stazioniferroviarie, 0) * ${treno}) +
              (COALESCE(numero_parcheggi, 0) * ${parcheggi}) +
              (COALESCE(numero_colonnine, 0) * ${colonnine}) +
              (COALESCE(numero_ospedali, 0) * ${ospedali}) +
              (COALESCE(numero_banche, 0) * ${banche}) +
              (COALESCE(numero_eventi, 0) * ${intrattenimento}) +
              (COALESCE(numero_biblioteche, 0) * ${biblio}) +
              (COALESCE(numero_musei, 0) * ${musei}) AS punteggio
              
          FROM
              aree_selezionate ar
          ORDER BY punteggio DESC`);
    console.log(QueryAree);
            
    const numcase = QueryCase.rows;
    const numaree = QueryAree.rows;
    const response = {
      infocase: numcase,
      infoaree: numaree
    }
    
    res.json(response);

  }catch (err){
      console.error(err.message);
      res.status(500).send();
  }
  
  });


    





app.post('/get', (req, res) => {
  const data = req.body;
  
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      console.log(`Chiave: ${key}, Valore: ${data[key]}`);
    }
  }
  res.send('Dati ricevuti con successo!');
});

const executePython = async (script) => {
  const py = spawn("python", [script]);

  const result = await new Promise((resolve,reject)=>{
    let output;

    py.stdout.on('data',(data)=>{ //prende output da script python
      output = JSON.parse(data);
    });

    py.stderr.on("data",(data)=>{
      console.error(`[python] Error occured: ${data}`);
      reject(`Error occured in ${script}`);
    });

    py.on("exit",(code)=>{
      console.log(`Child process exited with code ${code}`);
      resolve(output);
    });

  })
  return result;
}

app.get('/predizione', async (req, res) => {

    try {
      const result = await executePython('python/Ml4.py');
      res.json({result: result});
    } catch (error) {
      res.status(500).json({error: error});
    }

  });


  app.get('/moranIndex', async (req, res) => {

    try {
    
      const jsonFilePath = path.join(__dirname, 'python', 'moranI.json');
      
      const jsonData = await fs.readFile(jsonFilePath, 'utf8');
      
      const jsonContent = JSON.parse(jsonData);
      
      res.json(jsonContent);
    } catch (error) {
      console.error('Error reading JSON file:', error);
      res.status(500).json({ error: 'Failed to read JSON file' });
    }

  });

  app.get('/moranData', async (req, res) => {

    try {
    
      const jsonFilePath = path.join(__dirname, 'python', 'outputMoran.json');
      
      const jsonData = await fs.readFile(jsonFilePath, 'utf8');
      
      const jsonContent = JSON.parse(jsonData);
      
      res.json(jsonContent);
    } catch (error) {
      console.error('Error reading JSON file:', error);
      res.status(500).json({ error: 'Failed to read JSON file' });
    }

  });


app.listen(4000, () => {
  console.log('listening for requests on port 4000')
})

