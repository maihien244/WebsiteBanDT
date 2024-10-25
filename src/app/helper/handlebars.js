const Handlebars = require('handlebars')

module.exports = {
    sum: (a , b) => a + b ,
    sortable: (_sort, column) => {
      const icons = {
        asc: '<i class="fa fa-sort-asc" aria-hidden="true"></i>',
        desc: '<i class="fa fa-sort-desc" aria-hidden="true"></i>',
        default: '<i class="fa fa-sort" aria-hidden="true"></i>',
      }
      const types = {
        asc: 'desc',
        desc: 'asc',
        default: 'asc',
      }
      const type = _sort.column === column ? _sort.type : 'default'
      const href = Handlebars.escapeExpression(`?_sort&column=${column}&type=${types[type]}`)
      const output =  `<a href='${href}'>
        ${icons[type]}
      </a>`
      return new Handlebars.SafeString(output)
    },
    equal: (value1, value2) => {
      return value1 == value2
    }
}