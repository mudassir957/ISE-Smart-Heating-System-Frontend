import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import * as adminApi from "../api/admin";
import type { User } from "../api/auth";
import Page from "../components/Page";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export default function AdminPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  async function loadUsers() {
    if (!token) return;
    setLoading(true);
    setErr(null);
    try {
      const list = await adminApi.listUsers(token);
      setUsers(list);
    } catch (e: any) {
      setErr(e.message ?? "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function changeRole(userId: number, role: "user" | "admin") {
    if (!token) return;
    setBusyId(userId);
    setErr(null);
    try {
      const updated = await adminApi.setUserRole(token, userId, role);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (e: any) {
      setErr(e.message ?? "Failed to update role");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Page title="Admin" subtitle="Manage users and system access">
      {err && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {err}
        </div>
      )}

      <div className="mb-4 flex items-center gap-2">
        <Button variant="outline" onClick={loadUsers} disabled={loading}>
          Refresh
        </Button>
        {loading && <span className="text-sm text-muted-foreground">Loading…</span>}
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-[140px]">Role</TableHead>
                  <TableHead className="w-[120px]">Active</TableHead>
                  <TableHead className="w-[220px]">Change role</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.id}</TableCell>
                    <TableCell>{u.email}</TableCell>

                    <TableCell>
                      <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant={u.is_active ? "outline" : "destructive"}>
                        {u.is_active ? "Yes" : "No"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={u.role}
                          onValueChange={(v) => changeRole(u.id, v as any)}
                          disabled={busyId === u.id}
                        >
                          <SelectTrigger className="w-[160px] rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">user</SelectItem>
                            <SelectItem value="admin">admin</SelectItem>
                          </SelectContent>
                        </Select>
                        {busyId === u.id && (
                          <span className="text-xs text-muted-foreground">Updating…</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {!loading && users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Security note</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Role changes take effect immediately. In a production system, you’d also add audit logs and possibly 2FA for admin actions.
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Next admin controls</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            If you want, we can add backend endpoints to pause/resume the sensor generator and change sampling interval, then wire the controls here.
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}