const app = require('./app')

//Create port
const port = process.env.PORT || 4000

app.listen(port, ()=>{
    console.log("Listening on http://localhost:"+port)
})