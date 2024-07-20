"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableViewOptions } from "./data-table-view-options"
import { employeeStatus } from "../_data/data"
import { Address, Department } from "@/types/profile"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  department: Department[]
  address: Address[]
}

export function DataTableToolbar<TData>({
  table,
  department,
  address
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search Employee"
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
        {table.getColumn("department_name") && (
          <DataTableFacetedFilter
            column={table.getColumn("department_name")}
            title="Department"
            options={
              department.map((x) => {
                return { label: x.name, value: x.name };
              })
            }
          />
        )}
          {table.getColumn("address_label") && (
          <DataTableFacetedFilter
            column={table.getColumn("address_label")}
            title="Office"
            options={
              address.map((x) => {
                return { label: x.label, value: x.id };
              })
            }
          />
        )}
        {table.getColumn("employeeStatus") && (
          <DataTableFacetedFilter
            column={table.getColumn("employeeStatus")}
            title="Status"
            options={employeeStatus}
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
