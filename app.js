const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');
const formidable = require('formidable');
 

const app = express();

// Middleware

// app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
  }));
app.use(passport.initialize());
app.use(passport.session());



// // Mongo URI //using MLabs
const url='mongodb+srv://sujith4488:sujith1234@@cluster0-b4qca.mongodb.net/Hostel';
const tempUrl='mongodb://localhost:27017/Hostel';

mongoose.connect(tempUrl,{useNewUrlParser:true,useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);









const AdminSchema = new mongoose.Schema({
	username:String,
	password:String
});

AdminSchema.plugin(passportLocalMongoose);





const Admin = mongoose.model("Admin",AdminSchema);
passport.use(Admin.createStrategy());

passport.serializeUser(function(user, done) {
	done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
	Admin.findById(id, function(err, user) {
	  done(err, user);
	});
  });





  app.get("/dashboard",function(req,res){

	//console.log(req.user.user);
	Admin.findOne({username:req.user.username}, function(err,found){
		if(err){
		   
			res.redirect("/");
		} else {

			if(found){
		//var students;
		Hostel.countDocuments({},function(err,cnt){
			//console.log(cnt);
			//students=cnt;
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); 
		var yyyy = today.getFullYear();
		today = yyyy+"-"+mm+"-"+dd;

			Attd.find({date:today},function(err,data){
				if(err){
					console.log(err);
					res.render("result",{success:false,msg:"Server Error please try again",link:"/dashboard"});
				} else{
					if(data.length===0){
						res.render("dashboard",{students:cnt,present:0});
					} else{
						res.render("dashboard",{students:cnt,present:data[0].present.length});
				}
				}
			});

			
		});
	}
}
	
});
});
app.get("/logout",function(req,res){
	req.logout();
    res.redirect("/");

});


app.post("/login",function(req,res){
	const user= new Admin({
        username: req.body.username,
        password: req.body.password
	});
	//console.log(user);
	req.login(user, function(err){
		
        if(err){
        console.log(err);
        } else {
			passport.authenticate("local")(req,res,function(){
            res.redirect("/dashboard");
        });
        }
    });

 // 	Admin.register({username: req.body.username},req.body.passord,function(err,user){
	// 	if(err){
	// 		console.log(err);
	// 		res.redirect("/");
	// 	} else {
	// 		passport.authenticate("local")(req,res,function(){
	// 			res.redirect("/dashboard");
	// 		});
	// 	}
	// });

});




app.get("/",function(req,res){
	res.render("login");
});



let port=process.env.PORT;
if(port==null || port==""){
  port=4000;
}

app.listen(port, () => console.log(`Server started on port ${port}`));