import React, { useEffect, useState } from "react";
import defaultAxios from "../../../utils/DefaultAxios";
import FullPageLoader from "../../../components/common/FullPageLoader";

interface AuditProps {
  type: string;
}

interface AuditData {
  created_at: string;
  user: string;
  action: string;
  note: string;
}

interface Meta {
  current_page: number;
  last_page: number;
}

function Audit({ type }: AuditProps) {
  const [audit, setAudit] = useState<AuditData[]>([]);
  const [metaAudits, setMetaAudits] = useState<Meta>({
    current_page: 1,
    last_page: 1,
  });
  const [loading, setLoading] = useState(false);

  const getAudits = (page = 1) => {
    setLoading(true);
    defaultAxios
      .get("http://127.0.0.1:8000/api/v1/audits", {
        params: { page, type },
      })
      .then((res) => {
        setAudit(res.data.data);
        setMetaAudits(res.data.meta);
      })
      .catch((err) => {
        console.error("Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAudits();
  }, [type]);

  return (
    <div>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white p-4 shadow text-base-100 my-20">
        <h1 className="text-3xl font-bold pb-5">Note and History</h1>

        {loading ? (
          <FullPageLoader fullscreen={false} />
        ) : audit.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No audit history found.
          </div>
        ) : (
          <>
            <table className="table">
              <thead className="bg-warning text-white">
                <tr>
                  <th></th>
                  <th>Date</th>
                  <th>Action</th>
                  <th>User</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {audit.map((item, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{new Date(item.created_at).toLocaleString()}</td>
                    <td>{item.action}</td>
                    <td>{item.user}</td>
                    <td>{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-4 gap-2">
              {[...Array(metaAudits.last_page)].map((_, index) => {
                const page = index + 1;
                const isActive = metaAudits.current_page === page;

                return (
                  <button
                    key={page}
                    onClick={() => getAudits(page)}
                    className={`px-3 py-1 rounded ${
                      isActive ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Audit;
