const sqlite3 = require ('sqlite3').verbose()
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static('public'));


var db = new sqlite3.Database('movies.sqlite3', (err)=>{
    if(err){
      console.log(error.message)
    }
    console.log('connected to movies Database')

    // db.close((err)=>{
    //   if(err){
    //     console.log(error.message)
    //   }
    // })
    // console.log('database closed')
})

app.get('/movies/', async (req, res)=>{
	const q = `select * from movies`;
	try{
		const results = await query(q);
		res.json(results);
	}catch(err){
		console.error(err);
		res.append('status','500');
		res.send(err);
	}
});

app.get('/movies/:movieId',async (req,res)=>{
	const q = `select movieId,title,genres from movies where movieId = ${req.params.movieId}`;
	try{
		const results = await query(q);
		res.json(results);
	}catch(err){
		console.error(err);
		res.append('status','500');
		res.send(err);
	}
});

app.post('/movies/',async (req,res)=>{
	const q = `SELECT movieId,title,genres FROM movies WHERE title LIKE '${req.body.keyword}%'`;
	//console.log(q);
	//res.json(req.body.keyword);
	try{
		const results = await query(q);
		res.json(results);
	}catch(err){
		console.error(err);
		res.append('status','500');
		res.send(err);
	}
});

app.get('/ratings/', async (req, res)=>{
	const q = `select * from ratings`;
	try{
		const results = await query(q);
		res.json(results);
	}catch(err){
		console.error(err);
		res.append('status','500');
		res.send(err);
	}
});

app.get('/ratings/:userId',async (req,res)=>{
	const q = `select userId,movieId,rating,timestamp from ratings where userId = ${req.params.userId}`;
	try{
		const results = await query(q);
		res.json(results);
	}catch(err){
		console.error(err);
		res.append('status','500');
		res.send(err);
	}
});

app.post('/ratings/',async (req,res)=>{
		a='';
		req.body.movieList.forEach(element => {
			a+=` movieId = ${element} or`
		});
		b = a.slice(0, -2);
		console.log(b)
		const q = `SELECT userId,movieId,rating,timestamp FROM ratings WHERE ${b}`
		//console.log(req.body.movieList);
		//res.json(req.body.movieList)
		try{
			const results = await query(q);
			res.json(results);
			}catch(err){
			console.error(err);
			res.append('status','500');
			res.send(err);
		}
  });

app.listen(8081);

// function query_(q,a){
// 	return new Promise(function(resolve, reject){
// 		db.all(q,...a,(err,rows)=>{
// 			if(err){
// 				reject(err);
// 				return;
// 			}
// 			resolve(rows);
// 		});
// 	});
// }

function query(q){
	return new Promise(function(resolve, reject){
		db.all(q,(err,rows)=>{
			if(err){
				reject(err);
				return;
			}
			resolve(rows);
		});
	});
}