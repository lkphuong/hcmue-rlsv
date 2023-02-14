const express = require("express");
const app = express();
app.use(express.json())

//dotenv
const dotenv = require('dotenv')
dotenv.config()

//cors
const cors = require('cors')
app.use(cors())


//#region export router
const export_controller = require('./controllers/export')
app.use('/export', export_controller)
//#endregion

app.listen(process.env.PORT, () => {
  console.log(`Hcmue export service listening on port ${process.env.PORT}`);
});
