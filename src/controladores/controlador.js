const db = require("../lib/conexionbd");

function filter(req) {
    let query = `
        SELECT *
        FROM pelicula
    `;
    if (req.query.titulo) {
        query += ` WHERE titulo LIKE ('${req.query.titulo}%')`;
        if (req.query.anio) {
            query += " AND";
        }
    }
    if (req.query.anio) {
        if (!req.query.titulo) {
            query += " WHERE";
        }
        query += ` anio = ${req.query.anio}`;
    }
    if (req.query.columna_orden) {
        query += ` ORDER BY ${req.query.columna_orden} ${req.query.tipo_orden}`;
    }
    if (req.query.pagina) {
        query += ` LIMIT ${req.query.cantidad} OFFSET ${req.query.cantidad *
            (req.query.pagina - 1)}`;
    }
    console.log(query);
    return query;
}

function getAllMovies(req, res) {
    const query = filter(req);
    let response = {};
    db.query(query, function(error, data) {
        if (error) {
            console.log(error.message);
            return;
        }
        response.peliculas = data;

        let totalQuery = `
        SELECT COUNT(id) AS total
        FROM pelicula
        `;
        if (req.query.titulo) {
            totalQuery += ` WHERE titulo LIKE ('${req.query.titulo}%')`;
            if (req.query.anio) {
                totalQuery += " AND";
            }
        }
        if (req.query.anio) {
            if (!req.query.titulo) {
                totalQuery += " WHERE";
            }
            totalQuery += ` anio = ${req.query.anio}`;
        }
        db.query(totalQuery, function (totalError, totalData) {
            if (totalError) {
                console.log(totalError.message);
                return;
            }
            console.log("total de resultados: ", totalData[0].total);
            response.total = totalData[0].total;
            res.send(response);
        })
    });
}

function getAllGenres(req, res) {
    const query = `
        SELECT *
        FROM genero
    `;
    db.query(query, function(error, data) {
        if (error) {
            console.log(error.message);
            return;
        }
        const response = {
            peliculas: data
        };
        res.send(response);
    });
}

module.exports = {
    getAllMovies: getAllMovies,
    getAllGenres: getAllGenres
};
