'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import DataTable from '@/app/_components/DataTable';

export default function PackingMaterialView() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([{ id: 'PackingMaterialID', desc: true }]);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    api.get('packingmaterial-data', {
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
    { accessorKey: 'PackingMaterialName', header: 'Packing Material Name' },
    { accessorKey: 'Weight', header: 'Weight (Kg)' },
    { accessorKey: 'PcsPerUnit', header: 'Pcs Per Unit' },
    { accessorKey: 'PackagingCost', header: 'Packaging Cost (Rs.)' },
  ], []);

  return (
    <DataTable
      columns={columns}
      data={data}
      title="Packaging Material Table"
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
