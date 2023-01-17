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
    db.createTable("posts", {
        id: { type: "int", primaryKey: true, autoIncrement: true, notNull: true },
        title: "string",
        description: "string",
        slug: { type: "string", unique: true, notNull: true },
        author_id: "int",
        created_at: {
            type: "timestamp",
            notNull: true,
            defaultValue: "CURRENT_TIMESTAMP",
        },
        updated_at: {
            type: "timestamp",
            notNull: true,
            defaultValue: "CURRENT_TIMESTAMP",
        },
    });

    return await db.addForeignKey(
        "posts",
        "users",
        "posts_authorid_foreign", { author_id: "id" }, {
            onDelete: "CASCADE",
            onUpdate: "RESTRICT",
        }
    );
};

exports.down = function(db) {
    return db.dropTable("posts");
};

exports._meta = {
    version: 1,
};