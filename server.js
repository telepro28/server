const express = require("express")

const app = express()
const PORT = process.env.PORT || 3000

const servers = [
 "https://extraer1.vercel.app",
 "https://extraer-beta.vercel.app"
]

let sessions = {}

function getClientIP(req){

 const forwarded = req.headers["x-forwarded-for"]

 if(forwarded){
  return forwarded.split(",")[0].trim()
 }

 return req.socket.remoteAddress || "0.0.0.0"
}

function getServer(ip){

 const now = Date.now()

 if(!sessions[ip]){

  /* asignar servidor inicial pseudo-random */

  const start =
  Math.floor(now / 60000) % servers.length

  sessions[ip] = {
   index: start,
   time: now
  }

 }

 const elapsed = now - sessions[ip].time

 if(elapsed > 60000){

  sessions[ip].index =
  (sessions[ip].index + 1) % servers.length

  sessions[ip].time = now

 }

 return servers[sessions[ip].index]

}

app.get("/play",(req,res)=>{

 const ip = getClientIP(req)

 const server = getServer(ip)

 if(req.query.regional){

  res.redirect(
   `${server}/play?regional=${req.query.regional}`
  )
  return
 }

 if(req.query.deportes){

  res.redirect(
   `${server}/play?deportes=${req.query.deportes}`
  )
  return
 }

 res.send("canal no especificado")

})

app.listen(PORT,()=>{
 console.log("balanceador funcionando en "+PORT)
})
