const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");



const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.get("/users",function(req,res){
    // res.send("done");
    const url="https://jsonplaceholder.typicode.com/users";
    https.get(url,function(response){
        //here the data that we recieve is not completely received at once it is recieved in chunks...so we need to go with another procedure
        var data="";

        response.on("data",function(chunck){
           data+=chunck;
        });
        response.on("end",function(){

            const userData=JSON.parse(data);
           
            var users=[];

            for(var i=0;i<10;i+=1){
                var userObj={
                    id:userData[i].id,
                    name:userData[i].name,
                    email:userData[i].email,
                    address:{
                        street:userData[i].address.street,
                        city:userData[i].address.city,
                        zipcode:userData[i].address.zipcode
                    },
                    phone:userData[i].phone,
                    website:userData[i].website,
                    companyName:userData[i].company.name
                }
                users.push(userObj);
            }
            
            res.render("users",{
                users:users
            })
        });
    })
});

app.get("/user",function(req,res){
    res.sendFile(__dirname+"/public/findUser.html")
});

app.post("/user",function(req,res){
    var id=req.body.idToBeFetched;
    const url="https://jsonplaceholder.typicode.com/users/"+id;
    https.get(url,function(response){
        var data=""
        response.on("data",function(chunk){
            data+=chunk;
        });
        response.on("end",function(){
            var userSingle=JSON.parse(data);
            var userSingleObj={
                id:userSingle.id,
                name:userSingle.name,
                email:userSingle.email,
                address:{
                    street:userSingle.address.street,
                    city:userSingle.address.city,
                    zipcode:userSingle.address.zipcode
                },
                phone:userSingle.phone,
                website:userSingle.website,
                companyName:userSingle.company.name
            };
            res.render("user",{
                user:userSingleObj
            });
            
        });
    })
});

app.get("/posts", function (req, res) {
    const url = "https://jsonplaceholder.typicode.com/posts";
    const url1 = "https://jsonplaceholder.typicode.com/users";

    https.get(url, function (response) {
        var data = "";
        response.on("data", function (chunk) {
            data += chunk;
        });
        response.on("end", function () {
            var posts = JSON.parse(data);
            var postsData = [];

            https.get(url1, function (response) {
                var data1 = "";
                response.on("data", function (chunk1) {
                    data1 += chunk1;
                });
                response.on("end", function () {
                    var users = JSON.parse(data1);

                    for (var i = 0; i < 100; i++) {
                        var postObj = {
                            userId: posts[i].userId,
                            userName: users[posts[i].userId-1].name,
                            id: posts[i].id,
                            title: posts[i].title,
                            body: posts[i].body,
                        };
                        postsData.push(postObj);
                    }

                    res.render("posts", {
                        posts: postsData,
                    });
                });
            });
        });
    });
});

app.get("/post",function(req,res){
    res.sendFile(__dirname+"/public/findPost.html");
});

app.post("/post",function(req,res){
    const id=req.body.postIdToBeFetched;
    const url = "https://jsonplaceholder.typicode.com/posts/"+id;
    https.get(url,function(response){
        var data="";
        response.on("data",function(chunk){
            data+=chunk;
        });
        response.on("end",function(){
            const postSingle=JSON.parse(data);
            const url1 = "https://jsonplaceholder.typicode.com/users";
            https.get(url1, function (response) {
                var data1 = "";
                response.on("data", function (chunk1) {
                    data1 += chunk1;
                });
                response.on("end", function () {
                    var users = JSON.parse(data1);
                    var postSingleObj = {
                        userId: postSingle.userId,
                        userName: users[postSingle.userId-1].name,
                        id: postSingle.id,
                        title: postSingle.title,
                        body: postSingle.body,
                    };                    

                    res.render("post", {
                        post: postSingleObj,
                    });
                });
            });
            
        });
    });
});


