'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import DataTable from '@/app/_components/DataTable';

export default function GroupView() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([{ id: 'GroupID', desc: true }]);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    api.get('group-data', {
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
    { accessorKey: 'GroupName', header: 'Product Group Name' },
  ], []);

  return (
    <DataTable
      columns={columns}
      data={data}
      title="Product Group Table"
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
