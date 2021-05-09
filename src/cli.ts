#!/usr/bin/env node
import bailiffPromise from "./init";
import errors from './errors';

bailiffPromise.then(_res => {
  console.log("Bailiff: Initialized successfully");
}).catch(e => {
  console.error(errors["005"], e);
})