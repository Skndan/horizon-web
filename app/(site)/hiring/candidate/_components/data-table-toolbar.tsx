"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableViewOptions } from "./data-table-view-options"
import { WorkflowLine } from "@/types/hiring"
import { source } from "../_data/data"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  level: WorkflowLine[]
}

export function DataTableToolbar<TData>({
  table,
  level
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search Candidate"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* <Button onClick={()=>{
          {table.getAllColumns().forEach(column => {
            
          })} 
        }}>
          h
        </Button>  */}
        {table.getColumn("latestTransition_transitionName") && (
          <DataTableFacetedFilter
            column={table.getColumn("latestTransition_transitionName")}
            title="Level"
            options={
              level.map((x) => {
                return { label: x.transitionName, value: x.transitionName };
              })
            }
          />
        )}
        {table.getColumn("source") && (
          <DataTableFacetedFilter
            column={table.getColumn("source")}
            title="Source"
            options={source}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
