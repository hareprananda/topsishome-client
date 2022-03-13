export interface Pagination<T> {
  meta: {
    currentPage: number
    numberOfPage: number
    dataPerPage: number
  }
  data: T
}
