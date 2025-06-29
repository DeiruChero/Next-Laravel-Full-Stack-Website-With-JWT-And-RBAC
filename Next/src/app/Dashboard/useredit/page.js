'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import DataTable from '@/app/_components/DataTable';
import { useRouter } from 'next/navigation';

export default function UserEdit() {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([{ id: 'UserID', desc: true }]);
    const [pageSize, setPageSize] = useState(10);
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
            setData(res.data.data);
            setTotal(res.data.total);
        });
    }, [pageIndex, globalFilter, sorting, pageSize]);

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
        {
            accessorKey: 'Edit',
            header: 'Edit',
            cell: ({ row }) => (
                <button
                    className="btn btn-warning btn-sm"
                    onClick={() => router.push(`/Dashboard/useredit/usereditconfirm/${row.original.UserID}`)}
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
            title="User Table"
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
