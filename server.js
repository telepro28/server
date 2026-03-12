const express = require("express")

const app = express()
const PORT = process.env.PORT || 3000

/* lista de servidores extractores */

const servers = [
 "https://extraer1.vercel.app",
 "https://extraer-beta.vercel.app"
]

let sessions = {}

function getUserId(req,res){

 let cookie = req.headers.cookie

 if(cookie){

  const match = cookie.match(/uid=([^;]+)/)

  if(match){
   return match[1]
  }

 }

 /* crear id nuevo */

 const uid = Math.random().toString(36).substring(2,10)

 res.setHeader(
  "Set-Cookie",
  `uid=${uid}; Path=/; Max-Age=86400`
 )

 return uid
}

function getServer(uid){

 const now = Date.now()

 if(!sessions[uid]){

  const index = Math.floor(Math.random() * servers.length)

  sessions[uid] = {
   index,
   time: now
  }

 }

 const elapsed = now - sessions[uid].time

 /* cambiar servidor solo después de 1 minuto */

 if(elapsed > 60000){

  sessions[uid].index =
  (sessions[uid].index + 1) % servers.length

  sessions[uid].time = now

 }

 return servers[sessions[uid].index]

}

app.get("/play",(req,res)=>{

 const uid = getUserId(req,res)

 const server = getServer(uid)

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
 console.log("balanceador profesional activo en "+PORT)
})
