const express = require("express");
const { init } = require("./middleware/middleware");

const app = express();
const PORT=8000;
init(app);
app.get('/users',(res,req)=>{
    console.log('')
})
app.listen(PORT,()=>console.log('Listening on port :'+PORT))