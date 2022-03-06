//Se desea una lista de peliculas donde haya participado Tom Hanks y su fecha de lanzamiento, ordenadas por los veneficios
db.credits.aggregate([
    {
        $match: {
            'movies.cast.name': 'Tom Hanks'
        }
    }, 
    {
        $lookup: {
            from: 'movie_dataset',
            localField: '_id',
            foreignField: '_id',
            as: 'movies_info'
        }
    }, 
    {
        $unwind: {
            path: '$movies_info'
        }
    },
    {
        $project: {
            _id: 0,
            date: '$movies_info.releasedate',
            movieTile: '$movies_info.original_title',
            profits: {
                $subtract: ["$movies_info.revenue", "$movies_info.budget"]
            }
        }
    }, 
    {
        $sort: {
            profits: -1
        }
    }
])


//Se quiere saber como de bien valoradas están las peliculas de George Lucas dentro de nuestra base de datos
db.credits.aggregate([
    {
        $match: {
            "movies.crew.name": "George Lucas"
        }
    },
    {
        $lookup: {
            from: "movie_dataset",
            localField: '_id',
            foreignField: '_id',
            as: 'movies_dataset'
        }
    },
    {
        $unwind: {
            path: "$movies_dataset",

        }
    },
    {
        $project: {
            _id: 0,
            movie_title: "$movies_dataset.title",
            "estimation": {
                $switch: {
                    branches: [
                        {
                            case: {$gte: [{$avg: "$movies_dataset.popularity"},"$movies_dataset.vote_average"]},
                            then: "Poorly rated movie "
                        },
                        {
                            case: {$lte: [{$avg: "$movies_dataset.popularity"}, "$movies_dataset.vote_average"]},
                            then: "Overrated"
                        },
                    ],
                    default: "No hay datos"
                }
            },
        }
    }
])

/*Si se necesitara saber cuantas hay de cada una de ellas
    {
        $group: {
            _id: "$estimation",
            count: {
                $sum: 1
            }
        }
    }
])
*/

//Hace falta saber cuantas personas recomiendan o no, las peliculas del señor de los anillos y todo el staf que participa
db.movie_dataset.aggregate([
    {
        $match: {
            'belongs_to_collection.name': 'The Lord of the Rings Collection'
        }
    }, 
    {
        $lookup: {
            from: 'coments',
            localField: 'id',
            foreignField: 'movie_id',
            as: 'comments'
        }
    }, 
    {
        $lookup: {
            from: 'credits',
            localField: '_id',
            foreignField: '_id',
            as: 'credits'
        }
    }, 
    {
        $unwind: {
            path: "$credits"

        }
    }, 
    {
        $unwind: {
            path: "$comments",

        }
    }, 
    {
        $group: {
            _id: "$comments.recommended",
            titles: {
                $addToSet: "$original_title"
            },
            count: {
                $count: {}
            },
            staf: {
                $addToSet: "$credits.movies.crew"
            }
        }
    }, 
    {
        $unwind: {
            path: "$staf",

        }
    }, 
    {
        $project: {
            _id: 0,
            "recomended": "$_id",
            count: "$count",
            titles: "$titles",
            staf: "$staf"
        }
    }
]).pretty()

db.credits.aggregate([
    {
        $match: {
            'movies.cast.name': 'Tom Hanks'
        }
    }, 
    {
        $lookup: {
            from: 'movie_dataset',
            localField: '_id',
            foreignField: '_id',
            as: 'movies_info'
        }
    }, 
    {
        $unwind: {
            path: '$movies_info'
        }
    },
    {
        $project: {
            _id: 0,
            date: '$movies_info.releasedate',
            movieTile: '$movies_info.original_title',
            profits: {
                $subtract: ["$movies_info.revenue", "$movies_info.budget"]
            }
        }
    }, 
    {
        $sort: {
            profits: -1
        }
    }
])