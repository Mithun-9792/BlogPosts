"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = async function(db) {
    await db.createTable("comments", {
        id: { type: "int", primaryKey: true, autoIncrement: true, notNull: true },
        comments: { type: "string", notNull: true },
        post_id: { type: "int" },

        commentAt: {
            type: "timestamp",
            notNull: true,
            defaultValue: "CURRENT_TIMESTAMP",
        },
        UpdatedAt: {
            type: "timestamp",
            notNull: true,
            defaultValue: "CURRENT_TIMESTAMP",
        },
    });

    return await db.addForeignKey(
        "comments",
        "posts",
        "comments_postId_foreign", { post_id: "id" }, {
            onDelete: "CASCADE",
            onUpdate: "RESTRICT",
        }
    );
};

exports.down = function(db) {
    return db.dropTable("comments");
};

exports._meta = {
    version: 1,
};