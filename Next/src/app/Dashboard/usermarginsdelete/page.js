'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import DataTable from '@/app/_components/DataTable';
import { useRouter } from 'next/navigation';

export default function UserMarginsDelete() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([{ id: 'id', desc: true }]);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  useEffect(() => {
    api.get('margin-data', {
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
    { accessorKey: 'UserType', header: 'User Type' },
    { accessorKey: 'MarginPercentage', header: 'Margin Percentage' },
    { accessorKey: 'TransportationCharges', header: 'Transportation Charges' },
    { accessorKey: 'LabourCharges', header: 'Labour Charges' },
    { accessorKey: 'BarcodeCharges', header: 'Barcode Charges' },
    {
      accessorKey: 'Delete',
      header: 'Delete',
      cell: ({ row }) => (
        <button
          className="btn btn-danger btn-sm"
          onClick={() => router.push(`/Dashboard/usermarginsdelete/usermarginsdeleteconfirm/${row.original.UserTypeMarginPercentageID}`)}
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
      title="User Type Margin Table"
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
