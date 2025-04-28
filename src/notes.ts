// * Notes  *//

// There are basically two types of software design patterns for Express Application.

// 1.*****MVC Pattern(Almost Dead) -> Model, View, Controller,Interface(if ts included) folders.
// Model -> Models
// View -> Express diye server side rendering korte , HTML toiry kort Template engine lage such as EJS,PUG
// Controller -> Controller
// Routes-> routes
// MVC pattern is followed lesser today after the introduction of Client Libraries such as ReactJS/AngularJs / Vuejs

// 2.******Modular Pattern****** -> Every feature gets a module, example: Student module. Files related to student, coupled in student module.

// ****Principles=>  1.DRY  2. Fat Model / Thin Controller

// ***** Modular pattern steps, using Mongoose=>

// => Schema -> Model -> DbQuery   (Javascript)
// => Interface -> Schema -> Model -> DbQuery   (Typescript)

//*** Mongoose acts like an army. We can validate  data ,maintain proper data structure by Using Mongoose.
// Mongoose schema and data types => https://mongoosejs.com/docs/guide.html
// The permitted SchemaTypes are: String,Number,Date,Buffer, Boolean, Mixed,ObjectId,Array,Decimal128,Map,UUID

// //<--------- Modular pattern--------->

// Request - Response flow =>

// Client---req--->route.ts---req-->controller.ts---req-->service.ts(Handles business logic)-->
// service.ts--res--->controller.ts----res--->Client

// 1. Client sends request that hits = routes.ts,
// 2. route.ts calls the controller function from controller.ts,
// 3. controller.ts calls the service  function from service.ts,
// 4. service.ts handles the business logic. It Gets data by querying on the model from the
//    database, then gives the data to the controller.
// 5. controller ,as a response, sends the data to the client.
// response data example {success, message, data}

//****Inside a module These are the necessary files and their roles(ex:student)*******

// 1. student.interface.ts-> handles type and interface declarations
// 2.student.model.ts-> handles creating mongoose schema and model

// 3. student.routes.ts->  Handles the routes
// 4. student.controller.ts-> Only handles request and response
// 5. student.service.ts-> Handles the business logic like Database interaction.

// ******Highlights*****
// client Request goes through ----->route->controller->service
// service files operates with the Interface and model files. then performs query on mongoose model.
// Response comes through ----------service-> controller-> client

// ***Create/add a student to 'students' collectionin 'my-ph-university-server' DB via POSTMAN->***

// Generate fake json data via chatgpt, use the model file to generate dummy json data(student)
// Create new Collection, rename collection (my-ph-university-server), add request, and rename the request meaningfully
// To insert a student object to 'students' collection in 'my-ph-university-server' database, Send POST request to http://localhost:3000/api/v1/students/create-student
// Select body->raw->json, then edit the json body, {"student": json dummy object}

// *****Add Mongodb atlas  to compass-> get the DATABASE_URL from .env, save the url, and then connect.

// ----------------------------------------End module-------------------------------------------//

// *****Validation

// -- When we send data from client(by react/vue/postman)-->
//     Mongoose receives the data,it starts mapping the data with the model.(Object Data Modeling/ ODM Library)
//     If the data is valid, it allows to keep the data on mongodb with the help of mongodb drivers behind the scene.
//     Mongoose validates the data. Sometimes we need to validate the data again. Ex: correct validation of email / number  etc.

// 3 ways to validate data with Mongoose

// built in validation provided by Mongoose -> https://mongoosejs.com/docs/validation.html
// custom validation by custom function
// popular validation library (ex: ZOD,ZOI)

// These re the popular validators:

// 1. validator -> https://www.npmjs.com/package/validator , doc-> https://github.com/validatorjs/validator.js
//  $ npm i validator
//  dt => as this package does not come with type library support , we will have to install it's library as dev dependency,
//
// cause in real life at project, we will need only javascript=> $ npm i -D @types/validator

// 2. joi -> https://www.npmjs.com/package/joi ,  Doc->https://joi.dev/api/
// joi provides a  schema , that we can define.
// we have to use it in controller to validate the data we get from client

// But we will use =>
// 3. Zod -> Zod is a TypeScript-first schema declaration and validation library. The term "schema" to broadly refer to any data type, from a simple string to a complex nested object.

// Zod Basic usage/ Doc -> https://zod.dev/?id=basic-usage
// Zod can automatically infer types, so do not need to declare types/interfaces.

// -----end---

// Mongoose static and instance method DOc=> https://mongoosejs.com/docs/typescript/statics-and-methods.html

// Mongoose have --> 1.Built in static method
//                     ex: StudentModel.create()

//                   2.Built in instance method
//                     ex: const student = new StudentModel();
//                          student.save()

// We can add custom made Satatic method -> Schema-> statics property-> custom made static  method
// We can add custom made Instance method -> Schema-> methods property-> custom made instance method

// ------end-----

// Mongoose middlwares/ mongoose hooks-> document middleware, query middleware, aggregation middleware
// so that we can modify/ work  pre/post ( before/ after)  documents save/query/aggregation

// bycript -> A library to help you hash passwords, needs additional ts support. this package does not come with type library support , we will have to install it's library as dev dependency
// https://www.npmjs.com/package/bcrypt
// npm i bcrypt
// npm i -D @types/bcrypt

// refferences of 'this' in different middlewares
// document middleware = current document
// query middleware = current query
// aggregate middleware = current pipeline

// Mongoose virtuals -> We can give an data that is not in our db, but derived from our db, by using mongoose virtuals
// The  purpose of virtuals-> To create virtual documents that exist only in memory, not in the database.
//findOneAndUpdate returns updated data, updateOne does not
/*
how to generate random number for JWT_ACCESS_SECRET
open =>NODE in terminal
then =>require('crypto').randomBytes(32).toString('hex')
*/
