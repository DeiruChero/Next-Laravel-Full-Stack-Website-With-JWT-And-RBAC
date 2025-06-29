import axios from 'axios';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.status === 'branch_required'
    ) {
      try {
        const branchResponse = await api.get('/showallbranches');
        const branches = branchResponse.data;

        const inputOptions = {};
        branches.forEach(branch => {
          inputOptions[branch.BranchID] = branch.BranchName;
        });

        const result = await Swal.fire({
          title: 'Select Your Branch',
          input: 'select',
          inputOptions,
          inputPlaceholder: 'Choose your branch',
          showCancelButton: true,
          confirmButtonText: 'Select',
        });

        if (result.isConfirmed) {
          const selectedBranchID = result.value;
          const selectedBranch = branches.find(b => b.BranchID == selectedBranchID);

          Swal.fire({
            icon: 'success',
            title: 'Branch Selected',
            text: `You selected: ${selectedBranch.BranchName} (BranchID: ${selectedBranch.BranchID})`
          }).then(() => {
            window.location.reload();
          })

          localStorage.setItem('branch_id', selectedBranchID);
        }
      } catch (branchError) {
        console.error('Failed to fetch branches:', branchError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
