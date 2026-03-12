"use client"
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

// as the admins, they will need to manage all owner accounts and also their organisaionts
export default function AdminPage() {
  const [ownerAccount, setOwnerAccount] = useState()
  useEffect(async () => {
    const { data: ownerAccount, error } = await authClient.admin.listUsers({
      query: {
        searchValue: "owner",
        searchField: "role",
      }
    })
  }, [])
  return (
    <div>
      <h2>Admin Dashboard</h2>
      {/*Fetching all owner accounts*/}
      <div>
        <h3>Owner Accounts</h3>
        <ul>
          <li>Owner Name</li>
        </ul>
      </div>
    </div>
  );
}