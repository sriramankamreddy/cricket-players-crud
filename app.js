const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//api-1 get all the books

app.get("/players/", async (request, response) => {
  const getTeamQuery = `
    SELECT
      *
    FROM
      cricket_team;`;
  const teamArray = await db.all(getTeamQuery);
  response.send(teamArray);
});

//api-2 add a book

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  try {
    const addPlayerQuery = `
    INSERT INTO 
    cricket_team 
    (player_name,jersey_number,role)
    VALUES 
    (
       '${playerName}',
        ${jerseyNumber},
        '${role}');`;
    const dbResponse = await db.run(addPlayerQuery);
    const playerId = dbResponse.lastID;
    response.send({ playerId: playerId });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
  }
});

//api-3 get book using playerId

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayersQuery = `
    SELECT 
        * 
    FROM 
        cricket_team
    WHERE
        player_id= ${playerId};`;
  const player = await db.get(getPlayersQuery);
  response.send(player);
});

// api 4 update book

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  try {
    const updatePlayerQuery = `
    UPDATE  cricket_team
    SET player_name=${playerName}, jersey_number=${jerseyNumber}, role=${role}
    WHERE player_id=${playerId};`;
    await db.run(updatePlayerQuery);
    response.send("Player Updated Successfully");
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
  }
});

//api-5 delete a book
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM 
        cricket_team 
    WHERE 
        player_id= ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Deleted Player Successfully");
});
