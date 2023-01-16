const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const productsFilePath = path.join(__dirname, '../data/products.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

let db=require('../database/models');
let sequelize=db.sequelize

const controller = {
	archivo: productsFilePath,


	productView2: function(req,res){
        db.Product.findAll().then(function(result){
             res.send(result)
		// 	//res.render(result)
         })
    },

	productView: function (req, res, next) {
		db.Product.findAll().then(function (result) {
            res.render('shop', { products: result })
            //res.send(result)
        })
	},


	productoDetail: (req, res) => {
		const id = req.params.id;

		db.Product.findByPk(id).then(function(result){
            
		res.render('product',{product: result})
        })
	},

	// // Root - Show all products
	// // index: (req, res) => {
	// // 	products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
	// // 	res.render('products', { products })
	// // 	// Do the magic
	// // },

	// // // Detail - Detail from one product
	// // detail: (req, res) => {
	// // 	// Do the magic
	// // 	products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
	// // 	const id_producto = req.params.id;
	// // 	var elemento2;
	// // 	products.forEach(function buscar_posicion_desdeid(elemento) {
	// // 		if (elemento.id == id_producto) {
	// // 			elemento2 = elemento;
	// // 		}
	// // 	})
	// // 	res.render('detail', { id_producto, 'producto_mostrar': elemento2, title: elemento2.name })
	// // },

	// Create - Form to create
	create: (req, res) => {
		res.render('crear');
		// 	// Do the magic
	},
	// Create -  Method to store
	store: async function(req, res) {
		try {
			let errors = validationResult(req);
			if (errors.isEmpty()) {
			
			let created= await db.Product.create({
				teamName: req.body.teamName,
				size: req.body.size,
				jugador: req.body.jugador,
				imagen: req.file.filename,
				price: req.body.price,
				grupo: req.body.grupo
				
			})
			res.redirect('/product')
			

		}
		else {
			res.render('crear', { errors: errors.array(), old: req.body })
		}


		}

		catch(e){
			res.send(e)
			console.log(e);
		}
		

	}
,


	editPage: (req,res)=>{
		products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		
	
		res.render('modificar',{usuarios: products})
	},
	// Update - Form to edit
	edit: (req, res) => {
		products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		const id_producto = req.params.id;
		var elemento2;
		products.forEach(function buscar_posicion_desdeid(elemento) {
			if (elemento.id == id_producto) {
				elemento2 = elemento;
			}
		})
		res.render('editar', { id_producto, 'productToEdit': elemento2, title: elemento2.name })
	},
	// Update - Method to update
	update: (req, res) => {

		//leer JSON y guardarlo en un array
		products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		//leer el id del producto desde el request
		const id_producto = Number(req.params.id);
		//filter donde se devuelven todos los elemetos del array MENOS el pedido por request
		let nuevoProductos = products.filter(valor => valor.id != id_producto)
		if (req.file) {
			//agregar el nuevo item modificado al array sin el
			let itemEditado = { id: id_producto, ...req.body, imagen: req.file.filename }
			nuevoProductos.push(itemEditado)
			//escribiendo el nuevo array en el archivo
			fs.writeFileSync(productsFilePath, JSON.stringify(nuevoProductos))

			//volver a leer el nuevo archivo
			products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
			//devolver todo el objeto con el id que quiere el usuario, no se si esto está bien, solo lo hice para evitar un for 
			var elemento2;
			products.forEach(function buscar_posicion_desdeid(elemento) {
				if (elemento.id == id_producto) {
					elemento2 = elemento;
				}
			})
			console.log(req.file.filename)
			res.render('product', { id_producto, producto: elemento2, title: elemento2.name })
		}
		else {
			var elemento2;
			products.forEach(function buscar_posicion_desdeid(elemento) {
				if (elemento.id == id_producto) {
					elemento2 = elemento;
				}
			})
			res.render('editar', { id_producto, 'productToEdit': elemento2, title: elemento2.name })
		}

	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		//leer el id del producto desde el request
		const id_producto = (req.params.id);
		//filter donde se devuelven todos los elemetos del array MENOS el pedido por request
		let nuevoProductos = products.filter(valor => valor.id != id_producto)
		fs.writeFileSync(productsFilePath, JSON.stringify(nuevoProductos));
		products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		res.redirect('/product/edit')

	}
};

module.exports = controller;