module.exports = {
    mutipleToObjectLitera: function (courses) {
        return courses.map(course => course.toObject())
    },
    toObjectLitera: function (course) {
        return course.toObject()
    }
}