"use client";
import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Avatar,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ThemedSnackbar from "../../components/ThemedSnackbar";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/navigation";

interface Contact {
  id: number;
  name: string;
  email: string;
}

async function recordVisit(token: string) {
  await fetch("/api/visit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

async function getLastVisit(): Promise<Date | null> {
  // 可扩展为后端API，当前简化为本地存储
  const last = localStorage.getItem("hru_last_visit");
  return last ? new Date(last) : null;
}

async function notifyIfNeeded(token: string) {
  const lastVisit = await getLastVisit();
  const now = new Date();
  if (!lastVisit || now.getTime() - lastVisit.getTime() > 1 * 60 * 1000) {
    // 超过1分钟未访问，调用提醒API
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  }
}

export default function SettingsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const [success, setSuccess] = useState("");
  const [fetching, setFetching] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("hru_token");
    setHasToken(!!token);
    if (token) {
      setFetching(true);
      recordVisit(token);
      notifyIfNeeded(token);
      fetch("/api/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setContacts(data);
          // 如果有数据，自动填充第一个联系人的 name
          if (data && data.length > 0) {
            setName(data[0].name);
          }
          setFetching(false);
        });
    } else {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (contacts.length > 0 && !name) {
      setName(contacts[0].name);
    }
  }, [contacts]);

  // 合并注册表单逻辑
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/anon-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, contactEmail: email }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem("hru_token", data.token);
      setHasToken(true);
      setSnackbarMsg("注册成功！");
      setSnackbarOpen(true);
      fetch("/api/contacts", {
        headers: { Authorization: `Bearer ${data.token}` },
      })
        .then((res) => res.json())
        .then(setContacts);
      setName("");
      setEmail("");
    } else {
      setSnackbarMsg(data.error || "注册失败");
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const addContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("hru_token");
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, token }),
    });
    const newContact = await res.json();
    if (res.ok && !newContact.error) {
      setContacts([...contacts, newContact]);
      setSnackbarMsg("添加成功！");
      setSnackbarOpen(true);
      setName("");
      setEmail("");
    } else {
      setError(newContact.error || "添加失败");
    }
    setLoading(false);
  };

  const handleEdit = (contact: Contact) => {
    setEditId(contact.id);
    setName(contact.name);
    setEmail(contact.email);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setLoading(true);
    setError("");
    const token = localStorage.getItem("hru_token");
    const res = await fetch("/api/contacts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: editId, name, email, token }),
    });
    const updated = await res.json();
    if (res.ok && !updated.error) {
      setContacts(contacts.map((c) => (c.id === updated.id ? updated : c)));
      setSnackbarMsg("修改成功！");
      setSnackbarOpen(true);
      setEditId(null);
      setName("");
      setEmail("");
    } else {
      setError(updated.error || "修改失败");
    }
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setName("");
    setEmail("");
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setLoading(true);
    setError("");
    const token = localStorage.getItem("hru_token");
    const res = await fetch(`/api/contacts?id=${deleteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    if (res.ok && result.ok) {
      setContacts(contacts.filter((c) => c.id !== deleteId));
      setSnackbarMsg("删除成功！");
      setSnackbarOpen(true);
      setDeleteOpen(false);
    } else {
      setError(result.error || "删除失败");
    }
    setLoading(false);
  };

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  if (fetching) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        sx={{
          background: "linear-gradient(135deg, #4FC3F7 0%, #81C784 100%)",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      minHeight="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "linear-gradient(135deg, #4FC3F7 0%, #81C784 100%)",
        transition: "background 0.5s",
      }}
      p={2}
    >
      <Stack alignItems="center" spacing={2} mb={2}>
        <Avatar sx={{ bgcolor: "#fff", width: 64, height: 64, boxShadow: 2 }}>
          <ShieldIcon color="primary" sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography
          variant="h5"
          fontWeight={700}
          color="#fff"
          letterSpacing={2}
        >
          HRU 紧急联系人设置
        </Typography>
        <Typography variant="subtitle2" color="#fff" fontWeight={400}>
          守护亲友安全，每一天
        </Typography>
        {/* 返回首页按钮 */}
        <Button
          startIcon={<HomeIcon />}
          variant="outlined"
          color="primary"
          sx={{
            borderRadius: 3,
            fontWeight: 600,
            mt: 1,
            bgcolor: "rgba(255,255,255,0.15)",
            color: "#fff",
            borderColor: "#fff",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.25)",
              borderColor: "#B2EBF2",
            },
          }}
          onClick={() => router.push("/")}
        >
          返回首页
        </Button>
      </Stack>
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 4,
          boxShadow: 4,
          bgcolor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(2px)",
        }}
      >
        <CardContent>
          {!hasToken ? (
            <>
              <Typography variant="h6" fontWeight={700} mb={2}>
                设置本人信息
              </Typography>
              <form onSubmit={handleRegister}>
                <TextField
                  label="我的称呼（紧急联系人收到提醒时看到的名字）"
                  placeholder="如：小明、王磊、妈妈"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="紧急联系人邮箱"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{ mt: 2, borderRadius: 3, fontWeight: 600 }}
                >
                  {loading ? "提交中..." : "提交"}
                </Button>
              </form>
              {/* 注册成功/失败提示已统一用顶部Snackbar，不再用Alert */}
            </>
          ) : (
            <>
              <Typography variant="h6" fontWeight={700} mb={2}>
                紧急联系人管理
              </Typography>
              <form onSubmit={editId ? handleEditSave : addContact}>
                <TextField
                  label="我的称呼（紧急联系人收到提醒时看到的名字）"
                  placeholder="如：小明、王磊、妈妈"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="紧急联系人邮箱"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
                {editId ? (
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        borderRadius: 3,
                        fontWeight: 600,
                        flex: 1,
                        background:
                          "linear-gradient(90deg, #38B2AC 0%, #388E3C 100%)",
                      }}
                      disabled={loading}
                    >
                      {loading ? "保存中..." : "保存修改"}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      fullWidth
                      sx={{
                        borderRadius: 3,
                        fontWeight: 600,
                        flex: 1,
                        bgcolor: "#fff",
                        color: "#38B2AC",
                        border: "2px solid #38B2AC",
                        boxShadow: "0 1px 4px rgba(56,178,172,0.08)",
                        "&:hover": {
                          bgcolor: "#E0F7FA",
                          color: "#388E3C",
                          borderColor: "#388E3C",
                        },
                      }}
                    >
                      取消
                    </Button>
                  </Stack>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    disabled={loading}
                    sx={{
                      mt: 2,
                      borderRadius: 3,
                      fontWeight: 600,
                      background:
                        "linear-gradient(90deg, #38B2AC 0%, #388E3C 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #388E3C 0%, #38B2AC 100%)",
                      },
                    }}
                  >
                    {loading ? "添加中..." : "添加"}
                  </Button>
                )}
              </form>
              {error &&
                // 已统一用顶部Snackbar，不再用Alert
                null}
              {success &&
                // 已统一用顶部Snackbar，不再用Alert
                null}
              <List sx={{ mt: 2 }}>
                {contacts.map((c) => (
                  <ListItem
                    key={c.id}
                    divider
                    secondaryAction={
                      <>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEdit(c)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          color="error"
                          onClick={() => handleDelete(c.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemText primary={c.name} secondary={c.email} />
                  </ListItem>
                ))}
              </List>

              {/* 删除联系人确认对话框 */}
              <Dialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                PaperProps={{
                  sx: {
                    background:
                      "linear-gradient(135deg, #4FC3F7 0%, #38B2AC 60%, #388E3C 100%)",
                    color: "#fff",
                    borderRadius: 4,
                    boxShadow: 6,
                    px: 2,
                    py: 1.5,
                    minWidth: 320,
                    backdropFilter: "blur(8px)",
                  },
                }}
              >
                <DialogTitle
                  sx={{
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#fff",
                    textAlign: "center",
                    letterSpacing: 1,
                  }}
                >
                  温馨提示
                </DialogTitle>
                <DialogContent>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: 16,
                      textAlign: "center",
                      mb: 1,
                    }}
                  >
                    确定要删除该联系人吗？
                  </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                  <Button
                    onClick={() => setDeleteOpen(false)}
                    sx={{
                      borderRadius: 3,
                      fontWeight: 700,
                      minWidth: 80,
                      bgcolor: "#fff",
                      color: "#38B2AC",
                      border: "2px solid #38B2AC",
                      boxShadow: "0 1px 4px rgba(56,178,172,0.08)",
                      "&:hover": {
                        bgcolor: "#E0F7FA",
                        color: "#388E3C",
                        borderColor: "#388E3C",
                      },
                    }}
                  >
                    取消
                  </Button>
                  <Button
                    onClick={handleDeleteConfirm}
                    variant="contained"
                    disabled={loading}
                    sx={{
                      borderRadius: 3,
                      fontWeight: 600,
                      minWidth: 80,
                      boxShadow: 2,
                      background:
                        "linear-gradient(90deg, #38B2AC 0%, #388E3C 100%)",
                      color: "#fff",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #388E3C 0%, #38B2AC 100%)",
                      },
                    }}
                  >
                    删除
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </CardContent>
      </Card>
      <ThemedSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMsg}
        autoHideDuration={1800}
      />
      <Typography variant="caption" color="#fff" mt={4}>
        hru · 安心提醒 · {new Date().getFullYear()}
      </Typography>
      <Typography variant="caption" color="#fff" mt={1}>
        作者：Feifei Chen &lt;feifeichen1999@gmail.com&gt;
      </Typography>
    </Box>
  );
}
