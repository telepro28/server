const express = require("express")
const https = require("https")

const app = express()
const PORT = process.env.PORT || 3000

/* lista de servidores extractores */

const servers = [
 "https://extraer1.vercel.app",
 "https://extraer-beta.vercel.app",
 "https://nada-pi2z.onrender.com",
 "https://nada1.onrender.com"
]

let sessions = {}
let serverStatus = {}

/* marcar todos activos */

servers.forEach(s => serverStatus[s] = true)

/* obtener ID de usuario por cookie */

function getUserId(req,res){

 const cookie = req.headers.cookie

 if(cookie){
  const match = cookie.match(/uid=([^;]+)/)
  if(match) return match[1]
 }

 const uid = Math.random().toString(36).substring(2,10)

 res.setHeader(
  "Set-Cookie",
  `uid=${uid}; Path=/; Max-Age=86400`
 )

 return uid
}

/* verificar si servidor está vivo */

function checkServer(server){

 return new Promise(resolve=>{

  https.get(server,res=>{
   resolve(res.statusCode < 500)
  }).on("error",()=>{
   resolve(false)
  })

 })

}

/* elegir servidor */

async function getAvailableServer(uid){

 const now = Date.now()

 if(!sessions[uid]){

  sessions[uid] = {
   index: Math.floor(Math.random()*servers.length),
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

 let server = servers[sessions[uid].index]

 /* si está caído usar otro */

 if(!serverStatus[server]){

  for(let s of servers){
   if(serverStatus[s]){
    server = s
    break
   }
  }

 }

 return server
}

/* monitor de servidores */

setInterval(async ()=>{

 for(let server of servers){

  const alive = await checkServer(server)

  serverStatus[server] = alive

 }

},30000)

app.get("/play",async(req,res)=>{

 const uid = getUserId(req,res)

 const server = await getAvailableServer(uid)

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
 console.log("balanceador avanzado en "+PORT)
})
