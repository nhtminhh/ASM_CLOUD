const { application } = require('express')
var express = require('express')
const async = require('hbs/lib/async')
const { ObjectId } = require('mongodb')
var app = express()

app.set('view engine','hbs')
app.use(express.urlencoded({extended:true}))

app.get('/', async(req,res)=>{
    //1.ket noi den database server voi dia chi la url
    let client= await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("ATNToys");
    //tra ve toan bo bang product
    let products = await dbo.collection("product").find().toArray()
    //hien thi trang viewProduct voi Product trong Database tra ve
    res.render('allProduct',{'products':products})
    // res.render('allProduct')
})
//duong dan den database
var url = 'mongodb+srv://NhtMinhh:tnm081102@nhtminhh.sdw0srd.mongodb.net/test';

//import thu vien MongoDB
var MongoClient = require('mongodb').MongoClient;

app.post('/editProduct', async (req, res) => {
    let id = req.body._id
    let name = req.body.txtName
    let price =req.body.txtPrice
    let picURL = req.body.txtPicture
    let client= await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("ATNToys");
    dbo.collection("product").updateOne({_id: ObjectId(id)}, {
        $set:
         {'name': name, 'price': price, 'picURL': picURL}
    })
    res.redirect('/')
})

app.get('/edit', async(req, res) => {
    let id = req.query.id
    let client= await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("ATNToys");
    //tra ve toan bo bang product
    let product = await dbo.collection("product").findOne({_id: ObjectId(id)})
    console.log(product)
    res.render('edit', {'product': product})

});

app.post('/search', async (req, res) => {
    let nameSearch = req.body.txtName
    //1.ket noi den database server voi dia chi la url
    let client = await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("ATNToys");
    //tra ve toan bo bang product
    let products = await dbo.collection("product").find({ $or: [{ 'name': new RegExp(nameSearch, 'i') }, { _id: nameSearch }] }).toArray()
    //hien thi trang viewProduct voi Product trong Database tra ve
    res.render('allProduct', { 'products': products })
})

app.get('/delete', async (req, res) => {
    //1.ket noi den database server voi dia chi la url
    let client= await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("ATNToys");
    let id = req.query.id;
    await dbo.collection("product").deleteOne({_id: ObjectId(id)})
    res.redirect("/")
})

app.get('/viewAll',async (req,res)=>{
    //1.ket noi den database server voi dia chi la url
    let client= await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("ATNToys");
    //tra ve toan bo bang product
    let products = await dbo.collection("product").find().toArray()
    //hien thi trang viewProduct voi Product trong Database tra ve
    res.render('allProduct',{'products':products})
})

app.post('/createProduct',async (req,res)=>{
    let name = req.body.txtName
    let price =req.body.txtPrice
    let picURL = req.body.txtPicture
    let product = {
        'name':name,
        'price': price,
        'picURL':picURL
    }
    //insert product vao database
    //1.ket noi den database server voi dia chi la url
    let client= await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("ATNToys");
    //3.insert product vao database ATNToys, trong table product
    await dbo.collection("product").insertOne(product);
    //goi lai trang home
    res.redirect('/')
})

app.get('/create',(req,res)=>{
    res.render('createProduct')
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log("Server is running!")