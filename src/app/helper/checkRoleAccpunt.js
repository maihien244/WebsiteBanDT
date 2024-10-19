module.exports = {
    checkRoleAccount: (role) => {
        return (role != 'user') ? true : false
    },
    selectField: (option1, option2) => {
        return (option1 != '') ? option1 : option2
    }
}