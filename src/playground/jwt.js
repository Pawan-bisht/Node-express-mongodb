const jwt = require("jsonwebtoken");

let token = jwt.sign({ id:"er345treaifpavbgh980",email:"pawanbisht83@gmil.com"},"thisismysecret");
console.log(token);
let decodedToken = jwt.verify(token, "thisismysecret");
console.log(decodedToken.id);
console.log(decodedToken.email)