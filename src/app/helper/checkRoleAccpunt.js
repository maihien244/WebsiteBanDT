module.exports = {
    checkRoleAccount: (role) => {
        return (role != 'user') ? true : false;
    }
}