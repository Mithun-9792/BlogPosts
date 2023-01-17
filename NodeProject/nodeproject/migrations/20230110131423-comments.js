'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = async function(options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = async function(db) {
    await db.addColumn("comments", "user_id", {
        type: "int",
        notNull: true,
    });

    return await db.addForeignKey(
        "comments",
        "users",
        "comments_usersId_foreign", { user_id: "id" }, {
            onDelete: "CASCADE",
            onUpdate: "RESTRICT",
        }
    );
};

exports.down = function(db) {
    return db.removeColumn("comments", "user_id");
};

exports._meta = {
    "version": 1
};