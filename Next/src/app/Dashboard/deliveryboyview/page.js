'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import DataTable from '@/app/_components/DataTable';

export default function DeliveryBoyView() {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([{ id: 'EmployeeID', desc: true }]);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        api.get('deliveryboy-data', {
            params: {
                page: pageIndex + 1,
                limit: pageSize,
                search: globalFilter,
                sortField: sorting[0]?.id || '',
                sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
            },
        }).then(res => {
            const filtered = res.data.data.filter(
                item => item.DesignationName === 'Delivery Boy'
            );
            setData(filtered);
            setTotal(filtered.data.total);
        });
    }, [pageIndex, globalFilter, sorting, pageSize]);

    const columns = useMemo(() => [
        { accessorKey: 'EmployeeName', header: 'Delivery Boy Name' },
        { accessorKey: 'Mobile', header: 'Mobile' },
        { accessorKey: 'Email', header: 'Email' },
    ], []);

    return (
        <DataTable
            columns={columns}
            data={data}
            title="Delivery Boy Table"
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
