"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /companies */

describe("POST /jobs", function () {
    const newJob= {
        id: 13,
        title: "skipper",
        salary: 6000,
        equity: "1",
        companyHandle: "c1",
    };
    // test("ok for users", async function () {
    //     const resp = await request(app)
    //         .post("/jobs")
    //         .send(newJob)
    //         .set("authorization", `Bearer ${u1Token}`);
    //     expect(resp.statusCode).toEqual(201);
    //     expect(resp.body).toEqual({
    //       job: newJob,
    //     });
    //   });

    test("bad request with missing data", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send({
              title: "new",
              salary: 10,
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
      });
      test("bad request with invalid data", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send({
              ...newJob,
              logoUrl: "not-a-url",
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
      });


      
})

/************************************** GET /jobs */

describe("GET /jobs", function () {
    test("ok for list of jobs", async function () {
        const resp = await request(app).get("/jobs");
        expect(resp.body).toEqual({
            jobs:
            [
                {id: 11,
                    title: "barista",
                    salary: 25000,
                    equity: "0.9",
                    companyHandle: "c2",
                },
                {
                    id: 12,
                    title: "sailer",
                    salary: 76000,
                    equity: "1",
                    companyHandle: "c1",  
                },
            ],
        }); 
    });
    test("fails: test next() id", async function () {

        await db.query("DROP TABLE jobs CASCADE");
        const resp = await request(app)
            .get("/jobs")
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(500);
      });
});

/************************************** GET /jobs/:id */
describe("GET /companies/:handle", function () {
    test("works for anon", async function () {
        const resp = await request(app).get(`/jobs/11`);
        expect(resp.body).toEqual({
          job: {
            id: 11,
            title: "barista",
            salary: 25000,
            equity: "0.9",
            companyHandle: "c2",
          },
        });
      });
      test("job with id not found", async function () {
        const resp = await request(app).get(`/companies/nope`);
        expect(resp.statusCode).toEqual(404);
      });

})

/************************************** PATCH /jobs/:id */

describe("PATCH /jobs/:id", function () {
    test("works for auth users", async function () {
        const resp = await request(app)
            .patch(`/jobs/11`)
            .send({
              title: "baker",
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({
          job: {
            id: 11,
            title: "baker",
            salary: 25000,
            equity: "0.9",
            companyHandle: "c2",
          },
        });
      });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/jobs/11`)
        .send({
          title: "taxi driver",
        });
    expect(resp.statusCode).toEqual(500);
  });

  test("not job found to update", async function () {
    const resp = await request(app)
        .patch(`/jobs/nope`)
        .send({
          title: "new nope",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });
  test("id change attempt not allowed", async function () {
    const resp = await request(app)
        .patch(`/jobs/11`)
        .send({
          id: 12,
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

})
/************************************** DELETE /jobs/:id */

describe("DELETE /jobs/:id", function () {
    test("works for users", async function () {
        const resp = await request(app)
        .delete(`/jobs/11`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ deleted: "11"});
    })
    test("unauth for user", async function () {
        const resp = await request(app)
            .delete(`/jobs/11`);
        expect(resp.statusCode).toEqual(500);
      });
      test("unauth for anon", async function () {
        const resp = await request(app)
            .delete(`/companies/91`);
        expect(resp.statusCode).toEqual(500);
      });
});