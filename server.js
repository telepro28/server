const express = require("express")

const app = express()
const PORT = process.env.PORT || 3000

/* servidores extractores */

const servers = [
 "https://extraer1.vercel.app",
 "https://extraer-beta.vercel.app"
]

/* guardar sesión por IP */

let sessions = {}

function getServer(ip){

 const now = Date.now()

 if(!sessions[ip]){
  sessions[ip] = {
   index: 0,
   time: now
  }
 }

 const elapsed = now - sessions[ip].time

 /* si pasó 1 minuto cambia servidor */

 if(elapsed > 60000){

  sessions[ip].index =
  (sessions[ip].index + 1) % servers.length

  sessions[ip].time = now

 }

 return servers[sessions[ip].index]

}

app.get("/play",(req,res)=>{

 const ip =
 req.headers["x-forwarded-for"] ||
 req.socket.remoteAddress ||
 "0.0.0.0"

 const server = getServer(ip)

 if(req.query.regional){

  const url =
  `${server}/play?regional=${req.query.regional}`

  res.redirect(url)
  return

 }

 if(req.query.deportes){

  const url =
  `${server}/play?deportes=${req.query.deportes}`

  res.redirect(url)
  return

 }

 res.send("canal no especificado")

})

app.listen(PORT,()=>{
 console.log("balanceador inteligente en "+PORT)
})
