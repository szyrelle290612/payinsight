import bodyParser from "body-parser";
import multer from "multer";
import { getFileStream, uploadFile } from "./s3";




Picker.middleware(multer().any());
Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));

Meteor.startup(() => {
    Picker.route("https://account.hubstaff.com/authorizations/new", async function (params, request, response, next) {
        request;
        switch (request.method) {
            case "POST": {
                if (request.files && request.files.length > 0) {
                    const file = request.files[0];
                    console.log(file);
                    const result = await uploadFile(file);
                    response.end(result.key);
                }
                break;
            }
            case "GET":
            case "DELETE":
            case "PUT":
            default:
                response.statusCode = 404;
                response.end("HI");
                break;
        }
    });

    Picker.route("/coupon/:key", async function (params, request, response, next) {
        request;

        switch (request.method) {
            case "POST":
            case "GET": {
                const key = params.key;
                const readStream = await getFileStream(key);
                readStream.pipe(response);
                break;
            }
            case "DELETE":
            case "PUT":
            default:
                response.statusCode = 404;
                response.end("HI");
                break;
        }
    });

});
