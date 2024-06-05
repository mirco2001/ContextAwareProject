// backend/index.js
const express = require('express')
const cors = require('cors')
const pool = require('./db')

const app = express()

app.use(cors())
app.use(express.json())

// app.get('/', (req, res) => {
//   res.send([
//     {
//       "id":"1",
//       "title":"Book Review: The Name of the Wind"
//     },
//     {
//       "id":"2",
//       "title":"Game Review: Pokemon Brillian Diamond"
//     },
//     {
//       "id":"3",
//       "title":"Show Review: Alice in Borderland"
//     }
//   ])
// })

//create a todo
// app.post("/todos", async (req,res) => {
//   try{
//       const {number} =req.body;
//       const query = await pool.query("INSERT INTO descriptions (number) VALUES($1) RETURNING *",[number]);
//       const queryJSON = JSON.stringify(query);
//       console.log(queryJSON);
//       res.json(newToDo.rows[0]);
//   }catch(err){
//       console.error(err.message);
//   }
// });

app.get('/', async (req, res) => {
    const query = await pool.query('SELECT * FROM descriptions');
    try {
      const query = await pool.query('SELECT * FROM descriptions');
      res.json(query.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send();
    }
  });

app.listen(4000, () => {
  console.log('listening for requests on port 4000')
})

