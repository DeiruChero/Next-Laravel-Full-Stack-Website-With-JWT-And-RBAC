'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function RoleEdit({ params }) {
  const RoleID = params.RoleID;
  const router = useRouter();

  const [roleName, setRoleName] = useState('');
  const [remark, setRemark] = useState('');
  const [rulesList, setRulesList] = useState([]);
  const [groupedRules, setGroupedRules] = useState({});
  const [selectedRules, setSelectedRules] = useState([]);
  const [openGroups, setOpenGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!RoleID) return;

    const fetchData = async () => {
      try {
        const [resRole, resRules] = await Promise.all([
          api.get(`roles-show/${RoleID}`),
          api.get('rules-data'),
        ]);

        const role = resRole.data.role;
        const assignedRuleIds = resRole.data.rules || [];
        const rules = resRules.data.data;

        setRoleName(role.RoleName || '');
        setRemark(role.Remark || '');
        setRulesList(rules || []);

        const roleRules = assignedRuleIds.map(Number);
        setSelectedRules(roleRules);

        const grouped = rules.reduce((acc, rule) => {
          acc[rule.RulesGroup] = acc[rule.RulesGroup] || [];
          acc[rule.RulesGroup].push(rule);
          return acc;
        }, {});
        setGroupedRules(grouped);

        const toggles = Object.keys(grouped).reduce((acc, group) => {
          acc[group] = true;
          return acc;
        }, {});
        setOpenGroups(toggles);

        setLoading(false);

      } catch (err) {
        setError('Failed to load data.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [RoleID]);

  const handleCheckboxChange = (id) => {
    setSelectedRules((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const handleGroupToggle = (groupName) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const handleExpandCollapseAll = (expand) => {
    const newState = {};
    Object.keys(groupedRules).forEach((group) => {
      newState[group] = expand;
    });
    setOpenGroups(newState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`roles-update/${RoleID}`, {
        RoleName: roleName,
        Remark: remark,
        RulesID: selectedRules,
      });
      router.push('/Dashboard/roleedit');
    } catch (err) {
      setError('Failed to update role.');
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/Dashboard/roleedit');
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Edit Role</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
        <div className="mb-3">
          <label className="form-label fw-bold">Role Name</label>
          <input
            type="text"
            className="form-control"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Remark</label>
          <textarea
            className="form-control"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows={3}
          />
        </div>

        <div className="d-flex justify-content-end mb-2">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm me-2"
            onClick={() => handleExpandCollapseAll(true)}
          >
            Expand All
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => handleExpandCollapseAll(false)}
          >
            Collapse All
          </button>
        </div>

        <div className="mb-4 p-3 shadow-sm rounded bg-light">
          <h5 className="mb-3">Assign Rules</h5>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {Object.keys(groupedRules).map((groupName) => (
              <div key={groupName} className="card mb-3">
                <div
                  className="card-header d-flex justify-content-between align-items-center"
                  style={{ cursor: 'pointer', backgroundColor: '#e2e6ea' }}
                  onClick={() => handleGroupToggle(groupName)}
                >
                  <span className="fw-bold text-primary">
                    {groupName}
                    {' '}
                    <span className="badge bg-primary ms-2">
                      {
                        groupedRules[groupName].filter((rule) =>
                          selectedRules.includes(rule.RulesID)
                        ).length
                      }
                    </span>
                  </span>
                  <span>{openGroups[groupName] ? '▲' : '▼'}</span>
                </div>

                {openGroups[groupName] && (
                  <div className="card-body bg-white">
                    {groupedRules[groupName].map((rule) => (
                      <div className="form-check mb-2" key={rule.RulesID}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`rule-${rule.RulesID}`}
                          checked={selectedRules.includes(rule.RulesID)}
                          onChange={() => handleCheckboxChange(rule.RulesID)}
                          style={{ width: '18px', height: '18px' }}
                        />
                        <label
                          className="form-check-label ms-2"
                          htmlFor={`rule-${rule.RulesID}`}
                          style={{
                            fontWeight: selectedRules.includes(rule.RulesID)
                              ? 'bold'
                              : 'normal',
                            color: selectedRules.includes(rule.RulesID)
                              ? '#0d6efd'
                              : '#212529',
                          }}
                        >
                          {rule.RulesName}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-success w-100 mb-4" disabled={loading}>
          {loading && (
            <span
              className="spinner-border spinner-border-sm text-light"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          {loading ? ' Updating...' : 'Update Role'}
        </button>
        <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}
