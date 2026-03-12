const express = require("express")

const app = express()
const PORT = process.env.PORT || 3000

/* servidores extractores */

const servers = [
 "https://extraer1.vercel.app",
 "https://extraer-beta.vercel.app"
]

function getServer(ip){

 let hash = 0

 for(let i=0;i<ip.length;i++){
  hash += ip.charCodeAt(i)
 }

 return servers[hash % servers.length]
}

app.get("/play",(req,res)=>{

 const ip =
 req.headers["x-forwarded-for"] ||
 req.socket.remoteAddress ||
 "0.0.0.0"

 const server = getServer(ip)

 /* detectar canal */

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
