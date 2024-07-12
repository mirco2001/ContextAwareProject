const express = require('express')
const cors = require('cors')
const pool = require('./db')
const { spawn } = require('child_process')
const fs = require('fs').promises;
const path = require('path');
const os = require('os');


const app = express()

app.use(cors())
app.use(express.json())

//variabili globali

let cinema = 2;
let picnic = 2;
let sport = 2;
let banche = 2;
let biblio = 2;
let dpscuola = 2;
let bus = 2;
let treno = 2;
let intrattenimento = 2;
let musei = 2;
let ospedali = 2;
let parcheggi = 2;
let colonnine = 2;
let parchi = 2;
let areegiochi = 2;
let ristorante = 2;
let scuole = 2;
let supermercati = 2;
let farm = 2;
let pal = 2;
let coordinates;
let dltpoi = [];
let istpoi = [];
let coordinatesj = [];
let geomcoordinate = [];


//richiesta get che permette di ottenere latitudine, longitudine, id di tutti i PoI presenti nel nostro db
app.get("/Poi", async (req, res) => {
  try {
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
    const queryBB = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine, ogc_fid as id FROM biblioteche`);
    const queryJSONBB = JSON.stringify(queryBB);
    const jsonObjectBB = JSON.parse(queryJSONBB);
    const queryC = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine, ogc_fid as id FROM cinema`);
    const queryJSONC = JSON.stringify(queryC);
    const jsonObjectC = JSON.parse(queryJSONC);
    const queryCl = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine, ogc_fid as id FROM colonnine`);
    const queryJSONCl = JSON.stringify(queryCl);
    const jsonObjectCl = JSON.parse(queryJSONCl);
    const queryDP = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine, ogc_fid as id FROM doposcuola`);
    const queryJSONDP = JSON.stringify(queryDP);
    const jsonObjectDP = JSON.parse(queryJSONDP);
    const queryF = await pool.query(`SELECT * FROM farmacie`);
    const queryJSONF = JSON.stringify(queryF);
    const jsonObjectF = JSON.parse(queryJSONF);
    const queryGB = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine, ogc_fid as id FROM giochibimbi`);
    const queryJSONGB = JSON.stringify(queryGB);
    const jsonObjectGB = JSON.parse(queryJSONGB);
    const queryM = await pool.query(`SELECT * FROM musei`);
    const queryJSONM = JSON.stringify(queryM);
    const jsonObjectM = JSON.parse(queryJSONM);
    const queryE = await pool.query(`SELECT  ST_X(wkb_geometry) AS Longitudine, ST_Y(wkb_geometry) AS Latitudine, ogc_fid as id FROM eventi`);
    const queryJSONE = JSON.stringify(queryE);
    const jsonObjectE = JSON.parse(queryJSONE);
    const queryT = await pool.query(`SELECT  ST_X(wkb_geometry) AS Longitudine, ST_Y(wkb_geometry) AS Latitudine, ogc_fid as id FROM stazioniferroviarie`);
    const queryJSONT = JSON.stringify(queryT);
    const jsonObjectT = JSON.parse(queryJSONT);
    const querySC = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine, ogc_fid as id FROM scuole`);
    const queryJSONSC = JSON.stringify(querySC);
    const jsonObjectSC = JSON.parse(queryJSONSC);
    const queryR = await pool.query(`SELECT * FROM ristoranti`);
    const queryJSONR = JSON.stringify(queryR);
    const jsonObjectR = JSON.parse(queryJSONR);
    const queryPC = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine, ogc_fid as id FROM parchi`);
    const queryJSONPC = JSON.stringify(queryPC);
    const jsonObjectPC = JSON.parse(queryJSONPC);
    const queryP = await pool.query(`SELECT geo_point_2d->>'lon' as Longitudine, geo_point_2d->>'lat' as Latitudine, ogc_fid as id FROM parcheggi`);
    const queryJSONP = JSON.stringify(queryP);
    const jsonObjectP = JSON.parse(queryJSONP);
    const queryPL = await pool.query(`SELECT * FROM palestre`);
    const queryJSONPL = JSON.stringify(queryPL);
    const jsonObjectPL = JSON.parse(queryJSONPL);
    const queryO = await pool.query(`SELECT  ST_X(wkb_geometry) AS Longitudine, ST_Y(wkb_geometry) AS Latitudine, ogc_fid as id FROM ospedali`);
    const queryJSONO = JSON.stringify(queryO);
    const jsonObjectO = JSON.parse(queryJSONO);
    const queryI = await pool.query(`SELECT  ST_X(geom) AS Longitudine, ST_Y(geom) AS Latitudine, gid as id FROM impianti_sportivi`);
    const queryJSONI = JSON.stringify(queryI);
    const jsonObjectI = JSON.parse(queryJSONI);
    const queryFB = await pool.query(`SELECT  ST_X(wkb_geometry) AS Longitudine, ST_Y(wkb_geometry) AS Latitudine, ogc_fid as id FROM fermatebus`);
    const queryJSONFB = JSON.stringify(queryFB);
    const jsonObjectFB = JSON.parse(queryJSONFB);

    jsonObjectS.rows.forEach(item => {
      const id = item.ogc_fid;
      const name = "Supermercati"
      const longitude = item.Longitudine;
      const latitude = item.Latitudine;

      coordinatesS.push({ name, longitude, latitude, id });
    });
    jsonObjectB.rows.forEach(item => {
      const id = item.ogc_fid;
      const name = "Banche"
      const longitude = item.Longitudine;
      const latitude = item.Latitudine;

      coordinatesB.push({ name, longitude, latitude, id });
    });
    jsonObjectBB.rows.forEach(item => {
      const id = item.id;
      const name = "Biblioteche"
      const longitude = parseFloat(item.longitudine);
      const latitude = parseFloat(item.latitudine);

      coordinatesBB.push({ name, longitude, latitude, id });
    });
    jsonObjectC.rows.forEach(item => {
      const id = item.id;
      const name = "Cinema"
      const longitude = parseFloat(item.longitudine);
      const latitude = parseFloat(item.latitudine);

      coordinatesC.push({ name, longitude, latitude, id });
    });
    jsonObjectCl.rows.forEach(item => {
      const id = item.id;
      const name = "Colonnine"
      const longitude = parseFloat(item.longitudine);
      const latitude = parseFloat(item.latitudine);

      coordinatesCl.push({ name, longitude, latitude, id });
    });
    jsonObjectDP.rows.forEach(item => {
      const id = item.id;
      const name = "Dopo Scuola"
      const longitude = parseFloat(item.longitudine);
      const latitude = parseFloat(item.latitudine);

      coordinatesDP.push({ name, longitude, latitude, id });
    });
    jsonObjectF.rows.forEach(item => {
      const id = item.ogc_fid;
      const name = "Farmacie"
      const longitude = parseFloat(item.xcoord);
      const latitude = parseFloat(item.ycoord);

      coordinatesF.push({ name, longitude, latitude, id });
    });
    jsonObjectGB.rows.forEach(item => {
      const id = item.id;
      const name = "Giochi Bimbi"
      const longitude = parseFloat(item.longitudine);
      const latitude = parseFloat(item.latitudine);

      coordinatesGB.push({ name, longitude, latitude, id });
    });
    jsonObjectM.rows.forEach(item => {
      const id = item.ogc_fid;
      const name = "Musei"
      const longitude = parseFloat(item.longitudine);
      const latitude = parseFloat(item.latitudine);

      coordinatesM.push({ name, longitude, latitude, id });
    });
    jsonObjectE.rows.forEach(item => {
      const id = item.id;
      const name = "Eventi"
      const longitude = item.longitudine;
      const latitude = item.latitudine;

      coordinatesE.push({ name, longitude, latitude, id });
    });
    jsonObjectT.rows.forEach(item => {
      const id = item.id;
      const name = "Stazioni Treno"
      const longitude = item.longitudine;
      const latitude = item.latitudine;

      coordinatesT.push({ name, longitude, latitude, id });
    });
    jsonObjectSC.rows.forEach(item => {
      const id = item.id;
      const name = "Scuole"
      const longitude = parseFloat(item.longitudine);
      const latitude = parseFloat(item.latitudine);

      coordinatesSC.push({ name, longitude, latitude, id });
    });
    jsonObjectR.rows.forEach(item => {
      const id = item.ogc_fid;
      const name = "Ristoranti"
      const longitude = item.Longitudine;
      const latitude = item.Latitudine;

      coordinatesR.push({ name, longitude, latitude, id });
    });
    jsonObjectPC.rows.forEach(item => {
      const id = item.id;
      const name = "Parchi"
      const longitude = parseFloat(item.longitudine);
      const latitude = parseFloat(item.latitudine);

      coordinatesPC.push({ name, longitude, latitude, id });
    });
    jsonObjectP.rows.forEach(item => {
      const id = item.id;
      const name = "Parcheggi"
      const longitude = parseFloat(item.longitudine);
      const latitude = parseFloat(item.latitudine);

      coordinatesP.push({ name, longitude, latitude, id });
    });
    jsonObjectPL.rows.forEach(item => {
      const id = item.ogc_fid;
      const name = "Palestre"
      const longitude = item.longitudine;
      const latitude = item.latitudine;

      coordinatesPL.push({ name, longitude, latitude, id });
    });
    jsonObjectO.rows.forEach(item => {
      const id = item.id;
      const name = "Ospedali"
      const longitude = item.longitudine;
      const latitude = item.latitudine;

      coordinatesO.push({ name, longitude, latitude, id });
    });
    jsonObjectI.rows.forEach(item => {
      const id = item.id;
      const name = "Impianti Sportivi"
      const longitude = item.longitudine;
      const latitude = item.latitudine;

      coordinatesI.push({ name, longitude, latitude, id });
    });
    jsonObjectFB.rows.forEach(item => {
      const id = item.id;
      const name = "Fermate Bus"
      const longitude = item.longitudine;
      const latitude = item.latitudine;

      coordinatesFB.push({ name, longitude, latitude, id });
    });

    const cordinateArray = [coordinatesFB, coordinatesB, coordinatesS, coordinatesBB, coordinatesC, coordinatesCl, coordinatesDP, coordinatesF, coordinatesGB, coordinatesM, coordinatesE, coordinatesT, coordinatesSC, coordinatesR, coordinatesPC, coordinatesP, coordinatesPL, coordinatesO, coordinatesI]
    res.json(cordinateArray);
  } catch (err) {
    console.error(err.message);
  }
});


//metodo post che riceve ciò che viene effettuato nella pagina di aggiunta/rimozione PoI, in particolare all'interno vengono effettuate delete o insert in base al PoI di riferimento arrivato dal frontend, successivamente vengono aggiornate le viste per ottenere tutti i risultati necessari nelle successive richieste
app.post('/DIPoI', async (req, res) => {
  try {


    // Ricevi i dati inviati dal client
    const { addList, deletedList } = req.body;

    if (addList && Array.isArray(addList)) {
      addList.forEach(item => {
        // Verifica che l'oggetto contenga le proprietà 'name' e 'coordinates'
        if (item.name && item.coordinates && item.coordinates.lon && item.coordinates.lat) {
          istpoi.push({
            name: item.name,
            lon: item.coordinates.lon,
            lat: item.coordinates.lat
          });
        }
      });
    }

    if (deletedList && Array.isArray(deletedList)) {
      deletedList.forEach(item => {
        // Verifica che l'oggetto contenga le proprietà 'name' e 'coordinates'
        if (item.id && item.name && item.longitudine && item.latitudine) {
          dltpoi.push({
            id: item.id,
            name: item.name,
            lon: item.longitudine,
            lat: item.latitudine
          });
        }
      });
    }


    dltpoi.forEach(async item => {
      if (item.name == "Supermercati") {
        var dlt = await pool.query(`DELETE  FROM Supermercati Where ogc_fid = ${item.id}`);
      }

      if (item.name == "Banche") {
        var dlt = await pool.query(`DELETE  FROM banche Where ogc_fid = ${item.id}`);
      }

      if (item.name == "Fermate Bus") {
        var dlt = await pool.query(`DELETE  FROM fermatebus Where ogc_fid = ${item.id}`);
      }

      if (item.name == "Impianti Sportivi") {
        var dlt = await pool.query(`DELETE  FROM impianti_sportivi Where gid = ${item.id}`);
      }

      if (item.name == "Ospedali") {
        var dlt = await pool.query(`DELETE  FROM ospedali Where ogc_fid = ${item.id}`);
      }

      if (item.name == "Palestre") {
        var dlt = await pool.query(`DELETE  FROM palestre Where ogc_fid = ${item.id}`);
      }

      if (item.name == "Parcheggi") {
        var dlt = await pool.query(`DELETE  FROM parcheggi Where ogc_fid = ${item.id}`);
      }

      if (item.name == "Parchi") {
        var dlt = await pool.query(`DELETE  FROM parchi Where ogc_fid = ${item.id}`);
      }

      if (item.name == "Musei") {
        var dlt = await pool.query(`DELETE  FROM musei Where ogc_fid = ${item.id}`);
      }

      if (item.name == "Farmacie") {
        var dlt = await pool.query(`DELETE  FROM farmacie Where ogc_fid = ${item.id}`);
      }

      if (item.name == "Ristoranti") {
        var dlt = await pool.query(`DELETE  FROM ristoranti Where ogc_fid = ${item.id}`);
      }

      if (item.name == "Scuole") {
        var dlt = await pool.query(`DELETE  FROM scuole Where ogc_fid = ${item.id}`);
      }

      if (item.name == "Stazioni Treno") {
        var dlt = await pool.query(`DELETE  FROM stazioniferroviarie Where ogc_fid = ${item.id}`);
      }

      if (item.name == "Colonnine") {
        var dlt = await pool.query(`DELETE  FROM colonnine Where ogc_fid = ${item.id}`);
      }

      if (item.name == "Eventi") {
        var dlt = await pool.query(`DELETE  FROM eventi Where ogc_fid = ${item.id}`);
      }

      if (item.name == "Giochi Bimbi") {
        var dlt = await pool.query(`DELETE  FROM giochibimbi Where ogc_fid = ${item.id}`);
      }

      if (item.name == "Dopo Scuola") {
        var dlt = await pool.query(`DELETE  FROM doposcuola Where ogc_fid = ${item.id}`);
      }

      if (item.name == "Biblioteche") {
        var dlt = await pool.query(`DELETE  FROM biblioteca Where ogc_fid = ${item.id}`);
      }
    });
    istpoi.forEach(async item => {
      if (item.name == "Supermercati") {
        var insert = await pool.query(`INSERT INTO supermercati ("Nome", "Latitudine", "Longitudine") VALUES ('${item.name}', ${item.lat}, ${item.lon});`);
      }

      if (item.name == "Banche") {
        var insert = await pool.query(`INSERT INTO banche ("Nome",  "Latitudine", "Longitudine") VALUES ('${item.name}', ${item.lat}, ${item.lon});`);
      }

      if (item.name == "Fermate Bus") {
        var insert = await pool.query(`INSERT INTO fermatebus ("quartiere", "wkb_geometry") VALUES ('${item.name}', ST_SetSRID(ST_MakePoint(${item.lon}, ${item.lat}), 4326));`);
      }

      if (item.name == "Impianti Sportivi") {
        var insert = await pool.query(`INSERT INTO impianti_sportivi ("complesso_s", "geom") VALUES ('${item.name}', ST_SetSRID(ST_MakePoint(${item.lon}, ${item.lat}), 4326));`);
      }
      if (item.name == "Ospedali") {
        var insert = await pool.query(`INSERT INTO ospedali ("tipologia", "wkb_geometry") VALUES  ('${item.name}',  ST_SetSRID(ST_MakePoint(${item.lon}, ${item.lat}), 4326));`);
      }
      if (item.name == "Palestre") {
        var insert = await pool.query(`INSERT INTO palestre ("area",  "latitudine", "longitudine") VALUES ('${item.name}',  ${item.lat}, ${item.lon});`);
      }

      if (item.name == "Parcheggi") {
        var insert = await pool.query(`INSERT INTO parcheggi ("name",  "geo_point_2d") VALUES  ('${item.name}',  '{"lon": ${item.lon}, "lat": ${item.lat}}'::json);`);
      }

      if (item.name == "Parchi") {
        var insert = await pool.query(`INSERT INTO parchi ("tipo",  "geo_point_2d") VALUES  ('${item.name}', '{"lon": ${item.lon}, "lat": ${item.lat}}'::json);`);
      }

      if (item.name == "Musei") {
        var insert = await pool.query(`INSERT INTO musei ("titolo", "latitudine","longitudine") VALUES  ('${item.name}',  ${item.lat}, ${item.lon});`);
      }

      if (item.name == "Farmacie") {
        var insert = await pool.query(`INSERT INTO farmacie ("farmacia",  "xcoord","ycoord") VALUES  ('${item.name}', ${item.lon},  ${item.lat});`);
      }

      if (item.name == "Ristoranti") {
        var insert = await pool.query(`INSERT INTO ristoranti ("tipologia",  "Latitudine","Longitudine") VALUES  ('${item.name}', ${item.lat}, ${item.lon});`);
      }

      if (item.name == "Scuole") {
        var insert = await pool.query(`INSERT INTO scuole ("nome",  "geo_point_2d") VALUES  ('${item.name}',  '{"lon": ${item.lon}, "lat": ${item.lat}}'::json);`);
      }

      if (item.name == "Stazioni Treno") {
        var insert = await pool.query(`INSERT INTO stazioniferroviarie ("nomezona",  "wkb_geometry") VALUES  ('${item.name}', ST_SetSRID(ST_MakePoint(${item.lon},${item.lat}), 4326));`);
      }

      if (item.name == "Colonnine") {
        var insert = await pool.query(`INSERT INTO colonnine ("operatore", "geo_point_2d") VALUES  ('${item.name}',  '{"lon": ${item.lon}, "lat": ${item.lat}}'::json);`);
      }

      if (item.name == "Eventi") {
        var insert = await pool.query(`INSERT INTO eventi ("title",  "wkb_geometry") VALUES  ('${item.name}',  ST_SetSRID(ST_MakePoint(${item.lon}, ${item.lat}), 4326));`);
      }

      if (item.name == "Giochi Bimbi") {
        var insert = await pool.query(`INSERT INTO giochibimbi ("categoria",  "geo_point_2d") VALUES  ('${item.name}',  '{"lon": ${item.lon}, "lat": ${item.lat}}'::json);`);
      }

      if (item.name == "Dopo Scuola") {
        var insert = await pool.query(`INSERT INTO doposcuola ("nome",  "geo_point_2d") VALUES  ('${item.name}', '{"lon": ${item.lon}, "lat": ${item.lat}}'::json);`);
      }

      if (item.name == "Biblioteche") {
        var insert = await pool.query(`INSERT INTO biblioteche ("biblioteca",  "geo_point_2d") VALUES  ('${item.name}',  '{"lon": ${item.lon}, "lat": ${item.lat}}'::json);`);
      }
    });

    var refresh1 = await pool.query(`REFRESH MATERIALIZED VIEW biblioteche_vicini;`);
    var refresh2 = await pool.query(`REFRESH MATERIALIZED VIEW eventi_vicini;`);
    var refresh3 = await pool.query(`REFRESH MATERIALIZED VIEW sport_vicini;`);
    var refresh4 = await pool.query(`REFRESH MATERIALIZED VIEW picnic_vicini;`);
    var refresh5 = await pool.query(`REFRESH MATERIALIZED VIEW giochi_vicini;`);
    var refresh6 = await pool.query(`REFRESH MATERIALIZED VIEW parchi_vicini;`);
    var refresh7 = await pool.query(`REFRESH MATERIALIZED VIEW palestre_vicini;`);
    var refresh8 = await pool.query(`REFRESH MATERIALIZED VIEW doposcuola_vicini;`);
    var refresh9 = await pool.query(`REFRESH MATERIALIZED VIEW fermatebus_vicini;`);
    var refresh10 = await pool.query(`REFRESH MATERIALIZED VIEW stazioniferroviarie_vicini;`);
    var refresh11 = await pool.query(`REFRESH MATERIALIZED VIEW parcheggi_vicini;`);
    var refresh12 = await pool.query(`REFRESH MATERIALIZED VIEW ospedali_vicini;`);
    var refresh13 = await pool.query(`REFRESH MATERIALIZED VIEW banche_vicini;`);
    var refresh14 = await pool.query(`REFRESH MATERIALIZED VIEW cinema_vicini;`);
    var refresh15 = await pool.query(`REFRESH MATERIALIZED VIEW musei_vicini;`);
    var refresh16 = await pool.query(`REFRESH MATERIALIZED VIEW farmacie_vicini;`);
    var refresh17 = await pool.query(`REFRESH MATERIALIZED VIEW supermercati_vicini;`);
    var refresh18 = await pool.query(`REFRESH MATERIALIZED VIEW ristoranti_vicini;`);
    var refresh19 = await pool.query(`REFRESH MATERIALIZED VIEW scuole_vicini;`);
    var refresh20 = await pool.query(`REFRESH MATERIALIZED VIEW colonnine_vicini;`);
    var rf = await pool.query(`REFRESH MATERIALIZED VIEW biblioteche_vicinia;`);
    var rf2 = await pool.query(`REFRESH MATERIALIZED VIEW eventi_vicinia;`);
    var rf3 = await pool.query(`REFRESH MATERIALIZED VIEW sport_vicinia;`);
    var rf4 = await pool.query(`REFRESH MATERIALIZED VIEW picnic_vicinia;`);
    var rf5 = await pool.query(`REFRESH MATERIALIZED VIEW giochi_vicinia;`);
    var rf6 = await pool.query(`REFRESH MATERIALIZED VIEW parchi_vicinia;`);
    var rf7 = await pool.query(`REFRESH MATERIALIZED VIEW palestre_vicinia;`);
    var rf8 = await pool.query(`REFRESH MATERIALIZED VIEW doposcuola_vicinia;`);
    var rf9 = await pool.query(`REFRESH MATERIALIZED VIEW fermatebus_vicinia;`);
    var rf10 = await pool.query(`REFRESH MATERIALIZED VIEW stazioniferroviarie_vicinia;`);
    var rf11 = await pool.query(`REFRESH MATERIALIZED VIEW parcheggi_vicinia;`);
    var rf12 = await pool.query(`REFRESH MATERIALIZED VIEW ospedali_vicinia;`);
    var rf13 = await pool.query(`REFRESH MATERIALIZED VIEW banche_vicinia;`);
    var rf14 = await pool.query(`REFRESH MATERIALIZED VIEW cinema_vicinia;`);
    var rf15 = await pool.query(`REFRESH MATERIALIZED VIEW musei_vicinia;`);
    var rf16 = await pool.query(`REFRESH MATERIALIZED VIEW farmacie_vicinia;`);
    var rf17 = await pool.query(`REFRESH MATERIALIZED VIEW supermercati_vicinia;`);
    var rf18 = await pool.query(`REFRESH MATERIALIZED VIEW ristoranti_vicinia;`);
    var rf19 = await pool.query(`REFRESH MATERIALIZED VIEW scuole_vicinia;`);
    var rf20 = await pool.query(`REFRESH MATERIALIZED VIEW colonnine_vicinia;`);
    var rfh = await pool.query(`REFRESH MATERIALIZED VIEW aree_selezionate;`);
    var refresh = await pool.query(`REFRESH MATERIALIZED VIEW edifici_selezionati;`);
    var refresh = await pool.query(`REFRESH MATERIALIZED VIEW vista_poi_aggregata_cluster;`);
    var rfh = await pool.query(`REFRESH MATERIALIZED VIEW clustered_centroids;`);
    var refresh = await pool.query(`REFRESH MATERIALIZED VIEW vista_cluster_poi_aggregati;`);

    istpoi = [];
    dltpoi = [];

  } catch (error) {
    console.error(error.message);
    res.status(500).send();
  }

});


//funzione per ottenere tutte le zone di bologna presenti nel db
app.get("/getZone", async (req, res) => {
  try {
    let areabologna = await pool.query(`SELECT * FROM public.areebologna`);
    res.json(areabologna);
  } catch (error) {
    console.error(error.message);
    res.status(500).send();
  }
});


//ottenimento delle valutazioni per i PoI immesse dal frontend nel form
app.post("/datiForm", async (req, res) => {
  try {

    const formData = req.body.formData;
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

  } catch (error) {
    console.error(error.message);
    res.status(500).send();
  }
});



//ottenimento dei dati delle geometrie relative alle zone selezionate in fase di ricerca
app.post('/datiSearch', (req, res) => {
  coordinatesj = [];

  // Ricevi i dati inviati dal client
  const geom = req.body.geom;

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

});


//ottenimento delle aree di bologna consigliate tenendo conto delle valutazioni dei PoI
app.get("/getAree", async (req, res) => {
  try {
    const QueryAree = await pool.query(`
      SELECT
          ar.id_area,
          ar.nome,
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

    const numaree = QueryAree.rows;
    const response = {
      infoaree: numaree
    }

    res.json(response);



  } catch (error) {
    console.error(error.message);
    res.status(500).send();
  }
});


