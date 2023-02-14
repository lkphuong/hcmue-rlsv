const express = require("express");
const app = express();
app.use(express.json())

//dotenv
const dotenv = require('dotenv')
dotenv.config()

//cors
const cors = require('cors')
app.use(cors())

const DEFAULT = require('./config/default')

//#region export router
const export_controller = require('./controllers/export')
app.use('/export', export_controller)
//#endregion

app.listen(process.env.PORT || DEFAULT.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT || DEFAULT.PORT}`);
});
