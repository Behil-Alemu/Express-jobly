const {sqlForPartialUpdate} = require("./sql");
const { BadRequestError } = require("../expressError");

describe("sqlForPartialUpdate", function (){
    test("works: converts data to sql", function (){
        expect.assertions(2);
        const dataToUpdate = {firstName: 'Aliya', lastName: "Smith"}
        const jsToSql = {
            firstName: "first_name",
            lastName: "last_name"
          }
          const { setCols, values } =sqlForPartialUpdate(dataToUpdate, jsToSql)
          expect(values).toEqual(["Aliya","Smith"]);
          expect(setCols).toEqual(`"first_name"=$1, "last_name"=$2`);
        
    })
    
    test("works: invalid data entered", function (){
        const dataToUpdate = {firstName: 'Cat', lastName: "Skip"}
        const jsToSql = {}
        const { setCols, values } =sqlForPartialUpdate(dataToUpdate, jsToSql)
        expect(values).not.toBe(["cat", "skip"]);

    })

    test("works: throw BadRequestError", function (){
        expect(() => {
            sqlForPartialUpdate({},{});
          }).toThrow();
    })


})