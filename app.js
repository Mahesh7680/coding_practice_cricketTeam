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

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const getAllPlayers = `
    SELECT 
      *
    FROM 
      cricket_team;`;
  const playersArray = await db.all(getAllPlayers); // .all is used to all the rows available in it
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});

//CREATE playerDetails

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  let { player_name, jersey_number, role } = playerDetails;
  const add_Player_query = `
  INSERT INTO
    cricket_team( player_name, jersey_number, role)
  VALUES
    (  '${playerName}',
        ${jerseyNumber},
        '${role}'
    );
    `;
  const dbResponse = await db.run(add_Player_query);
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
  response.send(convertDbObjectToResponseObject(player));
});

//delete book

app.get("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let removePlayerDetails = `
    DELETE FROM 
        cricket_team
    WHERE
        player_id = ${playerId};`;
  await db.run(removePlayerDetails); //.get used for single row in the outcome
  response.send("Player Removed");
});

//put book

app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const updateQuery = `
    UPDATE
      cricket_team
    SET 
      player_name = '${playerName}',
      jersey_number = ${jerseyNumber},
      role = '${role}'
    WHERE
      player_id = ${playerId};`;
  await db.run(updateQuery);
  response.send("Player Details Updated");
});