//ottenimento delle case consigliate nelle zone selezionate tenendo conto della valutazione dei PoI
app.get('/datiForm', async (req, res) => {
  try {

    geomcoordinate = [];
    querydin = [];
    var QueryCase;

    for (let i = 0; i < coordinatesj.length; i++) {
      const query = `SELECT ST_SetSRID(ST_GeomFromText('POLYGON((${coordinatesj[i]}))'), 4326) AS geom`;
      const result = await pool.query(query);
      geomcoordinate.push(result.rows[0].geom);
    }
    var i;
    for (i = 0; i < geomcoordinate.length; i++) {
      querydin.push("ST_WITHIN(e.geom_casa,   ST_GeomFromWKB(E'\\\\x" + geomcoordinate[i] + "', 4326))");

    }

    if (querydin.length > 0) {
      const where = "WHERE " + querydin.join(' OR ')
      QueryCase = await pool.query(`
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
        ${where}
        ORDER BY punteggio DESC
        LIMIT 15;`);
    } else {
      QueryCase = await pool.query(`
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
        ORDER BY punteggio DESC
        LIMIT 15;`);
    }


    const numcase = QueryCase.rows;
    const response = {
      infocase: numcase
    }

    res.json(response);

  } catch (err) {
    console.error(err.message);
    res.status(500).send();
  }

});


