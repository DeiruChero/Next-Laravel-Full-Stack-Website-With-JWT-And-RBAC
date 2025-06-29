// 'use client';

// import { useEffect, useState, useMemo } from 'react';
// import api from '@/lib/axios';
// import DataTable from '@/app/_components/DataTable';
// import OrderModal from '@/app/_Shared/OrderModel';
// import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

// export default function OrderView() {
//     const [data, setData] = useState([]);
//     const [total, setTotal] = useState(0);
//     const [pageIndex, setPageIndex] = useState(0);
//     const [globalFilter, setGlobalFilter] = useState('');
//     const [sorting, setSorting] = useState([{ id: 'OrderID', desc: true }]);
//     const [pageSize, setPageSize] = useState(10);
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [showModal, setShowModal] = useState(false);

//     const handleViewClick = (order) => {
//         setSelectedOrder(order);
//         setShowModal(true);
//     };

//     const handleCloseModal = () => {
//         setShowModal(false);
//     };

//     useEffect(() => {
//         const branchId = localStorage.getItem('branch_id');
//         api.get('order-data', {
//             params: {
//                 page: pageIndex + 1,
//                 limit: pageSize,
//                 search: globalFilter,
//                 sortField: sorting[0]?.id || '',
//                 sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
//                 branchid: branchId ? Number(branchId) : 0
//             },
//         }).then(res => {
//             setData(res.data.data);
//             setTotal(res.data.total);
//         });
//     }, [pageIndex, globalFilter, sorting, pageSize]);

//     useEffect(() => {
//         return () => {
//             localStorage.removeItem('branch_id');
//             localStorage.removeItem('branch_id_tried');
//         };
//     }, []);

//     const columns = useMemo(() => [
//         { accessorKey: 'OrderNo', header: 'O. No' },
//         { accessorKey: 'OrderDate', header: 'O. Date' },
//         {
//             accessorKey: 'OrderTime',
//             header: 'O. Time',
//             cell: info => info.getValue() ?? 'NULL'
//         },
//         { accessorKey: 'ClientName', header: 'Client' },
//         { accessorKey: 'UserType', header: 'O. From' },
//         {
//             accessorKey: 'Branch',
//             header: 'Branch',
//             cell: info => info.getValue() ?? 'NULL'
//         },
//         { accessorKey: 'OrderStatus', header: 'O. Status' },
//         { accessorKey: 'OrderMode', header: 'O. Mode' },
//         { accessorKey: 'PaymentMode', header: 'P. Mode' },
//         {
//             accessorKey: 'PaymentStatus',
//             header: 'P. Status',
//             cell: info => {
//                 const value = info.getValue();
//                 return value === 'Paid' ? (
//                     <span className="text-success d-flex align-items-center gap-1">
//                         <FaThumbsUp /> Paid
//                     </span>
//                 ) : (
//                     <span className="text-danger d-flex align-items-center gap-1">
//                         <FaThumbsDown /> UnPaid
//                     </span>
//                 );
//             }
//         },
//         {
//             accessorKey: 'TotalAmount',
//             header: 'T. Amount',
//             cell: info => `₹${Number(info.getValue()).toLocaleString('en-IN')}`
//         },
//         {
//             accessorKey: 'View',
//             header: 'View',
//             cell: ({ row }) => (
//                 <button
//                     onClick={() => handleViewClick(row.original)}
//                     className="btn btn-primary btn-sm"
//                 >
//                     View
//                 </button>
//             )
//         }
//     ], []);

//     return (
//         <div className="container mt-4">
//             <DataTable
//                 columns={columns}
//                 data={data}
//                 title="Order Table"
//                 pageIndex={pageIndex}
//                 pageSize={pageSize}
//                 total={total}
//                 onPageChange={setPageIndex}
//                 globalFilter={globalFilter}
//                 onGlobalFilterChange={setGlobalFilter}
//                 sorting={sorting}
//                 onSortingChange={setSorting}
//                 onPageSizeChange={setPageSize}
//             />

//             <OrderModal show={showModal} onClose={handleCloseModal} orderId={selectedOrder?.OrderID} />
//         </div>
//     );
// }



'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import DataTable from '@/app/_components/DataTable';
import OrderModal from '@/app/_Shared/OrderModel';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

export default function OrderView() {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([{ id: 'OrderID', desc: true }]);
    const [pageSize, setPageSize] = useState(10);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(''); // '' = all

    // 📦 Fetch order data
    useEffect(() => {
        api.get('order-data', {
            params: {
                page: pageIndex + 1,
                limit: pageSize,
                search: globalFilter,
                sortField: sorting[0]?.id || '',
                sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
                branchid: selectedBranch ? Number(selectedBranch) : undefined,
            },
        }).then(res => {
            setData(res.data.data);
            setTotal(res.data.total);
        });
    }, [pageIndex, globalFilter, sorting, pageSize, selectedBranch]);

    const handleViewClick = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const columns = useMemo(() => [
        { accessorKey: 'OrderNo', header: 'O. No' },
        { accessorKey: 'OrderDate', header: 'O. Date' },
        {
            accessorKey: 'OrderTime',
            header: 'O. Time',
            cell: info => info.getValue() ?? 'NULL'
        },
        { accessorKey: 'ClientName', header: 'Client' },
        { accessorKey: 'UserType', header: 'O. From' },
        {
            accessorKey: 'Branch',
            header: 'Branch',
            cell: info => info.getValue() ?? 'NULL'
        },
        { accessorKey: 'OrderStatus', header: 'O. Status' },
        { accessorKey: 'OrderMode', header: 'O. Mode' },
        { accessorKey: 'PaymentMode', header: 'P. Mode' },
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
                        <FaThumbsDown /> UnPaid
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
    ], []);

    return (
        <div className="container mt-4">
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

                // 🆕 Tabs for Branch Filter
                onBranchChange={(branchId) => {
                    setSelectedBranch(branchId);
                    setPageIndex(0); // Reset page when branch changes
                }}
            />

            <OrderModal show={showModal} onClose={handleCloseModal} orderId={selectedOrder?.OrderID} />
        </div>
    );
}
