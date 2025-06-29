'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import DataTable from '@/app/_components/DataTable';
import { useRouter } from 'next/navigation';

export default function RuleEdit() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([{ id: 'RulesID', desc: true }]);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  useEffect(() => {
    api.get('rules-data', {
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
    { accessorKey: 'RulesName', header: 'Rule Name' },
    { accessorKey: 'RulesGroup', header: 'Group Name' },
    { accessorKey: 'Link', header: 'Link' },
    {
      accessorKey: 'Edit',
      header: 'Edit',
      cell: ({ row }) => (
        <button
          className="btn btn-warning btn-sm"
          onClick={() => router.push(`/Dashboard/rulesedit/ruleseditconfirm/${row.original.RulesID}`)}
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
      title="Rules Table"
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
