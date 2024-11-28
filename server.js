import configureApp from "./src/config/app.config.js";
import connectDatabase from "./src/db/db.connection.js";

// INITILIZE APP
const app = configureApp();

// CALL DB CONNECTIVITY METHOD
connectDatabase();

// START THE SERVER
app.listen(process.env.PORT || 6000, () => {
  console.log("Server running on port-", process.env.PORT || 5000);
});
