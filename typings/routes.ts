export type CompiledRoute = {
  routeInfo: {
    page: string;
    path: string;
    query: { [key: string]: string | string[] };
  };
}[];
