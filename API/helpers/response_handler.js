exports.send_formatted_reponse_handler = (body, success, message) => {
    if (!message) message = 'ok';
    if (success == false && body.code == 11000) message = "Duplicate entry found!!";
    if (success == false && body.name == "ValidationError") message = body.message;
    return {
        body,
        success,
        message: success ? 'ok' : message
    }
}