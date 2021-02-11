/*REQUIRES*/

const Express = require("express");
const path = require("path");
const {Sequelize, DataTypes, Or, Op} = require("sequelize"); 
const fs = require("fs");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

/*SETTINGS.JSON*/

const data = fs.readFileSync("settings.json");
const settings = JSON.parse(data);

/*INICIALIZACION DE SEQUELIZE*/

const sequelize = new Sequelize(settings.database, settings.database_username, settings.database_password, {

    host: settings.database_host,
    port: settings.database_port,
    dialect: "mysql"
})

const User = sequelize.define("User", {

    Id : {

        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    username : {

        type: DataTypes.STRING,
        allowNull : false,
        unique: true,
        validate : {
            
            notEmpty : true,
            max: 16,
            min: 8
        }
    },
    password: {

        type: DataTypes.STRING,
        allowNull: false,
        validate: {

            notEmpty : true,
            min: 6
        }
    },
    email : {

        type: DataTypes.STRING,
        allowNull: false,
        validate : {

            isEmail : true,
            max : 40,
            min: 10
        }
    }
})

const Product = sequelize.define("Product", {

    id : {

        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    name: {

        type: DataTypes.STRING(70),
        allowNull: false,
    },

    description: {

        type: DataTypes.TEXT,
        allowNull: false,
    },

    quantity : {

        type: DataTypes.INTEGER,
        allowNull: false
    },

    price: {

        type: DataTypes.FLOAT,
        allowNull: false
    },

    imageUrl: {

        type: DataTypes.STRING,
        allowNull: false
    }

})

User.hasMany(Product);
Product.User = Product.belongsTo(User);

/*INCIALIZACION DE EXPRESS*/

const app = Express();

/*MIDDLEWARES*/

app.use(Express.static(__dirname + '/public'));

app.use(Express.urlencoded({extended : true}))

app.use("/registerUser", async(req,res,next) => {

    res.locals.hashpassword = await bcrypt.hash(req.body.password, 10)
    await next();
})

app.use("/loginUser", async(req,res,next) =>{

    const user = await User.findOne({
        where: {username: req.body.loginusername}
    })

    if (user == null) {

        return res.status(500).send("Usuario no encontrado!")
    }

    await console.log(user.userId, user.username, user.password)

    await bcrypt.compare(req.body.loginpassword, user.password).then((result) => {

        if (result) {

            console.log("Exitoso! Pasando...")
            next()
        } else {

            res.status(500).send("Contraseña incorrecta!")
        }
    })
})


/*ROUTES*/

app.get("/" , (req, res) => {

    res.sendFile(path.join(__dirname + "/views/index.html"))
})

app.post("/registerUser", async (req,res) => {

    const username = req.body.username
    const email = req.body.email
    const password = res.locals.hashpassword


    await console.log(username, email, password)
    
    await User.create({

        username: username,
        password: password,
        email: email,
    })

    await console.log("Usuario creado!")

    await res.redirect("/")
})

app.post("/loginUser", async(req, res) =>{

    process.env.TOKEN = await crypto.randomBytes(64).toString("hex")
    const token = await jwt.sign(req.body.loginusername, process.env.TOKEN);
    await res.cookie("token", token)
    await res.cookie("username", req.body.loginusername)
    await res.redirect("/");
})

app.get("/publish", (req,res) => {

    res.sendFile(path.join(__dirname + "/views/postProduct.html"))
})

app.post("/postProduct", async(req,res) => {

    const usuario = await User.findOne({where: req.body.productUsername})

    await console.log(usuario.dataValues.Id);

    await Product.create({

        name: req.body.productName,
        description: req.body.productDescription,
        quantity: req.body.productQuantity,
        price: req.body.productPrice,
        imageUrl: req.body.productImageUrl,
        UserId: usuario.dataValues.Id
    })

    await console.log("Producto registrado!");

    await res.redirect("/");
})

/*LISTEN*/

app.listen(3000, ()=>{

    console.log("Listening on Port 3000")
})