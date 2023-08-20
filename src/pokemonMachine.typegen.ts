// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.pokemonMachine.Loading pokemons:invocation[0]": {
      type: "done.invoke.pokemonMachine.Loading pokemons:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.pokemonMachine.Loading single pokemon:invocation[0]": {
      type: "done.invoke.pokemonMachine.Loading single pokemon:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    fetchCurrentPage: "done.invoke.pokemonMachine.Loading pokemons:invocation[0]";
    getSelectedPokemon: "done.invoke.pokemonMachine.Loading single pokemon:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    setCurrentPage: "CurrentPageSet";
    setPokemon: "done.invoke.pokemonMachine.Loading single pokemon:invocation[0]";
    setPokemonList: "done.invoke.pokemonMachine.Loading pokemons:invocation[0]";
    setSelectedPokemonId: "PokemonIdSet";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    fetchCurrentPage: "CurrentPageSet" | "xstate.init";
    getSelectedPokemon: "PokemonIdSet";
  };
  matchesStates:
    | "Error"
    | "Loading pokemons"
    | "Loading single pokemon"
    | "Pokemons loaded"
    | "Single pokemon loaded";
  tags: never;
}
