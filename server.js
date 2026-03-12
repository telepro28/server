const express = require("express")

const app = express()
const PORT = process.env.PORT || 3000

/* lista de extractores */

const servers = [
 "https://extraer1.vercel.app",
 "https://extraer-beta.vercel.app"
]

/* elegir servidor según IP + tiempo */

function getServer(ip){

 let hash = 0

 for(let i=0;i<ip.length;i++){
  hash += ip.charCodeAt(i)
 }

 /* cambiar cada minuto */

 const timeSlot = Math.floor(Date.now() / 60000)

 const index = (hash + timeSlot) % servers.length

 return servers[index]

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
 console.log("balanceador activo en "+PORT)
})