//ottenimento dei centroidi dei cluster ordinati per importanza in base alle valutazioni dei PoI
app.get('/datiCluster', async (req, res) => {
  try {

    const queryCluster = await pool.query(`SELECT
        cc.cid,
        cc.centroide,
        (COALESCE(vc.num_cinema, 0) * ${cinema}) +
        (COALESCE(vc.num_farmacie, 0) * ${farm}) +
        (COALESCE(vc.num_supermercati, 0) * ${supermercati}) +
        (COALESCE(vc.num_ristoranti, 0) * ${ristorante}) +
        (COALESCE(vc.num_scuole, 0) * ${scuole}) +
        (COALESCE(vc.num_impiantisportivi, 0) * ${sport}) +
        (COALESCE(vc.num_parchi, 0) * ${picnic}) +
        (COALESCE(vc.num_giochibimbi, 0) * ${areegiochi}) +
        (COALESCE(vc.num_parchi, 0) * ${parchi}) +
        (COALESCE(vc.num_palestre, 0) * ${pal}) +
        (COALESCE(vc.num_doposcuola, 0) * ${dpscuola}) +
        (COALESCE(vc.num_fermatebus, 0) * ${bus}) +
        (COALESCE(vc.num_stazioniferroviarie, 0) * ${treno}) +
        (COALESCE(vc.num_parcheggi, 0) * ${parcheggi}) +
        (COALESCE(vc.num_colonnine, 0) * ${colonnine}) +
        (COALESCE(vc.num_ospedali, 0) * ${ospedali}) +
        (COALESCE(vc.num_banche, 0) * ${banche}) +
        (COALESCE(vc.num_eventi, 0) * ${intrattenimento}) +
        (COALESCE(vc.num_biblioteche, 0) * ${biblio}) +
        (COALESCE(vc.num_musei, 0) * ${musei}) AS punteggio
    FROM
        clustered_centroids cc
    LEFT JOIN
        vista_cluster_poi_aggregati vc ON cc.cid = vc.cid
    ORDER BY punteggio DESC
    LIMIT 15;`);

    const numcluster = queryCluster.rows;


    res.json(numcluster);


  } catch (err) {
    console.error(err.message);
    res.status(500).send();
  }

});


