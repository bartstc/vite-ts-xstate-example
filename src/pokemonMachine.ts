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

export default /** @xstate-layout N4IgpgJg5mDOIC5QAcD2BrMBbVA7AsgIYDGAFgJa5gDEAwgK4BOjYuALgAqEwDKYbAbQAMAXUQpUscm3J5xIAB6IALAFYAbABoQAT0QBaAIzKA7ADoAnAA51FgEwBmZeruqTq5QF9P2tJhwEJBRUZgAyqIQQlFAABH7YeLDUEHhgZpQAbhhp8QFEZJRp4ZHRcdkBsAiZqMSEMnjCIo3yaFL1uPJKCA6GFmYONsqGDuqGdmMu2noIvX0mVspW7kLKFuo9qlbevuV4+cFFEVG4sbmJ1GDMqIxmyAA2dQBm11i3u4EFIcXHp++V1bV2o1mkgQK1pLIOqCukYrKozC51Mohk4LBYHD0TFNEHZcWYTEJrFZDCY7GtDOp1KptmD3vtCmYOH8YncjpBqEz-HgAJIQPiCUQtSQQuTQxDrQxmYkmCyEpG41RCLG6HFIswaFaLEyGNykww0s4fA5hI6lKQnO5gMpc3DJVLpXBZTBvG30r6mk4xc1QS3WhK4KqOmp1SHAwWg8HtTo4oR2MxCQl2KwWQzJ0xUhzYhCqOzmOxCZPWZQOcaLCwGulBBnfM3RX2Gi5XG73J4vF3+t2HEqe73196BrKA0OiEESNqQ6MIfNx9TzFY65RKmyZlXdVSStTGDHqIQ7hZeHy011VkI8OtWw0stkQDnvXn80e08ei0BdCVSkmytbKBVKrMuIRLGJdYlTGOx1nUbxD1wVAIDgIVj0+MAhWfKFXwMJM81sEsLHmVYSVUVQs30Rx4UWbDCOLJMhmpQ9DU7E1u1+G14AjYUozFBA+kMVNixMdxZhzFdpncSxcRsSl+IxHjyzoyskMZZlWUiSAUJFNDFHFDQzHzRUljWWMBgsLM0TMH8kysZNwIcdETAPHZEONABRJs1I49CEBImydOwsk8JTdxlWmHoHDMVMbJTOxi1wtMK0c6sPViXsL3eNyJ04ndlAREYqUpAi0yzNQsp1WctwcDwSTijsTzSM8LRSm0rxUiA0pfTSpzxBxdxLZNk1UNEqSzUl1HxcYlk2KwhDGXCoM8IA */
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
