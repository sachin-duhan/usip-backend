exports.send_formatted_reponse_handler = (body, success, message, options) => {
    if (!message) message = 'ok';
    if (success == false) message = "Something went wrong, Try again later";
    if (success == false && body.code == 11000) message = "Duplicate entry found!!";
    if (success == false && body.name == "ValidationError") message = body.message;
    let formatted_response = {
        body,
        success,
        message: success ? 'ok' : message,
    }
    let overLoad = Object.keys(options);
    overLoad.forEach(el => formatted_response[el] = options[el]);
    return formatted_response;
}