//funzione asincrona che esegue script python e restituisce come output il contenuto inserito nella print alla fine del file come json
const executePython = async (script) => {
  const py = spawn("python", [script]);

  const result = await new Promise((resolve, reject) => {
    let output;

    py.stdout.on('data', (data) => { //prende output da script python
      output = JSON.parse(data);
    });

    py.stderr.on("data", (data) => {
      console.error(`[python] Error occured: ${data}`);
      reject(`Error occured in ${script}`);
    });

    py.on("exit", (code) => {
      console.log(`Child process exited with code ${code}`);
      resolve(output);
    });

  })
  return result;
}


//chiamata a script python per ottenere i dati della predizione
app.get('/predizione', async (req, res) => {

  try {
    const result = await executePython('python/Ml4.py');
    res.json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error });
  }

});

//legge e restituisce contenuto del file json con il dato riguardabte l'indice di Moran
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

//legge e restituisce contenuto del file json con il calcolo del Moran locale in base alle zone di Bologna
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


//funzione per i punteggi dei PoI
app.get("/getPoI", async (req, res) => {
  try {
    const listPoi = {
      vicinanza_cinema: cinema ,
      vicinanza_areePicnic: picnic ,
      vicinanza_areeSport: sport ,
      vicinanza_banche: banche ,
      vicinanza_biblioteche: biblio ,
      vicinanza_dopoScuola: dpscuola ,
      vicinanza_fermateBus: bus ,
      vicinanza_fermateTreno: treno ,
      vicinanza_intrattenimentoNotturno: intrattenimento ,
      vicinanza_museiGallerieArte: musei ,
      vicinanza_ospedali: ospedali ,
      vicinanza_parcheggi: parcheggi ,
      vicinanza_parcheggiColonnine: colonnine ,
      vicinanza_parchi: parchi ,
      vicinanza_parchiGiochi: areegiochi ,
      vicinanza_ristoranti: ristorante ,
      vicinanza_scuole: scuole ,
      vicinanza_supermercati: supermercati ,
      vicinanza_farmacie: farm ,
      vicinanza_palestre: pal
    };

    res.json(listPoi);
  } catch (error) {
    console.error(error.message);
    res.status(500).send();
  }
});


app.listen(4000, () => {
  console.log('listening for requests on port 4000')
})



