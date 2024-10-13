exports.isLoggedIn = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/admin');
    }
};