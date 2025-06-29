
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

export default function DataTable({
  columns,
  data,
  title,
  pageIndex,
  pageSize,
  total,
  onPageChange,
  globalFilter,
  onGlobalFilterChange,
  sorting,
  onSortingChange,
  onPageSizeChange,
  onBranchChange = () => { },
}) {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const [localReady, setLocalReady] = useState(false);

    useEffect(() => {
    api.get('/userrole').then(res => {
      const role = res.data.role || [];
      const isSuper = role.some(r => r.RoleName === 'Super Admin');
      setIsSuperadmin(isSuper);

      if (isSuper) {
        api.get('/getbranches').then(branchRes => {
          const branchTabs = [{ label: 'All Branches', value: '' }, ...branchRes.data.map(b => ({
            label: b.ShortName || b.BranchName,
            value: b.BranchID.toString(),
          }))];
          setTabs(branchTabs);
          setActiveTab('');
        });
      }
    }).catch(err => {
      console.error('Failed to fetch user info', err);
    });
  }, []);


  useEffect(() => {
    if (isSuperadmin) {
      onBranchChange(activeTab);
    }
  }, [activeTab]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    pageCount: Math.ceil(total / pageSize),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange,
    onGlobalFilterChange,
  });

  return (
    <div className="container mt-5">
      {isSuperadmin && tabs.length > 0 && (
        <ul className="nav nav-tabs mb-3">
          {tabs.map(tab => (
            <li className="nav-item" key={tab.value}>
              <button
                className={`nav-link ${activeTab === tab.value ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.value)}
                type="button"
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{title}</h2>

        <div className="d-flex align-items-center gap-3">
          <input
            type="text"
            className="form-control"
            style={{ width: '200px' }}
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => onGlobalFilterChange(e.target.value)}
          />

          <select
            className="form-select"
            style={{ width: '100px' }}
            value={pageSize}
            onChange={(e) => {
              const val = Number(e.target.value);
              onPageSizeChange(val);
              onPageChange(0);
            }}
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} rows
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="table table-striped table-hover shadow">
        <thead className="table-dark">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: 'pointer' }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === 'asc'
                    ? ' 🔼'
                    : header.column.getIsSorted() === 'desc'
                      ? ' 🔽'
                      : ' ⏺️'}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
        <div>
          Page {pageIndex + 1} of {Math.ceil(total / pageSize)}
        </div>

        <div className="d-flex align-items-center mt-2 mt-md-0">
          <button
            className="btn btn-sm btn-secondary me-2"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
          >
            Previous
          </button>

          {getPageButtons(pageIndex, total, pageSize, onPageChange)}

          <button
            className="btn btn-sm btn-primary ms-2"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={(pageIndex + 1) * pageSize >= total}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function getPageButtons(current, totalItems, pageSize, onPageChange) {
  const pageCount = Math.ceil(totalItems / pageSize);
  const range = [];
  const visibleRange = 2;

  const addButton = (page) => (
    <button
      key={page}
      className={`btn btn-sm me-1 ${current === page ? 'btn-warning' : 'btn-outline-secondary'}`}
      onClick={() => onPageChange(page)}
    >
      {page + 1}
    </button>
  );

  range.push(addButton(0));

  if (current > 3) {
    range.push(<span key="start-dots" className="mx-2">...</span>);
  }

  for (let i = Math.max(1, current - visibleRange); i <= Math.min(pageCount - 2, current + visibleRange); i++) {
    if (i !== 0 && i !== pageCount - 1) {
      range.push(addButton(i));
    }
  }

  if (current < pageCount - 4) {
    range.push(<span key="end-dots" className="mx-2">...</span>);
  }

  if (pageCount > 1) {
    range.push(addButton(pageCount - 1));
  }

  return range;
}
