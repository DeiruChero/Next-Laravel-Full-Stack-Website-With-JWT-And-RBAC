'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import DataTable from '@/app/_components/DataTable';
import { useRouter } from 'next/navigation';

export default function PackSizeDelete() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([{ id: 'PackSizeID', desc: true }]);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  useEffect(() => {
    api.get('packsize-data', {
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
    { accessorKey: 'PackSizeName', header: 'Pack Size Name' },
    { accessorKey: 'Facter', header: 'Facter' },
    {
      accessorKey: 'Delete',
      header: 'Delete',
      cell: ({ row }) => (
        <button
          className="btn btn-danger btn-sm"
          onClick={() => router.push(`/Dashboard/packsizedelete/packsizedeleteconfirm/${row.original.PackSizeID}`)}
        >
          Delete
        </button>
      ),
    },
  ], [router]);

  return (
    <DataTable
      columns={columns}
      data={data}
      title="Pack Size Table"
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
