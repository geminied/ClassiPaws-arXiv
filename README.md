# arXiv Explorer Frontend

## Run
1. Put the supplied image assets under `public/illustrations` and `public/decorations`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open http://localhost:3000.

## Real prediction connection
Create `.env.local` with `NEXT_PUBLIC_ML_API_URL=http://localhost:8000`.
The Predict page sends `{title, abstract, model}` to `POST /predict` and expects `{prediction, confidence, probabilities}`. It intentionally does not fake a result when FastAPI is unavailable.

## Pages included
Home, Search, Predict, Performance, Models, Ensemble, About. Paper detail routes and persistent settings can be added in the next pass; the core frontend is already wired around reusable components.
