'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import DataTable from '@/app/_components/DataTable';
import { useRouter } from 'next/navigation';

export default function StateEdit() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([{ id: 'StateID', desc: true }]);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  useEffect(() => {
    api.get('state-data', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
        search: globalFilter,
        sortField: sorting[0]?.id || '',
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
      },
    }).then(res => {
      setData(res.data.data);
      setTotal(res.data.total);
    });
  }, [pageIndex, globalFilter, sorting, pageSize]);

  const columns = useMemo(() => [
    { accessorKey: 'StateName', header: 'State Name' },
    { accessorKey: 'CountryName', header: 'Country Name' },
    {
      accessorKey: 'Edit',
      header: 'Edit',
      cell: ({ row }) => (
        <button
          className="btn btn-warning btn-sm"
          onClick={() => router.push(`/Dashboard/stateedit/stateeditconfirm/${row.original.StateID}`)}
        >
          Edit
        </button>
      ),
    },
  ], [router]);

  return (
    <DataTable
      columns={columns}
      data={data}
      title="State Table"
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
