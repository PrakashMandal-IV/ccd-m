const cors = require("cors");
const { Response } = require("../modals/response.modal");
const apiRoutes = require('../routes')
const bodyParser = require("body-parser");
const init = (app) => {
    app.use(cors());
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.raw({ type: 'multipart/form-data', limit: '100mb' }));
    app.use(bodyParser.urlencoded({ extended: true }));


    app.use('/api', apiRoutes)


    app.response.success = function (message, data, displayMessage, code) {
        this.status(200).send(
            Response("success", message, data, displayMessage, code)
        );
    };

    app.response.error = function (message, data, displayMessage, code) {
        const newMessage =
            typeof message !== "string" ? "Something went wrong" : message;
        this.status(400).send(
            Response("error", newMessage, data, displayMessage, code)
        );
    };

    app.response.unauthorized = function (message) {
        const newMessage =
            typeof message !== "string" ? "Something went wrong" : message;
        this.status(403).send(
            Response("Unauthorized User", newMessage, null, null, 403)
        );
    };

    app.response.accessDenied = function () {
        this.status(500).send(Response("error", "Access Denied", null, null, 500));
    };

}


module.exports = {
    init,
};
