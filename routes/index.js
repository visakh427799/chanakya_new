var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken')
var items = require('../model/items_model');
var Sign  = require('../controllers/register_control');
var Log   = require('../controllers/login_control');
const cartAdd    = require('../controllers/cart_add_control');
const showProduct =require('../controllers/product_show_control');
const showCart    =require('../controllers/cart_show_controll');
const cart_plus = require('../controllers/add_cart_number_controll');
const remove_cart=require('../controllers/remove_from_cart_controll');
const admin_users=require('../controllers/all_user_show_controll');
const cart_minus = require('../controllers/minus_cart_number_controll');
const All_order=require('../controllers/all_orders_show_controll');


const getAppCookies = (req) => {
  // We extract the raw cookies from the request headers
  if( req.headers.cookie)
  {
  const rawCookies = req.headers.cookie.split('; ');
  // rawCookies = ['myapp=secretcookie, 'analytics_cookie=beacon;']

  const parsedCookies = {};
  rawCookies.forEach(rawCookie=>{
  const parsedCookie = rawCookie.split('=');
  // parsedCookie = ['myapp', 'secretcookie'], ['analytics_cookie', 'beacon']
  parsedCookies[parsedCookie[0]] = parsedCookie[1];
  });
  return parsedCookies;

}
};
//token verification middleware
  function tokenVerify(req,res,next){
  let Mytoken = getAppCookies(req);
    console.log(Mytoken);
  

  if(Mytoken===undefined){
              console.log("No token ")
              res.render('login')
        }

        else{
                      
           Mytoken=Mytoken.token;
           jwt.verify(Mytoken, process.env.SECRET_KEY,(err,decoded)=>{
                 if(err){
                       console.log("Token validity expired")
                       res.render('login')
                 }
                 else{
                      // console.log(decoded)
                       //console.log("Already logged in  go to next page");
                       //let email=""
                       res.user=decoded;
                      next()
                      
                 }

           });
          

          }
                  
        }


        function admintokenVerify(req,res,next){
          let Mytoken = getAppCookies(req);
            console.log(Mytoken);
          
        
          if(Mytoken===undefined){
                      console.log("No token ")
                      res.render('login')
                }
        
                else{
                              
                   Mytoken=Mytoken.adtoken;
                   jwt.verify(Mytoken, process.env.SECRET_KEY,(err,decoded)=>{
                         if(err){
                               console.log("Token validity expired")
                               res.render('login')
                         }
                         else{
                              // console.log(decoded)
                               //console.log("Already logged in  go to next page");
                               //let email=""
                               res.user=decoded;
                              next()
                              
                         }
        
                   });
                  
        
                  }
                          
                }
        
        
                

        function getUser(req,res,next){
          let Mytoken = getAppCookies(req);
            console.log(Mytoken);
          
        
          if(Mytoken===undefined){
                      console.log("No token ")
                      res.render('index')
                }
        
                else{
                              
                   Mytoken=Mytoken.token;
                   jwt.verify(Mytoken, process.env.SECRET_KEY,(err,decoded)=>{
                         if(err){
                               console.log("Token validity expired")
                              //  res.render('index')
                              next();
                         }
                         else{
                              // console.log(decoded)
                               //console.log("Already logged in  go to next page");
                               //let email=""
                               res.user=decoded;
                              next()
                              
                         }
        
                   });
                   
        
        
                  }
                          
                }
        
        
        


/* GET home page. */
router.get('/',getUser, function(req, res, next) {
if(res.user){
   let payload=res.user;
   var name=payload.username.name;
}
  items.find({},(err,data)=>{

      if(res.user) {
        console.log(res.user)
      }
      else{
        
        console.log("jii")

      }
      if(data){
        res.render('index', { data:data,name:name });
      }
      // else{
      //   res.render('index', { data:arr });
      // }
  })

  
  
});


router.get('/signup', function(req, res, next) {
 
       res.render('signup', { message: "" });
});

router.get('/login', tokenVerify,function(req, res, next) {
 
       res.render('login', { message: "" });
});
router.get('/admin',admintokenVerify,(req,res)=>{
  items.find({},(err,data)=>{

    if(res.user) {
      console.log(res.user)
    }
    else{
      
      console.log("jii")

    }
    if(data){
      res.render('admin_home', { data:data });
    }
    // else{
    //   res.render('index', { data:arr });
    // }
})

})
router.get('/addtocart/:item',tokenVerify,cartAdd.cart_add);
router.get('/product/:id',showProduct.productShow);
router.get('/cart',tokenVerify,showCart.Cart_show);
router.get('/addcartitem/:id',cart_plus.addNumber);
router.get('/minuscartitem/:id',cart_minus.minusCart);
router.get('/removecartitem/:id',remove_cart.removeCart);
router.get('/admin/allusers',tokenVerify,admin_users.UserShow)
router.get('/admin/allorders',tokenVerify,All_order.All_orders)
router.get('/admin/add-products',tokenVerify,(req,res)=>{
      res.render('admin_addproducts');
    }) ;
router.get('/logout',(req,res)=>{
      res.clearCookie('token');
      res.redirect("login")
}) 
router.get('/adminlogout',(req,res)=>{
  res.clearCookie('adtoken');
  res.redirect("login")
})
//post



router.post('/signup',Sign.Signup);
router.post('/login',Log.Login);


module.exports = router;
