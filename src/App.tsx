import { useMachine } from "@xstate/react";

import { PokemonImage, Pokemon, PokemonList, Pages } from "./Components";
import pokemonViewerMachine from "./pokemonMachine";

import "./App.css";

function App() {
  const [
    {
      value,
      context: { pageCount, pokemonList, selectedPokemon },
    },
    send,
  ] = useMachine(pokemonViewerMachine);
  const error = value === "showError";

  return (
    <div className="app">
      {error && <div>We encountered an error. Please try again later.</div>}
      {!error && (
        <div className="container">
          <div>
            <PokemonList
              pokemonList={pokemonList}
              onClick={(id) => {
                send({
                  type: "PokemonIdSet",
                  id,
                });
              }}
            />
            <Pages
              pageCount={pageCount}
              onClick={(page) =>
                send({
                  type: "CurrentPageSet",
                  page,
                })
              }
            />
          </div>
          <div>
            <Pokemon pokemon={selectedPokemon} />
          </div>
          <div>
            <PokemonImage pokemon={selectedPokemon} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
