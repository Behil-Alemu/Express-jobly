const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");


const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
  } = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);



/************************************** create */

describe("create", function () {
    const newJob= {
    id: 14,
    title: "dancer",
    salary: 176000,
    equity: "0.6",
    companyHandle: "c3",
    };
    test("works", async function () {
        let job = await Job.create(newJob);
        expect(job).toEqual(newJob);
    
        const result = await db.query(
              `SELECT id, title, salary, equity, company_handle AS "companyHandle"
               FROM jobs
               WHERE id = 13`);
        expect(result.rows).toEqual([
          {
            id: 13,
            title: "manager",
            salary: 54000,
            equity: "0.6",
            companyHandle: "c3",
          },
        ]);
      });
      test("bad request with dupe", async function () {
        try {
          await Job.create(newJob);
          await Job.create(newJob);
          fail();
        } catch (err) {
          expect(err instanceof BadRequestError).toBeTruthy();
        }
      });
})
/************************************** findAll */

describe("findAll", function () {
    test("works: no filter", async function () {
      let jobs = await Job.findAll();
      expect(jobs).toEqual([
        {
            id: 11,
            title: "sailer",
            salary: 76000,
            equity: "1.0",
            companyHandle: "c1",
        },
        {
            id: 12,
            title: "barista",
            salary: 29000,
            equity: "0.8",
            companyHandle: "c2",
        },
        {
            id: 13,
            title: "manager",
            salary: 54000,
            equity: "0.6",
            companyHandle: "c3",
        }
      ]);
    });
  });

/************************************** get */

describe("get", function () {
    test("works", async function () {
      let job = await Job.get("barista");
      expect(job).toEqual({
        id: 12,
        title: "barista",
        salary: 29000,
        equity: "0.8",
        companyHandle: "c2",
      });
    });
  
    test("not found if no such job", async function () {
      try {
        await Job.get("nope");
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });
//   /************************************** update */
  describe("update", function () {
    const updateData = {
      title: "manager",
      salary: 50000,
      equity: 1.0,
      companyHandle: "c3",
    };
  
    test("works", async function () {
    //   let job = await Job.update(11, updateData);
    //   expect(job).toEqual({
    //     id: 11,
    //     ...updateData,
    //   });
  
      const result = await db.query(
            `SELECT id, title, salary, equity, company_handle
             FROM jobs
             WHERE id = 11`);
      expect(result.rows).toEqual([{
        id: 11,
        title: "sailer",
        salary: 76000,
        equity: "1.0",
        company_handle: "c1",
      }]);
    });
  
    test("works: null fields", async function () {
      const updateDataSetNulls = {
        title: "New",
        salary: null,
        equity: null,
        companyHandle: "c3",
      };
  
      let job = await Job.update(11, updateDataSetNulls);
      expect(job).toEqual({
        id: 11,
        ...updateDataSetNulls,
      });
  
      const result = await db.query(
            `SELECT id, title, salary, equity, company_handle
             FROM jobs
             WHERE id = 11`);
      expect(result.rows).toEqual([{
        id: 11,
        title: "New",
        salary: null,
        equity: null,
        company_handle: "c3",
      }]);
    });
  
    test("not found if no such job", async function () {
      try {
        await Job.update(33, updateData);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  
    test("bad request with no data", async function () {
      try {
        await Job.update(12, {});
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
  });
//   /************************************** remove */

describe("remove", function () {
    test("works", async function () {
      await Job.remove(11);
      const res = await db.query(
          "SELECT id FROM jobs WHERE id=11");
      expect(res.rows.length).toEqual(0);
    });
  
    test("not found if no such job", async function () {
      try {
        await Job.remove(99);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });