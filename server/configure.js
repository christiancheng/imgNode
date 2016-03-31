var connect = require('connect'),
    path = require('path'),
    // routes = require('./routes'),
    exphbs = require('express3-handlebars');

module.exports = function(app) {
    app.engine('handlebars', exphbs.create({
        defaultLayout: 'main',
        layoutsDir: app.get('views') + '/layouts',
        partialsDir: [app.get('views') + '/partials']
     }).engine);
    app.set('view engine', 'handlebars');

    return app;
};

