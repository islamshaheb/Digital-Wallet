"use strict";

exports.health = ctx => {
    const data = {
        status: "ok"
    };

    ctx.body = { data };
};