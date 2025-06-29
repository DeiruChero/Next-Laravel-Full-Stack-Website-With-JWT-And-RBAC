'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import DataTable from '@/app/_components/DataTable';

export default function UserViewPage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([{ id: 'UserID', desc: true }]);

  useEffect(() => {
    api.get('users', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
        search: globalFilter,
        sortField: sorting[0]?.id || '',
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
      },
    })
      .then(res => {
        setData(res.data.data || []);
        setTotal(res.data.total || res.data.length || 0);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
      });
  }, [pageIndex, pageSize, globalFilter, sorting]);

  const columns = useMemo(() => [
    { accessorKey: 'DisplayName', header: 'Name' },
    { accessorKey: 'Mobile', header: 'Mobile No.' },
    { accessorKey: 'Email', header: 'Email' },
    {
      accessorKey: 'Status',
      header: 'Status',
      cell: ({ row }) => (
        row.original.Status === 'Active'
          ? <span style={{ color: 'green' }}>🟢 Active</span>
          : <span style={{ color: 'red' }}>🔴 Inactive</span>
      ),
    },
    { accessorKey: 'BranchName', header: 'Branch' },
    { accessorKey: 'RoleName', header: 'Role' },
  ], []);

  return (
    <DataTable
      columns={columns}
      data={data}
      title="Users Table"
      pageIndex={pageIndex}
      pageSize={pageSize}
      total={total}
      onPageChange={setPageIndex}
      globalFilter={globalFilter}
      onGlobalFilterChange={setGlobalFilter}
      sorting={sorting}
      onSortingChange={setSorting}
      onPageSizeChange={setPageSize}
    />
  );
}
