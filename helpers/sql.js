const { BadRequestError } = require("../expressError");

// Take data to update and convert to SQL
/* in static method update we take in Update(handle, data) data is req.body. Inside the method update(company.js) the function sqlForPartialUpdate gets data to update from req.body and what to convert to sql
Object.keys method returns an array of the key values

* Throws BadRequestError if not found.
sqlForPartialUpdate(
        data,
        {
          numEmployees: "num_employees",
          logoUrl: "logo_url",
        });
*/ 

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
