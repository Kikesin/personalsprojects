// Tarea NoSQL 

// Mostramos la BBDD
db.peliculas.find()

// Quitamos la columna index

db.peliculas.updateMany({},{$unset:{'index':''}})

// Eliminamos los documentos anteriores a 2002 por no ser objeto de analisis

db.peliculas.deleteMany({"RELEASE_YEAR" : {$lt:2002 }})

db.peliculas.find()
// Vemos cuantas peliculas hay de cada genero, ordenado de mayor a menor.

var query1 = { "_id": "$MAIN_GENRE", "numero": { $sum: 1 } }

var fase1 = { $group: query1 }

var etapas = [ fase1]

var opcion= { "numero" : -1 }


db.peliculas.aggregate( etapas ).sort(opcion)

// La categoría drama con 127 peliculas es la mayor y horror con 5 es la menor. 

//Veamos el top 3 de mejores películas por rating de IMDb agrupado por año, genero y titulo. 

var query1 = 

{ "_id":{"año":"$RELEASE_YEAR","TITLE":"$TITLE","GENERO":"$MAIN_GENRE"}, "MEDIA": { $avg: "$SCORE" } ,"VOTOS":{$sum: "$NUMBER_OF_VOTES"} }

var fase = { $group: query1 }

var opcion= { "MEDIA" : -1 }

var etapas = [fase]

db.peliculas.aggregate( etapas ).sort(opcion).limit(3)


//Así que veamos ese mismo top 3 pero con el ranking aplicado según el numero de votos. 

var query1 = 

{ "_id":{"año":"$RELEASE_YEAR","TITLE":"$TITLE","GENERO":"$MAIN_GENRE"}, "MEDIA": { $avg: "$SCORE" } ,"VOTOS":{$sum: "$NUMBER_OF_VOTES"}          }

var fase = { $group: query1 }

var opcion= { "VOTOS" : -1 }

var etapas = [fase]

db.peliculas.aggregate( etapas ).sort(opcion).limit(3)



// Vemos ahora los últimos cinco años de estudio, de que genero es el que más películas se hace y que rating max es el obtenido en cada año.
db.peliculas.aggregate([
  {$unwind: "$MAIN_GENRE"},
  {
    "$group": {
      "_id": "$RELEASE_YEAR",
      "MAX IMDb": {"$max": "$SCORE"},
      "Counter": {"$sum": 1},
      "Genero": {"$push": "$MAIN_GENRE"}
    }
  },
  {"$sort": {"_id": -1}},
  {"$limit": 5}
]);


// Veamos ahora las mejores películas de comedia según el criterio de mas de 100000 votos y ordenado por media de puntuaciones.

var query = {"MAIN_GENRE":"drama"}

var fase0 = { $match: query}

var query1 = { "_id": "$TITLE", "MEDIA": { $max: "$SCORE" },"VOTOS":{$max: "$NUMBER_OF_VOTES"} }

var fase1 = { $group: query1 }

var query2 = {"VOTOS":{"$gt": 100000}}

var fase2={$match: query2}

var fase2 = {$match: query2 }

var etapas = [ fase0 ,fase1,fase2]

var opcion =  {"MEDIA":-1}

db.peliculas.aggregate( etapas ).sort(opcion).limit(5)

// Analicemos según la productora y votos:

var query1 = { 
  "_id": {
    "GENERO": "$MAIN_GENRE",
    "MAIN_PRODUCTION": "$MAIN_PRODUCTION"
  },
  "VOTOS": { "$sum": "$NUMBER_OF_VOTES" }
};

var fase = { $group: query1 };

var opcion = { "VOTOS": -1 };

var etapas = [fase];

db.peliculas.aggregate(etapas).sort(opcion).limit(3);


// Mejores peliculas por medida creada calificacion

db.peliculas.aggregate([
  {
    $addFields: {
      calificacion: {
        $add: [
          { $multiply: [0.7, "$SCORE"] },
          { $multiply: [0.3, "$NUMBER_OF_VOTES"] }
        ]
      }
    }
  },
  {
    $sort: { calificacion: -1 }
  }
]);



// fin tarea // Querys extras para sacar mas información de películas si te interesa :)



//Top 3 peli de drama

var query = {"MAIN_GENRE":"drama"}

var fase0 = { $match: query}

var query1 = { "_id": "$TITLE", "MEDIA": { $max: "$SCORE" },"VOTOS":{$max: "$NUMBER_OF_VOTES"},"GENERO":{$max: "$MAIN_GENRE"} }

var fase1 = { $group: query1 }

var query2 = {"VOTOS":{"$gt": 100000}}

var fase2={$match: query2}

var fase2 = {$match: query2 }

var etapas = [ fase0 ,fase1,fase2]
var opcion =  {"MEDIA":-1}

db.peliculas.aggregate( etapas ).sort(opcion).limit(3)

//Top 3 peliculas de comedia

var query = {"MAIN_GENRE":"comedy"}

var fase0 = { $match: query}

var query1 = { "_id": "$TITLE", "MEDIA": { $max: "$SCORE" } ,"VOTOS":{$max: "$NUMBER_OF_VOTES"},"GENERO":{$max: "$MAIN_GENRE"}}

var fase1 = { $group: query1 }

var query2 = {"VOTOS":{"$gt": 100000}}

var fase2={$match: query2}


var opcion =  {"MEDIA":-1}


var etapas = [ fase0 ,fase1,fase2]

db.peliculas.aggregate( etapas ).sort(opcion).limit(3)

//Top 3 peli de thriller

var query = {"MAIN_GENRE":"thriller"}

var fase0 = { $match: query}

var query1 = { "_id": "$TITLE", "MEDIA": { $max: "$SCORE" } ,"VOTOS":{$max: "$NUMBER_OF_VOTES"},"GENERO":{$max: "$MAIN_GENRE"}}

var fase1 = { $group: query1 }

var query2 = {"VOTOS":{"$gt": 100000}}

var fase2={$match: query2}

var opcion =  {"MEDIA":-1}

var etapas = [ fase0 ,fase1,fase2]

db.peliculas.aggregate( etapas ).sort(opcion).limit(3)









