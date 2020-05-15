exports.send_formatted_reponse_handler = (body, success, message, options) => {
    if (!message) message = 'ok';
    if (!message && success == false) message = "Something went wrong, Try again later";
    if (!message && success == false && body.code == 11000) message = "Duplicate entry found!!";
    if (!message && success == false && body.name == "ValidationError") message = body.message;
    let formatted_response = { body, success, message: success && !message ? 'ok' : message };
    if (options) {
        let overLoad = Object.keys(options);
        overLoad.forEach(el => formatted_response[el] = options[el]);
    }
    return formatted_response;
}