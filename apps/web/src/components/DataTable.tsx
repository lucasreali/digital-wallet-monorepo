import {
  type ColumnDef,
  createColumnHelper,
  createSortedRowModel,
  type RowData,
  rowSortingFeature,
  type SortingState,
  sortFn_alphanumeric,
  sortFn_basic,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { Icon } from '#/components/Icon'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
})

type Features = typeof features

/** Column helper bound to the table features: `const col = columnHelper<User>()`. */
export const columnHelper = <T extends RowData>() => createColumnHelper<Features, T>()

type Props<T extends RowData> = {
  data: T[]
  // biome-ignore lint/suspicious/noExplicitAny: column value types vary per column
  columns: ColumnDef<Features, T, any>[]
  label: string
  initialSorting?: SortingState
}

/** Prototype table (.table) on TanStack Table; columns with `enableSorting` get a sort button. */
export function DataTable<T extends RowData>({ data, columns, label, initialSorting = [] }: Props<T>) {
  const table = useTable({ features, columns, data, initialState: { sorting: initialSorting } })

  return (
    <section className="card" style={{ overflow: 'hidden' }} aria-label={label}>
      <div className="table-box">
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  const sorted = header.column.getIsSorted()
                  const align = header.column.columnDef.meta as { align?: 'right' } | undefined
                  return (
                    <th
                      key={header.id}
                      className={align?.align === 'right' ? 'r' : undefined}
                      aria-sort={sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : undefined}
                    >
                      {header.column.getCanSort() ? (
                        <button className="th-sort" type="button" onClick={header.column.getToggleSortingHandler()}>
                          <table.FlexRender header={header} />
                          {sorted && (
                            <Icon name="arrowDown" size="xs" className={sorted === 'asc' ? 'rotate-180' : ''} />
                          )}
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getAllCells().map((cell) => {
                  const align = cell.column.columnDef.meta as { align?: 'right' } | undefined
                  return (
                    <td key={cell.id} className={align?.align === 'right' ? 'r' : undefined}>
                      <table.FlexRender cell={cell} />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
