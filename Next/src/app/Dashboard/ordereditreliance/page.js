'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import DataTable from '@/app/_components/DataTable';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function OrderEditRelianceView() {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([{ id: 'OrderID', desc: true }]);
    const [pageSize, setPageSize] = useState(10);
    const router = useRouter();

    useEffect(() => {
        api.get('ordercancelreliance-data', {
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
        { accessorKey: 'OrderNo', header: 'O. No.' },
        { accessorKey: 'OrderDate', header: 'O. Date' },
        { accessorKey: 'OrderStatus', header: 'O. Status' },
        { accessorKey: 'OrderMode', header: 'O. Mode' },
        { accessorKey: 'PaymentMode', header: 'P. Mode' },
        {
            accessorKey: 'PaymentStatus',
            header: 'P. Status',
            cell: info => {
                const value = info.getValue();
                return value === 'Paid' ? (
                    <span style={{ color: 'green', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaThumbsUp />
                    </span>
                ) : (
                    <span style={{ color: 'red', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaThumbsDown />
                    </span>
                );
            }
        },
        {
            accessorKey: 'Edit',
            header: 'Edit',
            cell: ({ row }) => (
                <button
                    className="btn btn-warning btn-sm"
                    onClick={() => router.push(`/Dashboard/ordereditreliance/ordereditrelianceconfirm/${row.original.OrderID}`)}
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
            title="Order Edit Reliance"
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
