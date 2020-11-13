var http=require("http");
var fs=require("fs");
var url=require("url");
var path=require("path");
const { getDefaultSettings } = require("http2");

/*var server=http.createServer(function(req,res){
    res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
    res.write("<html><head><title>Es1 Server</title></head>");
    res.write("<body>\nQuesto è un server web Node");
    res.write("\n<p>Testo scritto tramite l'utilizzo di una function implicita alla createServer");
    res.end("</body></html>");  
});

server.listen(8888,"127.0.0.1");*/

var server=http.createServer(crea);
server.listen(1337,"127.0.0.1");
console.log("Server running on port 1337...");

function crea(req, res){
    var risorsa=(url.parse(req.url)).pathname;
    console.log("Risorsa --> " + risorsa);
    switch(risorsa){
        case '/':
        case '/index.html':
            res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
            res.write("<html><head><title>Es1 Server</title>");
            res.write("<link rel='icon' sizes='32x32' href='favicon.ico?indice=0' />");
            res.write("<link rel='stylesheet' href='css/index.css' /><link rel='stylesheet' href='css/bootstrap.css' />");
            res.write("<script src='js/jquery.js'></script><script src='js/index.js'></script></head>");
            res.write("<body>Questo è un server web Node");
            res.write("<h1>Testo scritto tramite l'utilizzo di una function esterna alla createServer</h1>");
            res.write("<p id='par'>Paragrafo di testo formattato tramite css</p>");
            res.write("<form action='/params' method='post'>Username: <input type='text' name='txtUser' /><input type='submit' value='Redirect to Pag 2' class='btn btn-primary' /></form>");
            res.write("<input type='button' value='Vai a P3' class='btn btn-danger' id='btnP3' />");
            res.end("</body></html>");  
            break;
        case '/params':
            var mysql=require("mysql");
            var con=mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "delivery"
            });
            var user="";
            //LETTURA PARAMETRI GET
            /*var querystring=require("querystring");
            var param=querystring.parse(url.parse(req.url).query);
            user=param["txtUser"];
            console.log("USER = " + user);*/

            //LETTURA PARAMETRI POST
            var body="";
            req.on("data", function(data){
                body+=data;
            });
            req.on("end",function(){
                var param=require("querystring").parse(body);
                var user=param.txtUser;
                console.log("USER = " + user);
                con.connect(function(err){
                    if(!err){
                        console.log("CONNECTED!!");
                        getDati(req,res,con,user);
                    }
                    else
                        console.log("CONNECTION ERROR!!");
                });
            });

            


            break;
        case '/pagina3':
            fs.readFile("./pag3.html","utf8",function(err,content){
                if(!err){
                    var header={"Content-Type":"text/html;charset=utf-8"};
                    res.writeHead(200,header);
                    res.write(content);
                    res.end("<a href='/' class='btn btn-danger'>Torna alla Home</a>");
                }
                else
                    pageNotFound(res);
            });
            break;
        default:
            var extName=path.extname(risorsa);
            /*console.log("Risorsa richiesta: " + risorsa);
            console.log("Ext: " + extName);
            console.log("Risorsa richiamata (percorso escluso): " + path.basename(risorsa));
            console.log("Cartella della risorsa: " + path.dirname(risorsa));*/
            switch(extName){
                case '.css':
                    res.writeHead(200,{"Content-Type":"text/css;charset=UTF-8"});
                    res.end(fs.readFileSync("." + risorsa));
                    break;
                case '.js':
                    res.writeHead(200,{"Content-Type":"text/javascript;charset=UTF-8"});
                    res.end(fs.readFileSync("." + risorsa));
                    break;
                case '.ico':
                    res.writeHead(200,{"Content-Type":"image/png"});
                    res.end(fs.readFileSync("." + risorsa));
                    break;
                default:
                    pageNotFound(res);
            }
    }
}

function pageNotFound(res){
    var header={"Content-Type":"text/html;charset=utf-8"};
    res.writeHead(404, header);
    res.end(fs.readFileSync("./error.html"),"utf8");
}

function getDati(req,res,con,user){
    con.query("Select * from utenti where cognome = '" + user + "'",function(errQ,results){
        if(!errQ){
            if(results.length==0){
                console.log("Nessun dato prelevato");
            }else{
                console.log("Nome: " + results[0].nome);
                console.log("Cognome: " + results[0].cognome);
                console.log("Città: " + results[0].citta);
            }
        }
        else
            console.log("Errroe nella query!");
    });
}