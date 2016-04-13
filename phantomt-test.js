var page = require('webpage').create();
page.open('test/index.html', function() {
    page.render('test.png');
    phantom.exit();
});