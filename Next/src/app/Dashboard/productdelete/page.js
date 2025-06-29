'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import DataTable from '@/app/_components/DataTable';

export default function ProductsView() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([{ id: 'ProductID', desc: true }]);

  const router = useRouter();

  useEffect(() => {
    api.get('product-data', {
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
  }, [pageIndex, pageSize, globalFilter, sorting]);

  const columns = useMemo(() => [
    { accessorKey: 'ProductName', header: 'Product Name' },
    { accessorKey: 'ProductUnicodeName', header: 'Unicode Name' },
    { accessorKey: 'ItemCodeBlinkit', header: 'Blinkit Code' },
    { accessorKey: 'ItemCodeSwiggy', header: 'Swiggy Code' },
    { accessorKey: 'ItemCodeRelience', header: 'Reliance Code' },
    { accessorKey: 'UnitName', header: 'Unit' },
    { accessorKey: 'CategoryName', header: 'Category' },
    { accessorKey: 'PackSizeName', header: 'Pack Size' },
    {
      accessorKey: 'Delete',
      header: 'Delete',
      cell: ({ row }) => (
        <button
          className="btn btn-danger btn-sm"
          onClick={() => router.push(`/Dashboard/productdelete/productdeleteconfirm/${row.original.ProductID}`)}
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
      title="Products Table"
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
