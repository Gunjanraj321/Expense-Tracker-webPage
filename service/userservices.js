const getExpenses = (req,res) =>{
    return req.user.getExpenses(where);
}

module.exports = {
    getExpenses
}