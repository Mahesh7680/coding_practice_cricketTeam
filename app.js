const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const DbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDbServer = async () => {
  try {
    db = await open({
      filename: DbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running on 3000 port");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDbServer();

module.exports = app;

//GET all playersDetails

app.get("/players/", async (request, response) => {
  const getAllPlayers = `
    SELECT 
      *
    FROM 
      cricket_team;`;
  const playersArray = await db.all(getAllPlayers); // .all is used to all the rows available in it
  response.send(playersArray);
});

//CREATE playerDetails

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  let { player_id, player_name, jersey_number, role } = playerDetails;
  const addPlayerDetails = `
  INSERT INTO
    cricket_team(player_id, player_name, jersey_number, role)
  VALUES
    (
        '${player_id}',
        ${player_name},
        ${jersey_number},
        ${role}
    )
    `;
  const dbResponse = await db.run(addPlayerDetails);
  const playerId = dbResponse.player_id;
  response.send({ playerId: playerId });
  response.send("Player Added to Team");
});

//GET playerDetails

app.get("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let getPlayerDetails = `
    SELECT 
        *
    FROM 
        cricket_team
    WHERE
        player_id = ${playerId};`;
  const player = await db.get(getPlayerDetails); //.get used for single row in the outcome
  response.send(player);
});
