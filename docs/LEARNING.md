# Study the companion FinForge backend

This repository is linked from the [FinForge submission](https://devpost.com/software/finforge). It contains Express report routes, Mongoose models, URL feature extraction in `lib/utils.js`, and model training in `models/train.py`. The [local CRUD lab](https://github.com/ErwinHe7/hackathon-crud-lab) teaches the shared HTTP/persistence concepts without live services.

## Fix included in this fork

`routes/report.js` saved a report, then tried to return undefined `data`. The fork returns the saved report with `201`, matching the equivalent fix in [Double-Fraud](https://github.com/ErwinHe7/Double-Fraud).

```sh
node --test test/create-report.test.cjs
```

Two isolated tests verify a successful save's response and a rejected save. They substitute the model and router, so they do not use MongoDB, cloud credentials, model training, WHOIS, or website scanning.

Learning order: read the report route and model first; complete local report CRUD second; study URL feature functions and the training pipeline later. Explain why heuristic URL features alone do not establish whether a website is safe.

This is a legacy hackathon integration; live execution needs your own disposable configuration and further validation. Treat the saved models as an optional reading topic for this assessment preparation.
