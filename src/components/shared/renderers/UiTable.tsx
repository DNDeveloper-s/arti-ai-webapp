import useInView from "@/hooks/useInView";
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SlotsToClasses,
  SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TableSlots,
  Tooltip,
  select,
} from "@nextui-org/react";
import { FetchStatus } from "@tanstack/react-query";
import { popGraphicsState } from "pdf-lib";
import React, { Key, ReactNode, use, useEffect, useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import { IoChevronDown } from "react-icons/io5";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";

interface UiTableProps<T> {
  renderCell?: (item: T, columnKey: Key) => React.ReactNode;
  totalItems: any[];
  initialVisibleColumns?: string[];
  columns: any[];
  pronoun?: string;
  selectedKeys?: Selection;
  setSelectedKeys?: (keys: Selection) => any;
  isLoading?: boolean;
  loadingContent?: ReactNode;
  emptyContent?: ReactNode;
  onAddClick?: () => any;
  onEditClick?: () => any;
  onDeleteClick?: () => any;
  classNames?: SlotsToClasses<TableSlots>;
  fetchStatus: FetchStatus;
  hasMore?: boolean;
  fetchMore?: () => any;
  noTopContent?: boolean;
  selectionMode?: "single" | "multiple" | "none";
}
export default function UiTable<T = any>(props: UiTableProps<T>) {
  const {
    renderCell,
    columns,
    totalItems,
    initialVisibleColumns,
    selectedKeys,
    setSelectedKeys,
    onAddClick,
    onEditClick,
    onDeleteClick,
    fetchStatus,
    fetchMore,
    selectionMode = "multiple",
    noTopContent,
    classNames,
  } = props;
  const [page, setPage] = React.useState(1);
  const [filterValue, setFilterValue] = React.useState("");

  // Code for handling the key change when the fetch status changes
  // Key change is required here because the table component does not always re-render whenever the data is fetched
  // This was needed to ensure that the table re-renders when the data is fetched
  // Specially for the toggle status button
  const [key, setKey] = useState<number>(0);
  const fetchStatusRef = useRef<typeof fetchStatus>(fetchStatus);
  useEffect(() => {
    if (fetchStatusRef.current === "fetching" && fetchStatus === "idle") {
      setKey((prev) => prev + 1);
    }
    fetchStatusRef.current = fetchStatus;
  }, [fetchStatus]);

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // const lastScrollPosRef = useRef(0);
  // const scrollerRef = useRef<HTMLDivElement>(null);
  const { ref: loaderRef, isInView } = useInView();

  useEffect(() => {
    isInView && typeof fetchMore === "function" && fetchMore();
  }, [isInView, fetchMore]);

  const hasSearchFilter = Boolean(filterValue);
  const [visibleColumns, setVisibleColumns] = React.useState(
    initialVisibleColumns ? new Set(initialVisibleColumns) : "all"
  );

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [columns, visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let _filteredItems = [...totalItems];

    if (hasSearchFilter) {
      _filteredItems = _filteredItems.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    // if (
    //   statusFilter !== "all" &&
    //   Array.from(statusFilter).length !== statusOptions.length
    // ) {
    //   _filteredItems = _filteredItems.filter((campaign) =>
    //     Array.from(statusFilter).includes(campaign.status)
    //   );
    // }

    return _filteredItems;
  }, [filterValue, hasSearchFilter, totalItems]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = filteredItems;

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column ?? ""];
      const second = b[sortDescriptor.column ?? ""];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  // useEffect(() => {
  //   if (!scrollerRef.current) return;
  //   const scrollEl = scrollerRef.current;
  //   setTimeout(() => {
  //     console.log("scrollEl - ", scrollEl, lastScrollPosRef.current);
  //     scrollEl.scrollTo(0, lastScrollPosRef.current);
  //   }, 200);

  //   const handleScroll = () => {
  //     lastScrollPosRef.current = scrollEl.scrollTop;
  //   };

  //   scrollEl.addEventListener("scroll", handleScroll);

  //   return () => {
  //     scrollEl.removeEventListener("scroll", handleScroll);
  //   };
  // }, [sortedItems]);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const isSingularSelected = selectedKeys !== "all" && selectedKeys?.size === 1;

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<GoSearch />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            classNames={{
              inputWrapper: "!h-[40px]",
            }}
          />
          <div className="flex gap-3">
            {onEditClick && (
              <Tooltip
                content={
                  isSingularSelected
                    ? "Edit"
                    : "Edit can only be done on one item"
                }
                placement="bottom"
                offset={5}
              >
                <Button
                  isIconOnly
                  color="default"
                  variant="solid"
                  aria-label="Edit"
                  disabled={!isSingularSelected}
                  style={{
                    cursor: isSingularSelected ? "pointer" : "not-allowed",
                    opacity: isSingularSelected ? 1 : 0.45,
                  }}
                  onClick={onEditClick}
                >
                  <MdModeEditOutline className="text-xl" />
                </Button>
              </Tooltip>
            )}
            {onDeleteClick && (
              <Tooltip content="Delete" placement="bottom" offset={5}>
                <Button
                  isIconOnly
                  color="danger"
                  variant="solid"
                  aria-label="Delete"
                  onClick={onDeleteClick}
                >
                  <MdDelete className="text-xl" />
                </Button>
              </Tooltip>
            )}
            <Divider orientation="vertical" className="mx-2" />
            {/* <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<IoChevronDown className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}
            {/* <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}
            <Button
              onClick={onAddClick ?? function () {}}
              color="primary"
              endContent={<FiPlus />}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {totalItems.length}{" "}
            {(props.pronoun ? props.pronoun + "s" : undefined) ?? ""}
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    onEditClick,
    isSingularSelected,
    onDeleteClick,
    onAddClick,
    totalItems.length,
    props.pronoun,
    onRowsPerPageChange,
    onClear,
  ]);

  const pluralPronoun = props.pronoun ? props.pronoun + "s" : "items";

  const handleSelectionChange: (keys: Selection) => any = (keys: Selection) => {
    console.log("keys - ", keys);
    setSelectedKeys && setSelectedKeys(keys as any);
    if (keys instanceof Set) {
      // keys.
    }
  };

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      // bottomContent={bottomContent}
      // bottomContentPlacement="outside"
      bottomContent={
        props.hasMore ? (
          <div className="flex w-full justify-center">
            <Spinner ref={loaderRef} color="white" />
          </div>
        ) : null
      }
      classNames={
        classNames ?? {
          wrapper: "h-[330px]",
          td: "py-1",
        }
      }
      onCellAction={(key: Key) => {
        console.log("action - ", key);
      }}
      // scrollRef={scrollerRef}
      key={key}
      selectedKeys={selectedKeys}
      selectionMode={selectionMode}
      sortDescriptor={sortDescriptor}
      topContent={noTopContent ? null : topContent}
      topContentPlacement="outside"
      onSelectionChange={handleSelectionChange}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        isLoading={props.isLoading}
        loadingContent={props.loadingContent ?? <Spinner label="" />}
        emptyContent={
          props.isLoading
            ? ""
            : props.emptyContent ?? `No ${pluralPronoun} found`
        }
        items={sortedItems}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                {renderCell ? renderCell(item, columnKey) : item[columnKey]}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
