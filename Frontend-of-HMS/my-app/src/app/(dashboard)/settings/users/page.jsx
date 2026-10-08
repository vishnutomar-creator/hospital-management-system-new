"use client";

import { useEffect, useState } from "react";
import { userAPI } from "../../../services/api";

export default function SystemUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await userAPI.getUsers();
        if (res.success && Array.isArray(res.data)) {
          setUsers(res.data);
        }
      } catch (err) {
        console.warn("User list API notice:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">System Users</h1>
        <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">Manage registered user accounts and backend access roles</p>
      </div>
      <div className="rounded-2xl border border-[#E5E2D9] bg-white p-6 dark:border-white/10 dark:bg-[#17201D]">
        {loading ? (
          <p className="text-sm text-[#87938E]">Loading users from backend...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-[#87938E]">No active users found.</p>
        ) : (
          <div className="divide-y divide-[#EEECE5] dark:divide-white/10">
            {users.map((u) => (
              <div key={u._id || u.id} className="flex items-center justify-between py-3.5">
                <div>
                  <p className="text-sm font-bold text-[#17201D] dark:text-white">{u.name || "User"}</p>
                  <p className="text-xs text-[#87938E]">{u.email}</p>
                </div>
                <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                  {u.role || "User"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
