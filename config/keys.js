module.exports = {
    mongoURI: 'mongodb://duhan:sachin123@ds013599.mlab.com:13599/usip-dtu',
    JWT_key: 'USIP_application!mainPortal',
    AWS_ACCESS_KEY: 'AKIAJ3SCYQYMIJZQ5TBA',
    AWS_SECRET_ACCESS_KEY: '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',
    AWS_REGION: 'us-east-2',
    S3_BUCKET_NAME: 'usip-files',
    // currently not in use!
    SendGrid_API_key: 'SG API KEY',
    msg91_secret: 'MSG SECRET',
    msg91_template_id: 'Template ID FOR SMS',
    // make sure that no credentials are deleted here!!
    morgan_logging_string: 'Req IP = :remote-addr | Remote User = :remote-user | [:date[web]] | ":method :url" | Status code = :status | Content Length = :res[content-length] | Response Time = :response-time ms',
    application_title_for_DB: "Allow USIP intern application",
    bank_title_for_DB: "Allow bank details",
}

// default password for the intern is = "usip_intern"