app.get("/posts/:userId",function(req,res){
    var userId=req.params.userId;
    const url = "https://jsonplaceholder.typicode.com/posts";
    const url1 = "https://jsonplaceholder.typicode.com/users";

    https.get(url, function (response) {
        var data = "";
        response.on("data", function (chunk) {
            data += chunk;
        });
        response.on("end", function () {
            var posts = JSON.parse(data);
            var postsData = [];

            https.get(url1, function (response) {
                var data1 = "";
                response.on("data", function (chunk1) {
                    data1 += chunk1;
                });
                response.on("end", function () {
                    var users = JSON.parse(data1);

                    for (var i = 0; i < 100; i++) {
                        if(posts[i].userId==userId){
                            var postObj = {
                                userId: posts[i].userId,
                                userName: users[posts[i].userId-1].name,
                                id: posts[i].id,
                                title: posts[i].title,
                                body: posts[i].body,
                            };
                            postsData.push(postObj);
                        }
                        
                    }

                    res.render("postUserSpecific", {
                        posts: postsData,
                    });
                });
            });
        });
    });
    
});

app.get("/comments",function(req,res){
    const url="https://jsonplaceholder.typicode.com/comments";
    const url1="https://jsonplaceholder.typicode.com/users";
    https.get(url, function (response) {
        var data = "";
        response.on("data", function (chunk) {
            data += chunk;
        });
        response.on("end", function () {
            var comments = JSON.parse(data);
            var commentsData = [];

            https.get(url1, function (response) {
                var data1 = "";
                response.on("data", function (chunk1) {
                    data1 += chunk1;
                });
                response.on("end", function () {
                    var users = JSON.parse(data1);

                    for (var i = 0; i < 500; i++) {
                        var ind=Math.floor(comments[i].postId/10);
                        if(ind<10 && ind>=0){
                            var commentObj = {
                                id:comments[i].id,
                                postId:comments[i].postId,
                                userName:users[ind].name,
                                commentorName:comments[i].name,
                                commentorEmail:comments[i].email,
                                comment:comments[i].body
                            };
                            commentsData.push(commentObj);
                        }
                        if(ind==10){
                            var commentObj = {
                                id:comments[i].id,
                                postId:comments[i].postId,
                                userName:users[ind-1].name,
                                commentorName:comments[i].name,
                                commentorEmail:comments[i].email,
                                comment:comments[i].body
                            };
                            commentsData.push(commentObj);
                        }
                        
                    }

                    res.render("comments", {
                        comments: commentsData
                    });
                });
            });
        });
    });
});


app.get("/comments/:postId",function(req,res){
    const postId=req.params.postId;
    const url="https://jsonplaceholder.typicode.com/comments";
    const url1="https://jsonplaceholder.typicode.com/users";
    https.get(url, function (response) {
        var data = "";
        response.on("data", function (chunk) {
            data += chunk;
        });
        response.on("end", function () {
            var comments = JSON.parse(data);
            var commentsData = [];

            https.get(url1, function (response) {
                var data1 = "";
                response.on("data", function (chunk1) {
                    data1 += chunk1;
                });
                response.on("end", function () {
                    var users = JSON.parse(data1);
                    for (var i = 0; i < 500; i++) {
                        var ind=Math.floor(comments[i].postId/10);
                        if(comments[i].postId==postId){
                            if(ind<10 && ind>=0){
                                var commentObj = {
                                    id:comments[i].id,
                                    postId:comments[i].postId,
                                    userName:users[ind].name,
                                    commentorName:comments[i].name,
                                    commentorEmail:comments[i].email,
                                    comment:comments[i].body
                                };
                                commentsData.push(commentObj);
                            }
                            if(ind==10){
                                var commentObj = {
                                    id:comments[i].id,
                                    postId:comments[i].postId,
                                    userName:users[ind-1].name,
                                    commentorName:comments[i].name,
                                    commentorEmail:comments[i].email,
                                    comment:comments[i].body
                                };
                                commentsData.push(commentObj);
                            }
                        }
                        
                        
                    }

                    res.render("commentsUserSpecific", {
                        comments: commentsData
                    });
                });
            });
        });
    });
})

app.listen(3000,function(){
    console.log("running on port 3000")
});