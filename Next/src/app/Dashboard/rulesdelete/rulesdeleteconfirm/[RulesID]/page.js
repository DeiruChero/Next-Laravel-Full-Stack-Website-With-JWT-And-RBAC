'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function RuleDelete({ params }) {
  const RulesID = params.RulesID;
  const router = useRouter();

  const [rule, setRule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchRule = async () => {
      try {
        const res = await api.get(`rules-show/${RulesID}`);
        setRule(res.data);
      } catch (err) {
        console.error('Error fetching rule:', err);
        setErrorMsg('Failed to fetch rule data.');
      } finally {
        setLoading(false);
      }
    };

    if (RulesID) fetchRule();
  }, [RulesID]);

  const handleDelete = async () => {
    try {
      await api.delete(`rules-delete/${RulesID}`);
      window.location.href = '/Dashboard/rulesdelete';
    } catch (err) {
      console.error('Error deleting rule:', err);
      setErrorMsg('Failed to delete the rule.');
    }
  };

  const handleCancel = () => {
    router.push('/Dashboard/rulesdelete');
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

  if (errorMsg) {
    return <div className="alert alert-danger mt-5 text-center">{errorMsg}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="mb-3 text-danger text-center">Are you sure you want to delete this rule?</h3>
        <ul className="list-group mb-4">
          <li className="list-group-item"><strong>ID:</strong> {rule.RulesID}</li>
          <li className="list-group-item"><strong>Rule Name:</strong> {rule.RulesName}</li>
          <li className="list-group-item"><strong>Group:</strong> {rule.RulesGroup}</li>
          <li className="list-group-item"><strong>Link:</strong> {rule.Link}</li>
        </ul>

        <div className="d-flex justify-content-center gap-3">
          <button onClick={handleDelete} className="btn btn-danger">Delete</button>
          <button onClick={handleCancel} className="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
}
