import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;


const db = new pg.Client({
  user: "postgres",
  host: "127.0.0.1",
  database: "myproject",
  password: "ashiprathu",
  port: 5432,
});
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try{
    const result = await db.query("select * from items order by id asc");
    items= result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  }catch (err) {
    console.log(err);
  }

});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try{
    await db.query('insert into items(title) values ($1)', [item]);
    res.redirect("/");
    if (!item) return res.status(400).send("Item title required");
  }catch(err){
    console.log(err);
  }
    
  
});

app.post("/edit", async (req, res) => {
  const newTitle= req.body.newTitle
  const newId= req.body.newId
  try{
    await db.query("update items set title = $1 where id = $2", [newTitle, newId]);
    res.redirect('/')
  }catch(err){
    console.log(err);
  }

});

app.post("/delete", async (req, res) => {
  const id= req.body.deleteItem
  try{

    const deleteItem= await db.query('delete from items where id = $1', [id])
    res.redirect("/")
  }catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
