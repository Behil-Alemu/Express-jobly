"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureIsAdmin } = require("../middleware/auth");
const Job = require("../models/job");

const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");

const router = new express.Router();

/** POST / { job } =>  { job }
 *
 * company should be { id, title, salary, equity, company_handle }
 *
 * Returns { d, title, salary, equity, company_handle}
 *
 * Authorization required: login
 */

 router.post("/", ensureIsAdmin, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, jobNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const company = await Job.create(req.body);
      return res.status(201).json({ company });
    } catch (err) {
      return next(err);
    }
  });

  /** GET /  =>
 *   { jobs: [ { id, title, salary, equity, company_handle }, ...] }
 *
 * Can filter on provided search filters:
 * 
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
    try {
      const jobs = await Job.findAll();
  
      return res.json({ jobs });
    } catch (err) {
      return next(err);
    }
  });

  /** GET /[id]  =>  { job }
 *
 *  Company is { id, title, salary, equity, company_handle }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
    try {
      const job = await Job.get(req.params.id);
      return res.json({ job });
    } catch (err) {
      return next(err);
    }
  });

/** PATCH /[id] { } => { job }
 *
 * Patches company data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { handle, name, description, numEmployees, logo_url }
 *
 * Authorization required: login
 */

 router.patch("/:id",ensureIsAdmin, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, jobUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const job = await Job.update(req.params.id, req.body);
      return res.json({ job });
    } catch (err) {
      return next(err);
    }
  });


  /** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: login
 */

router.delete("/:id", ensureIsAdmin, async function (req, res, next) {
    try {
      await Job.remove(req.params.id);
      return res.json({ deleted: req.params.id });
    } catch (err) {
      return next(err);
    }
  });
  
  
  module.exports = router;
