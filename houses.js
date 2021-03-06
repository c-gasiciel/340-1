module.exports = function(){
    var express = require('express');
    var router = express.Router();


/* Select all locations to populate dropdown */
 function getLocations(res, mysql, context, complete){
        mysql.pool.query("SELECT loc_id as id, loc_name AS name FROM GoT_Locations ORDER BY loc_name", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.locations  = results;
            complete();
        });
    }

/* Select all houses in table sorted by name */
    function getHouses(res, mysql, context, complete){
        mysql.pool.query("SELECT H.house_id AS id, H.house_name AS name, H.sigil AS sigil, L.loc_name AS base FROM Houses H INNER JOIN GoT_Locations L ON L.loc_id = H.base_city ORDER BY name", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.houses = results;
            complete();
        });
    }


/* Function to select characters with a user-specified homeland
 function getCharactersbyHomeland(req, res, mysql, context, complete){
      var query = "SELECT char_id AS id, first_name AS fname, last_name AS lname, status AS life_status, L1.loc_name AS homeland, L2.loc_name AS current_location FROM GoT_Character C INNER JOIN life_status LS ON LS.status_id = C.life_status LEFT JOIN GoT_Locations L1 ON L1.loc_id = C.homeland LEFT JOIN GoT_Locations L2 ON L2.loc_id = C.current_location WHERE homeland = ? ORDER BY lname, fname";
      console.log(req.params)
      var inserts = [req.params.homeland]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characters = results;
            complete();
        });
    } */




      /* Function to select a single house */
        function getHouse(res, mysql, context, id, complete){
        var sql = "SELECT house_id AS id, house_name AS name, sigil, base_city AS base FROM Houses WHERE house_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.houses = results[0];
            complete();
        });
    }



    /*Display all houses. Requires web based javascript to delete users with AJAX*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletehouse.js"];
        var mysql = req.app.get('mysql');
        getHouses(res, mysql, context, complete);
        getLocations(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('houses', context);
            }
        }
    });


    /*Display all people from a given homeland. Requires web based javascript to delete users with AJAX
    router.get('/filter/:homeland', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecharacter.js","filtercharacters.js","searchcharacters.js"];
        var mysql = req.app.get('mysql');
        getCharactersbyHomeland(req,res, mysql, context, complete);
        getLocations(res, mysql, context, complete);
        getStatus(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('characters', context);
            }
        }
    }); */



        /*Display all characters whose name starts with a given string. Requires web based javascript to delete users with AJAX
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
		context.jsscripts = ["deletecharacter.js","filtercharacters.js","searchcharacters.js"];
        var mysql = req.app.get('mysql');
        getCharactersWithNameLike(req, res, mysql, context, complete);
        getLocations(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('characters', context);
            }
        }
    }); */



    /* Display one house for the specific purpose of updating house */
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedBaseCity.js", "updatehouse.js"];
        var mysql = req.app.get('mysql');
        getHouse(res, mysql, context, req.params.id, complete);
        getLocations(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-house', context);
            }

        }
    });

        /* Adds a houes, redirects to the people page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Houses (house_name, sigil, base_city) VALUES (?,?,?)";
        var inserts = [req.body.name, req.body.sigil, req.body.base];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/houses');
            }
        });
    });



    /* The URI that update data is sent to in order to update a house */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        var sql = "UPDATE Houses SET house_name=?, sigil=?, base_city=? WHERE house_id=?";
        var inserts = [req.body.name, req.body.sigil, req.body.base, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }

            else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */
    router.delete('/:id', function(req, res){
      console.log(req.params.id)
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Houses WHERE house_id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                console.log("Delete unsuccessful");
                res.end();
            }else{
                res.status(202).end();
                console.log("Delete successful");
            }
        })
    })

    return router;
}();
