"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import DataTable from '@/app/_components/DataTable';

export default function UserViewPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([{ id: 'UserID', desc: true }]);
  const router = useRouter();

  useEffect(() => {
    api.get('users', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
        search: globalFilter,
        sortField: sorting[0]?.id || '',
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
      },
    }).then(res => {
      setUsers(res.data.data);
      setTotal(res.data.total);
    }).catch(err => {
      console.error('Error fetching users:', err);
    });
  }, [pageIndex, pageSize, globalFilter, sorting]);

  const handleDelete = (UserID) => {
    router.push(`/Dashboard/userdelete/userdeleteconfirm/${UserID}`);
  };

  const columns = useMemo(() => [
    { accessorKey: 'DisplayName', header: 'Name' },
    { accessorKey: 'Mobile', header: 'Mobile No.' },
    { accessorKey: 'Email', header: 'Email' },
    {
      accessorKey: 'Status',
      header: 'Status',
      cell: ({ row }) => row.original.Status === 'Active' ? '🟢' : '🔴'
    },
    { accessorKey: 'BranchName', header: 'Branch' },
    { accessorKey: 'RoleName', header: 'Role' },
    {
      accessorKey: 'delete',
      header: 'Delete',
      cell: ({ row }) => (
        <button
          className="btn btn-danger btn-sm"
          onClick={() => handleDelete(row.original.UserID)}
        >
          Delete
        </button>
      ),
    },
  ], []);

  return (
    <DataTable
      columns={columns}
      data={users}
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
