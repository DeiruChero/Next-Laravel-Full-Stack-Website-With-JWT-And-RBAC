'use client';

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/axios";
import DataTable from "@/app/_components/DataTable";
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

export default function DistributorOrderList() {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([{ id: 'OrderID', desc: true }]);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null); // ✅ added this

    const handleViewClick = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);  // ✅ reset selected order
    };

    useEffect(() => {
        setLoading(true);
        api.get('distallorderslist', {
            params: {
                page: pageIndex + 1,
                limit: pageSize,
                search: globalFilter,
                sortField: sorting[0]?.id || '',
                sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
            },
        })
            .then(res => {
                setData(res.data.data);
                setTotal(res.data.total);
            })
            .catch(err => {
                console.error("Error fetching data", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [pageIndex, globalFilter, sorting, pageSize]);

    const columns = useMemo(() => [
        { accessorKey: 'OrderNo', header: 'O. No' },
        { accessorKey: 'OrderDate', header: 'O. Date' },
        {
            accessorKey: 'customer.CustomerName',
            header: 'Client',
            cell: info => info.row.original.customer?.CustomerName ?? 'N/A'
        },
        {
            accessorKey: 'PaymentStatus',
            header: 'P. Status',
            cell: info => {
                const value = info.getValue();
                return value === 'Paid' ? (
                    <span className="text-success d-flex align-items-center gap-1">
                        <FaThumbsUp /> Paid
                    </span>
                ) : (
                    <span className="text-danger d-flex align-items-center gap-1">
                        <FaThumbsDown /> Unpaid
                    </span>
                );
            }
        },
        {
            accessorKey: 'TotalAmount',
            header: 'T. Amount',
            cell: info => `₹${Number(info.getValue()).toLocaleString('en-IN')}`
        },
        {
            accessorKey: 'View',
            header: 'View',
            cell: ({ row }) => (
                <button
                    onClick={() => handleViewClick(row.original)}
                    className="btn btn-primary btn-sm"
                >
                    View
                </button>
            )
        }
    ], [handleViewClick]);

    return (
        <div className="container mt-4 position-relative">
            {loading && (
                <div
                    className="position-absolute top-0 start-0 w-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
                    style={{
                        height: '100%',
                        minHeight: '100%',
                        zIndex: 2000,
                    }}
                >
                    <div className="spinner-border text-primary" role="status" style={{ width: '4rem', height: '4rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            <DataTable
                columns={columns}
                data={data}
                title="Order Table"
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

            {selectedOrder && (
                <Distributor
                    show={showModal}
                    onClose={handleCloseModal}
                    orderId={selectedOrder.OrderID}
                />
            )}
        </div>
    );
}
