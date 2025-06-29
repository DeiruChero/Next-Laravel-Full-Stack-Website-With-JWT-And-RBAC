'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function RulesEdit({ params }) {
  const RulesID = params.RulesID;
  const router = useRouter();

  const [rulesName, setRulesName] = useState('');
  const [rulesGroup, setRulesGroup] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!RulesID) return;

    const fetchRule = async () => {
      try {
        const res = await api.get(`rules-show/${RulesID}`);
        const rule = res.data;

        setRulesName(rule.RulesName || '');
        setRulesGroup(rule.RulesGroup || '');
        setLink(rule.Link || '');
        setLoading(false);
      } catch (err) {
        setError('Failed to load rule data.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchRule();
  }, [RulesID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`rules-update/${RulesID}`, {
        RulesName: rulesName,
        RulesGroup: rulesGroup,
        Link: link
      });
      router.push('/Dashboard/rulesedit');
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.reload();
    } catch (err) {
      setError('Failed to update rule.');
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Edit Rule</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
        <div className="mb-3">
          <label className="form-label fw-bold">Rule Name</label>
          <input
            type="text"
            className="form-control"
            value={rulesName}
            onChange={(e) => setRulesName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Group Name</label>
          <input
            type="text"
            className="form-control"
            value={rulesGroup}
            onChange={(e) => setRulesGroup(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Route / Link</label>
          <input
            type="text"
            className="form-control"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100 mb-4" disabled={loading}>
          {loading && (
            <span
              className="spinner-border spinner-border-sm text-light"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          {loading ? ' Updating...' : 'Update Rule'}
        </button>
        <button type="button" className="btn btn-secondary w-100" onClick={() => router.push('/Dashboard/rulesedit')}>
          Cancel
        </button>
      </form>
    </div>
  );
}
