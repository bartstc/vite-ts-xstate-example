export interface IPokemonItem {
  id: number;
  name: string;
}

export interface IPokemonListResponse {
  pageCount: number;
  list: Array<IPokemonItem>;
}
