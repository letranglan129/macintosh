const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AppSchema = new Schema({
    name: { type: String, require: true },
    type: { type: String, require: true },
    price: { type: Number, require: true },
    desc: { type: String, require: true },
    img: { type: String },
    link: { type: String, require: true },
    class: { type: String, require: true },
    typeGame: { type: [String] },
    categoryType: { type: [String], require: true },
    descImage: { type: [String], require: true },
    deletedAt: { type: Date, require: true },
    slug: { type: String, require: true },
    equipment: { type: [String], require: true },
    download: { type: Number, default: 0, require: true},
    size: { type: Number, require: true},
}, {
    timestamps: true,
});

AppSchema.query.sortable = function(req, res) {
    if (res.locals._sort.enabled) {
        var isValidType = ['asc', 'desc'].includes(res.locals._sort.type)
        return this.sort({
            [res.locals._sort.column]: isValidType ? res.locals._sort.type : 'desc',
        })
    }
    return this
}

AppSchema.query.paginationHandle = function(req, res, next) {
    if (res.locals.pagination.enabled) {
        var page = Number(res.locals.pagination.page)
        var start = page > 0 ? (page - 1) * res.locals.pagination.showPercent : 0
        return this.skip(start).limit(res.locals.pagination.showPercent)
    }
    return this
}


module.exports = mongoose.model("App", AppSchema)