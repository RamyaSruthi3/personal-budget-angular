export type Datasource = {
  datasets: [
    {
      data: number[],
      backgroundColor: string[],
    }
  ],
  labels: string[]
}

export type Datasource1 = {
  label: string,
  value: number
}[]
