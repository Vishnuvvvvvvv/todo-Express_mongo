const express = require("express")
const bodyParser = require("body-parser")
const app =express();
const mongoose = require("mongoose")

app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb://localhost:27017/TOdoDB_2");

const itemSchema ={

    name:String
}

const Item = mongoose.model("Item",itemSchema)


const item1 = new Item({
    name:"buy"
})
const Item2 = new Item({

    name:"Cook"
})
const item3 =new Item({
    name:"Eat"
})


let itemarray = [item1,Item2,item3]

const ListSchema = {
    name:String,
    value:[itemSchema]
}

const List  = mongoose.model("List",ListSchema)



app.get("/",(req,res)=>{
Item.find({},(err,founditems)=>{

    if(founditems.length==0)
    {
      
        Item.insertMany(itemarray,(err)=>{
      
            if(!err)
            {
                console.log("Success!")
                res.redirect("/")
            }  
        })
    }  

else
{
    res.render("list",{heading:"monday",itemname:founditems});
}
})
})

app.post("/",(req,res)=>{

   let headingname = req.body.button;
   let itemname = req.body.itemname
console.log(headingname)
   const item4 = new Item({
    name:itemname
})
if(headingname ==="monday")
{
    item4.save();
res.redirect("/");
}

else
{
List.findOne({name:headingname}, (err,founditem)=>{

founditem.value.push(item4)
founditem.save();
res.redirect("/"+headingname)

})

}})
app.post("/delete",(req,res)=>{

let itemvalue = req.body.checkbox;
let hiddenvalue = req.body.hidden;
console.log(hiddenvalue)
if(hiddenvalue ==="monday")
{
    Item.findByIdAndRemove(itemvalue,(err)=>{
        if(!err)
        {
            res.redirect("/");
        }
    })

} 
else{

List.findOneAndUpdate({name:hiddenvalue},{$pull:{value:{_id:itemvalue}}},(err)=>{
    if(!err)
    {
        res.redirect("/"+hiddenvalue)
    }
})


}


})




app.get("/:customlist",(req,res)=>{
var titlename = req.params.customlist

List.findOne({name:titlename},(err,foundlist)=>{

// if(!err)
// {
    if(!foundlist)
    {
        const list1 = new List({
            name:titlename,
            value:itemarray
        })
        list1.save();
        res.redirect("/"+titlename)
        
    }
    else{
        
     res.render("list",{heading:foundlist.name,itemname:foundlist.value})

    }
   
// }




})


})




app.listen(3000,(res,req)=>{

    console.log("heyy")


})