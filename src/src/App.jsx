import { useEffect, useState } from "react";

const oefeningen = [
  "Pull down",
  "Single arm machine row",
  "Single arm machine pull down",
  "Single arm cable row",
  "Machine pull up"
];

const maakLegeTraining = () =>
  oefeningen.map((naam) => ({
    naam,
    sets: [
      {
        gewicht: "",
        herhalingen: ""
      },
      {
        gewicht: "",
        herhalingen: ""
      }
    ]
  }));

function App() {
  const [training, setTraining] = useState(maakLegeTraining);
  const [geschiedenis, setGeschiedenis] = useState([]);
  const [tab, setTab] = useState("training");

  useEffect(() => {
    const opgeslagenTraining =
      localStorage.getItem("huidigeTraining");

    const opgeslagenGeschiedenis =
      localStorage.getItem("trainingsGeschiedenis");

    if (opgeslagenTraining) {
      setTraining(JSON.parse(opgeslagenTraining));
    }

    if (opgeslagenGeschiedenis) {
      setGeschiedenis(JSON.parse(opgeslagenGeschiedenis));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "huidigeTraining",
      JSON.stringify(training)
    );
  }, [training]);

  useEffect(() => {
    localStorage.setItem(
      "trainingsGeschiedenis",
      JSON.stringify(geschiedenis)
    );
  }, [geschiedenis]);

  function updateSet(
    oefeningIndex,
    setIndex,
    veld,
    waarde
  ) {
    const nieuweTraining = [...training];

    nieuweTraining[oefeningIndex] = {
      ...nieuweTraining[oefeningIndex],
      sets: [...nieuweTraining[oefeningIndex].sets]
    };

    nieuweTraining[oefeningIndex].sets[setIndex] = {
      ...nieuweTraining[oefeningIndex].sets[setIndex],
      [veld]: waarde
    };

    setTraining(nieuweTraining);
  }

  function trainingOpslaan() {
    const heeftData = training.some((oefening) =>
      oefening.sets.some(
        (set) =>
          set.gewicht !== "" ||
          set.herhalingen !== ""
      )
    );

    if (!heeftData) {
      alert("Vul minstens één set in.");
      return;
    }

    const nieuweTraining = {
      id: Date.now(),
      datum: new Date().toLocaleDateString("nl-BE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }),
      oefeningen: training
    };

    setGeschiedenis([
      nieuweTraining,
      ...geschiedenis
    ]);

    setTraining(maakLegeTraining());

    alert("Training opgeslagen! 💪");
  }

  function verwijderTraining(id) {
    const bevestiging = window.confirm(
      "Weet je zeker dat je deze training wilt verwijderen?"
    );

    if (!bevestiging) return;

    setGeschiedenis(
      geschiedenis.filter(
        (trainingItem) =>
          trainingItem.id !== id
      )
    );
  }

  function resetAlles() {
    const bevestiging = window.confirm(
      "Weet je zeker dat je alle trainingsgegevens wilt verwijderen?"
    );

    if (!bevestiging) return;

    setTraining(maakLegeTraining());
    setGeschiedenis([]);
  }

  return (
    <div className="app">
      <header className="header">
        <p className="eyebrow">MIJN FITNESS</p>

        <h1>💪 Trainingsapp</h1>
      </header>

      <nav className="navigation">
        <button
          className={
            tab === "training" ? "active" : ""
          }
          onClick={() => setTab("training")}
        >
          🏋️ Training
        </button>

        <button
          className={
            tab === "geschiedenis" ? "active" : ""
          }
          onClick={() =>
            setTab("geschiedenis")
          }
        >
          📅 Geschiedenis
        </button>
      </nav>

      {tab === "training" && (
        <main>
          <section className="intro">
            <h2>Rugtraining</h2>

            <p>
              Vul voor elke oefening je gewicht
              en aantal herhalingen in.
            </p>
          </section>

          <section className="exercise-list">
            {training.map(
              (oefening, oefeningIndex) => (
                <article
                  className="exercise-card"
                  key={oefening.naam}
                >
                  <h3>{oefening.naam}</h3>

                  <div className="sets">
                    {oefening.sets.map(
                      (set, setIndex) => (
                        <div
                          className="set-card"
                          key={setIndex}
                        >
                          <div className="set-title">
                            Set {setIndex + 1}
                          </div>

                          <div className="inputs">
                            <label>
                              <span>
                                Gewicht (kg)
                              </span>

                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                inputMode="decimal"
                                placeholder="50"
                                value={
                                  set.gewicht
                                }
                                onChange={(e) =>
                                  updateSet(
                                    oefeningIndex,
                                    setIndex,
                                    "gewicht",
                                    e.target.value
                                  )
                                }
                              />
                            </label>

                            <label>
                              <span>
                                Herhalingen
                              </span>

                              <input
                                type="number"
                                min="0"
                                inputMode="numeric"
                                placeholder="12"
                                value={
                                  set.herhalingen
                                }
                                onChange={(e) =>
                                  updateSet(
                                    oefeningIndex,
                                    setIndex,
                                    "herhalingen",
                                    e.target.value
                                  )
                                }
                              />
                            </label>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </article>
              )
            )}
          </section>

          <button
            className="save-button"
            onClick={trainingOpslaan}
          >
            💾 Training opslaan
          </button>
        </main>
      )}

      {tab === "geschiedenis" && (
        <main>
          <section className="intro">
            <h2>Trainingsgeschiedenis</h2>

            <p>
              Hier vind je al je opgeslagen
              trainingen.
            </p>
          </section>

          {geschiedenis.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">
                🏋️
              </div>

              <h3>Nog geen trainingen</h3>

              <p>
                Je opgeslagen trainingen
                verschijnen hier.
              </p>
            </div>
          ) : (
            <section className="history">
              {geschiedenis.map(
                (trainingItem) => (
                  <article
                    className="history-card"
                    key={trainingItem.id}
                  >
                    <div className="history-header">
                      <h3>
                        📅 {trainingItem.datum}
                      </h3>

                      <button
                        className="delete-button"
                        onClick={() =>
                          verwijderTraining(
                            trainingItem.id
                          )
                        }
                      >
                        Verwijderen
                      </button>
                    </div>

                    <div className="history-exercises">
                      {trainingItem.oefeningen.map(
                        (oefening) => {
                          const heeftData =
                            oefening.sets.some(
                              (set) =>
                                set.gewicht !== "" ||
                                set.herhalingen !== ""
                            );

                          if (!heeftData) {
                            return null;
                          }

                          return (
                            <div
                              className="history-exercise"
                              key={oefening.naam}
                            >
                              <strong>
                                {oefening.naam}
                              </strong>

                              {oefening.sets.map(
                                (
                                  set,
                                  setIndex
                                ) => {
                                  if (
                                    set.gewicht === "" &&
                                    set.herhalingen === ""
                                  ) {
                                    return null;
                                  }

                                  return (
                                    <div
                                      className="history-row"
                                      key={
                                        setIndex
                                      }
                                    >
                                      <span>
                                        Set{" "}
                                        {setIndex + 1}
                                      </span>

                                      <span>
                                        {set.gewicht ||
                                          "—"}{" "}
                                        kg ×{" "}
                                        {set.herhalingen ||
                                          "—"}
                                      </span>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </article>
                )
              )}
            </section>
          )}

          {geschiedenis.length > 0 && (
            <button
              className="reset-button"
              onClick={resetAlles}
            >
              🗑️ Alle geschiedenis verwijderen
            </button>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
