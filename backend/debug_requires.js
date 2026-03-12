const modules = [
  'express',
  'cors',
  '@prisma/client',
  'dotenv',
  './routes/userRoutes',
  './routes/jobRoutes',
  './routes/applicationRoutes'
];

modules.forEach(m => {
  try {
    console.log(`Trying to require: ${m}`);
    require(m);
    console.log(`Success: ${m}`);
  } catch (e) {
    console.error(`FAILED: ${m}`);
    console.error(e.message);
    if (e.stack) console.error(e.stack);
  }
});
