const moment = require("moment");

exports.formatDateFromComments = function(comments) {
    for (let i = 0; i < comments.length; i++) {
        let uglyDate = comments[i].created_at;
        let prettyDate = moment(uglyDate).format("YYYY-MM-DD H:mm");
        comments[i].prettyDate = prettyDate;
    }
    return comments;
};

exports.formatDateFromPost = function(post) {
    let uglyDate = post.created_at;
    let prettyDate = moment(uglyDate).format("YYYY-MM-DD H:mm");
    post.prettyDate = prettyDate;
    return post;
};
