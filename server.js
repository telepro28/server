<?php

$servers = [
 "https://extraer1.vercel.app/play",
 "https://extraer-beta.vercel.app/play",
 "https://nada-pi2z.onrender.com/play",
 "https://nada1.onrender.com/play",
 "https://nada1-yt1c.onrender.com/play",
 "http://zonabom.cu.ma/medio.php",
 "https://recetascaseras.whf.bz/medio.php",
 "http://tequiero.cu.ma/medio.php"
];

$file = "counter.txt";

if(!file_exists($file)){
 file_put_contents($file,0);
}

$counter = (int)file_get_contents($file);

$server = $servers[$counter % count($servers)];

$counter++;

file_put_contents($file,$counter);

/* deportes */

if(isset($_GET["id"])){

 $id = intval($_GET["id"]);

 header("Location: ".$server."?id=".$id);
 exit;
}

/* regional */

if(isset($_GET["regional"])){

 $id = intval($_GET["regional"]);

 header("Location: ".$server."?regional=".$id);
 exit;
}

echo "uso: ?id=5 o ?regional=32";

app.listen(PORT,()=>{
 console.log("balanceador ultra escalable en "+PORT)
})
