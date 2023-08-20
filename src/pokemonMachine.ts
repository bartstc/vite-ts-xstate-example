import { createMachine, assign } from "xstate";
import { IPokemon, IPokemonItem } from "./types";

interface IContext {
  pageCount: number;
  pokemonList: Array<IPokemonItem>;
  currentPage: number;
  selectedPokemonID: number | null;
  selectedPokemon: IPokemon | null;
}

type Events =
  | { type: "CurrentPageSet"; page: number }
  | { type: "PokemonIdSet"; id: number };

type Services = {
  getSelectedPokemon: {
    data: IPokemon;
  };
  fetchCurrentPage: {
    data: {
      pageCount: number;
      list: Array<IPokemonItem>;
    };
  };
};

export default /** @xstate-layout N4IgpgJg5mDOIC5QAUD2BrMBbVA7AagJZgDuYATgHQwAuamOuAMobDQMQR5iWG4BuGHvWx4ipCtTB0hjFmwR9BAYwCGNQngDaABgC6iUAAdUsQhryGQAD0QBaACwBmJ5QAcLnQFY3DgEwAjE4OAGwA7AA0IACe9gFhrn5+TgCcLiFJGX4ODgC+uVEijOJkVLRFePIcFOSoVEYANuoAZnVYlBUExKVSMgyVrDSKAqhqFri6BkggJmbjVrYIdiEpOpSpYQ5eIRkhDmEpUbFLwZQpDm5eAaF+KclOHvmFsmLdkrAAFqgknVXsAMoAUQAKgB9IFMQEAYWBgIAIqDkAB5ADSgIAskiAHKggCScKss3MmlwCzibjc6z8lwC2x0bj8VwyR3spwOOzCYRCHgS2SeIE6JUk5ReuE43F4I0wHVFQrK0k6wxU6hJk0JpmJlmmi2urh5-h0YQCjJSXicLIQYS8lDCSQCAR0hr8CR0yX5gre8r6ojFNTqlEaLTaMv6XQkXsVSlGKu0+nVcxJZKWOQclC8yQCKwpOhS8QCFtNlEC-jcOhCwW2jJC7tlnson2+nQBIPBgMhMPhiNRGOxeIJ0yJ821cTZKTcKW56YOhq2FoCKRSaZ013TqVz+z5BQFtfDzbBUIAqgAlI+ArFg5AAQQA4oD45rScOluFU5nTeWnA67uaYvZnYuwldFw-BzICQi8fIt1wVAIDgKwPXDXpfkGe8h1ARY7CNAJKH2TNth2DwaQtOwAkuG1nXiDxDXApwa1DOV6y+H5RSqVDEyfRxbkoHRP3LecrVNc4HGIhxsK2bIkjuLxnFpFI6J9BiGxIQFyFqcg2K1dD7BWVMnHAhwyy2Wl4hCC0rncZc3BCe1OSNUs3Hk4o6xFUMNMfLSlmuAC9h4tIPCcHx0wtcsi1Iy4rXZYJHQgrcEJ6JTOjcpN4j8birJSW1SOdHIvAtQJUouDKnCNHivEdJw-Ec15wySjiEmtXDwJ2bkHiuYi9NTFYKvnVZpLcIJINyIA */
createMachine(
  {
    id: "pokemonMachine",
    initial: "Loading pokemons",
    tsTypes: {} as import("./pokemonMachine.typegen").Typegen0,
    schema: {
      context: {} as IContext,
      events: {} as Events,
      services: {} as Services,
    },
    context: {
      pageCount: 0,
      pokemonList: [],
      currentPage: 0,
      selectedPokemonID: null,
      selectedPokemon: null,
    },
    on: {
      CurrentPageSet: {
        actions: "setCurrentPage",
        target: ".Loading pokemons",
      },
    },
    states: {
      "Loading pokemons": {
        invoke: {
          src: "fetchCurrentPage",
          onDone: [
            {
              actions: "setPokemonList",
              target: "Pokemons loaded",
            },
          ],
          onError: [
            {
              target: "Error",
            },
          ],
        },
      },
      "Pokemons loaded": {
        on: {
          PokemonIdSet: {
            actions: "setSelectedPokemonId",
            target: "Loading single pokemon",
          },
        },
      },
      Error: {},
      "Loading single pokemon": {
        invoke: {
          src: "getSelectedPokemon",
          onDone: [
            {
              actions: "setPokemon",
              target: "Single pokemon loaded",
            },
          ],
          onError: [
            {
              target: "Error",
            },
          ],
        },
      },
      "Single pokemon loaded": {
        on: {
          PokemonIdSet: {
            actions: "setSelectedPokemonId",
            target: "Loading single pokemon",
          },
        },
      },
    },
  },
  {
    actions: {
      setCurrentPage: assign((_, event) => ({
        currentPage: event.page,
        selectedPokemon: null,
        selectedPokemonID: null,
      })),
      setPokemon: assign((_, event) => ({
        selectedPokemon: event.data,
      })),
      setSelectedPokemonId: assign((_, event) => ({
        selectedPokemonID: event.id,
      })),
      setPokemonList: assign((_, event) => ({
        pageCount: event.data.pageCount,
        pokemonList: event.data.list,
      })),
    },
    services: {
      getSelectedPokemon: (context) =>
        fetch(`/pokemon/${context.selectedPokemonID}.json`).then((res) =>
          res.json()
        ),
      fetchCurrentPage: (context) =>
        fetch(`/pages/${context.currentPage ?? 0}.json`).then((res) =>
          res.json()
        ),
    },
  }
);
